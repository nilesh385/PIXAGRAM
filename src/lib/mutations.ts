// services/mutations.ts
import { supabase } from "@/lib/supabase";
import {
  type CreatePostInput,
  type CreatePostResponse,
  type LikePostInput,
  type UnlikePostInput,
  type LikeResponse,
  type AddCommentInput,
  type CommentResponse,
  type FollowUserInput,
} from "@/types/types";

// --- Create Post ---
export async function createPost(
  input: CreatePostInput
): Promise<CreatePostResponse> {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: input.user_id,
      image: input.image || null,
      title: input.title || null,
      description: input.description || null,
    })
    .select("post_id, created_at")
    .single();

  if (error) throw error;
  return data;
}

// --- Like Post ---
export async function likePost(input: LikePostInput): Promise<LikeResponse> {
  const { data, error } = await supabase
    .from("likes")
    .insert({
      user_id: input.user_id,
      post_id: input.post_id,
    })
    .select("id, post_id, user_id")
    .single();

  if (error) throw error;
  return data;
}

// --- Unlike Post ---
export async function unlikePost(input: UnlikePostInput): Promise<void> {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", input.user_id)
    .eq("post_id", input.post_id);

  if (error) throw error;
}

// --- Add Comment ---
export async function addComment(
  input: AddCommentInput
): Promise<CommentResponse> {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: input.user_id,
      post_id: input.post_id,
      content: input.content,
    })
    .select("id, content, created_at, user_id, post_id")
    .single();

  if (error) throw error;
  return data;
}

// --- Follow User ---
export async function followUser(input: FollowUserInput): Promise<void> {
  // Assuming you store followings as arrays in users table
  const { error } = await supabase.rpc("follow_user", {
    follower_id: input.follower_id,
    followings_id: input.following_id,
  });

  if (error) throw error;
}
