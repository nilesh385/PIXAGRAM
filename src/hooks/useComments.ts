// hooks/useComments.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

const PAGE_SIZE = 5;
export type CommentWithUser = {
  id: string; // ✅ correct field name
  content: string;
  created_at: string;
  user_id: string;
  users: {
    username: string;
    fullname: string;
    image: string | null;
  };
};

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  const fetchComments = async ({ pageParam = 0 }) => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        users:user_id (
          username,
          fullname,
          image
        )
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

    if (error) throw error;

    return {
      comments: (data as CommentWithUser[]) || [],
      nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    };
  };

  const query = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: fetchComments,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // 🔄 Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, queryClient]);

  return query;
}
