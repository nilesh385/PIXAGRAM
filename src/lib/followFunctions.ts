import { supabase } from "@/lib/supabase";

// Define only the fields we care about
type FollowFields = {
  followings?: string[];
  followers?: string[];
};

/**
 * Follow a user
 */
export async function followUser(
  currentUserId: string,
  targetUserId: string
): Promise<void> {
  if (!currentUserId || !targetUserId) throw new Error("Invalid user ids");
  if (currentUserId === targetUserId)
    throw new Error("You cannot follow yourself.");

  // Try atomic RPC first
  try {
    const { error: rpcError } = await supabase.rpc("follow_user", {
      follower_id: currentUserId,
      followings_id: targetUserId,
    });
    if (!rpcError) return;
    console.warn("follow_user rpc failed, falling back:", rpcError.message);
  } catch (err) {
    console.warn("follow_user rpc thrown:", err);
  }

  // Fallback logic
  const [
    { data: currentData, error: curErr },
    { data: targetData, error: tgtErr },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("followings")
      .eq("user_id", currentUserId)
      .single<FollowFields>(),
    supabase
      .from("users")
      .select("followers")
      .eq("user_id", targetUserId)
      .single<FollowFields>(),
  ]);

  if (curErr) throw curErr;
  if (tgtErr) throw tgtErr;

  const currentFollowing: string[] = currentData?.followings ?? [];
  const targetFollowers: string[] = targetData?.followers ?? [];

  const newFollowing = Array.from(new Set([...currentFollowing, targetUserId]));
  const newFollowers = Array.from(new Set([...targetFollowers, currentUserId]));

  const [{ error: up1 }, { error: up2 }] = await Promise.all([
    supabase
      .from("users")
      .update({ followings: newFollowing })
      .eq("user_id", currentUserId),
    supabase
      .from("users")
      .update({ followers: newFollowers })
      .eq("user_id", targetUserId),
  ]);

  if (up1 || up2)
    throw new Error(up1?.message || up2?.message || "Failed to follow user");
}

/**
 * Unfollow a user
 */
export async function unfollowUser(
  currentUserId: string,
  targetUserId: string
): Promise<void> {
  if (!currentUserId || !targetUserId) throw new Error("Invalid user ids");
  if (currentUserId === targetUserId)
    throw new Error("You cannot unfollow yourself.");

  // Try atomic RPC first
  try {
    const { error: rpcError } = await supabase.rpc("unfollow_user", {
      follower_id: currentUserId,
      followings_id: targetUserId,
    });
    if (!rpcError) return;
    console.warn("unfollow_user rpc failed, falling back:", rpcError.message);
  } catch (err) {
    console.warn("unfollow_user rpc thrown:", err);
  }

  // Fallback logic
  const [
    { data: currentData, error: curErr },
    { data: targetData, error: tgtErr },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("followings")
      .eq("user_id", currentUserId)
      .single<FollowFields>(),
    supabase
      .from("users")
      .select("followers")
      .eq("user_id", targetUserId)
      .single<FollowFields>(),
  ]);

  if (curErr) throw curErr;
  if (tgtErr) throw tgtErr;

  const currentFollowing: string[] = currentData?.followings ?? [];
  const targetFollowers: string[] = targetData?.followers ?? [];

  const newFollowing = currentFollowing.filter((id) => id !== targetUserId);
  const newFollowers = targetFollowers.filter((id) => id !== currentUserId);

  const [{ error: up1 }, { error: up2 }] = await Promise.all([
    supabase
      .from("users")
      .update({ followings: newFollowing })
      .eq("user_id", currentUserId),
    supabase
      .from("users")
      .update({ followers: newFollowers })
      .eq("user_id", targetUserId),
  ]);

  if (up1 || up2)
    throw new Error(up1?.message || up2?.message || "Failed to unfollow user");
}
