import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchFollowedPosts = async (
  currentUserId: string,
  page: number,
  limit: number
) => {
  // Fetch following list
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("following")
    .eq("user_id", currentUserId)
    .single();

  if (userError || !userData)
    throw new Error(userError?.message || "Failed to fetch following list");

  const followingIds = userData.following || [];

  if (followingIds.length === 0) return { posts: [], total: 0 };

  // Pagination range
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Fetch posts
  const {
    data: postsData,
    count,
    error: postsError,
  } = await supabase
    .from("posts")
    .select(
      `
      post_id,
      user_id,
      title,
      description,
      image,
      created_at,
      users:user_id (
        username,
        image
      )
      `,
      { count: "exact" }
    )
    .in("user_id", followingIds)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (postsError) throw new Error(postsError.message);

  return {
    posts: postsData || [],
    total: count || 0,
  };
};

export const usePostsFeed = (
  currentUserId: string,
  page: number,
  limit = 5
) => {
  return useQuery({
    queryKey: ["followed-posts", currentUserId, page],
    queryFn: () => fetchFollowedPosts(currentUserId, page, limit),
    // keepPreviousData: true,
  });
};
