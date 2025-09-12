import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/types/db";
import type { PostType } from "@/types/types";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";

const fetchPosts = async (
  supabase: SupabaseClient<Database>
): Promise<PostType[] | null> => {
  // Fetch current followings
  const currentUser = userStore((state: any) => state.currentUser);
  const { data: currentFollowings, error: followingsError } = await supabase
    .from("users")
    .select("followings")
    .eq("user_id", currentUser?.user_id);

  if (followingsError) {
    console.error("Error fetching followings:", followingsError);
    return [];
  }

  if (!currentFollowings || currentFollowings.length === 0) {
    return [];
  }

  const followedUserIds: string[] = [];
  currentFollowings.forEach((userRow: any) => {
    followedUserIds.push(userRow);
  });

  // Fetch posts for all followed users concurrently
  const fetchPromises = followedUserIds.map(async (user_id) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error(`Error fetching posts for user ${user_id}:`, error);
      return [];
    }
    return data || [];
  });

  const allPostsArrays = await Promise.all(fetchPromises);

  // Flatten the array of arrays into a single array of posts
  const combinedPosts = allPostsArrays.flat();

  return combinedPosts;
};

export default function useFetchPosts() {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(supabase),
  });

  return query;
}
