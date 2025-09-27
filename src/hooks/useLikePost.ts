// hooks/useLikePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";

export function useLikePost(postId: string) {
  const { currentUser } = userStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (!currentUser?.user_id) return;

      if (isLiked) {
        // Unlike
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUser.user_id);
      } else {
        // Like (✅ prevent 409 conflict by using upsert)
        await supabase.from("likes").upsert(
          {
            post_id: postId,
            user_id: currentUser.user_id,
          },
          { onConflict: "post_id,user_id" }
        );
      }
    },

    onMutate: async (isLiked) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["feed-posts"] });

      const prevData = queryClient.getQueryData(["feed-posts"]);

      queryClient.setQueryData(["feed-posts"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.post_id === postId
                ? {
                    ...post,
                    likes: {
                      count: isLiked
                        ? post.likes.count - 1
                        : post.likes.count + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(["feed-posts"], ctx.prevData);
      }
    },

    onSuccess: async (_data, isLiked) => {
      // ✅ Ensure cache reflects actual success
      queryClient.setQueryData(["feed-posts"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.post_id === postId
                ? {
                    ...post,
                    likes: {
                      count: isLiked
                        ? post.likes.count - 1
                        : post.likes.count + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });
    },

    onSettled: () => {
      // Re-sync with server in background
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });
}
