import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import userStore from "@/store/userStore";

const PAGE_SIZE = 5;
export type FeedPost = {
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
};

export function useFeedPosts() {
  const { currentUser } = userStore();
  const queryClient = useQueryClient();

  const fetchPosts = async ({ pageParam = 0 }) => {
    if (!currentUser?.followings || currentUser.followings.length === 0) {
      return { posts: [], nextPage: null };
    }

    const { data, error } = await supabase
      .from("feed_posts" as any)
      .select("*")
      .in("user_id", currentUser.followings)
      .order("created_at", { ascending: false })
      .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

    if (error) throw error;

    return {
      posts: (data as unknown as FeedPost[]) || [],
      nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    };
  };

  const query = useInfiniteQuery({
    queryKey: ["feed-posts", currentUser?.user_id],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!currentUser?.user_id,
  });

  // 🔄 Realtime sync (posts, likes, comments)
  useEffect(() => {
    if (!currentUser?.user_id) return;

    const channel = supabase
      .channel("realtime-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["feed-posts", currentUser.user_id],
          })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["feed-posts", currentUser.user_id],
          })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["feed-posts", currentUser.user_id],
          })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.user_id, queryClient]);

  return query;
}
