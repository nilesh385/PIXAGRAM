// hooks/useAddComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";

export function useAddComment(postId: string) {
  const { currentUser } = userStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!currentUser?.user_id) return;

      const { data, error } = await supabase.from("comments").insert([
        {
          post_id: postId,
          user_id: currentUser.user_id,
          content,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onMutate: async (content: string) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const prevData = queryClient.getQueryData(["comments", postId]);

      queryClient.setQueryData(["comments", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, idx: number) =>
            idx === 0
              ? {
                  ...page,
                  comments: [
                    {
                      comment_id: `temp-${Date.now()}`,
                      content,
                      user_id: currentUser?.user_id,
                      users: {
                        username: currentUser?.username,
                        fullname: currentUser?.fullname,
                        image: currentUser?.image,
                      },
                      created_at: new Date().toISOString(),
                    },
                    ...page.comments,
                  ],
                }
              : page
          ),
        };
      });

      return { prevData };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(["comments", postId], ctx.prevData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}
