// hooks/useAdminPosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const POSTS_PER_PAGE = 5;

export function useAdminPosts(page: number) {
  return useQuery({
    queryKey: ["admin-posts", page],
    queryFn: async () => {
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("posts")
        .select("*, users(username, fullname)")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      imageUrl,
    }: {
      postId: string;
      imageUrl?: string | null;
    }) => {
      // Delete post
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("post_id", postId);
      if (error) throw error;

      // Delete image from storage if exists
      if (imageUrl) {
        const path = imageUrl.split("/").pop(); // extract filename
        if (path) {
          await supabase.storage.from("images").remove([`users/${path}`]);
        }
      }

      return postId;
    },
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-posts"] });

      const prevData = queryClient.getQueryData<any>(["admin-posts"]);

      queryClient.setQueryData(["admin-posts"], (old: any) => {
        if (!old) return old;
        return old.filter((p: any) => p.post_id !== postId);
      });

      return { prevData };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData)
        queryClient.setQueryData(["admin-posts"], ctx.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });
}
