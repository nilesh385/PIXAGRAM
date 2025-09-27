import { z } from "zod";

export type PostType = {
  post_id: string;
  user_id: string;
  image_url?: string | null;
  title?: string | null;
  description?: string | null;
  created_at: string;
};

export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required.",
  }),
  description: z.string(),
  image: z.string(),
});
// types/database.ts
export interface User {
  user_id: string;
  username: string;
  fullname: string;
  email: string;
  image: string;
  followings: string[];
  followers: string[];
  role: string;
  is_blocked: boolean;
  created_at: string;
}

export interface Post {
  post_id: string;
  user_id: string;
  image?: string | null;
  title?: string | null;
  description?: string | null;
  created_at: string;
  users: User;
  likes: Like[];
  comments: Comment[];
}
export type Like = {
  id: string;
  user_id: string;
};

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_liked: boolean;
  created_at: string;
}

export interface SearchedUser {
  user_id: string;
  username: string;
  fullname: string;
  image: string | null;
  role: string | null;
}

export type FeedPost = {
  post_id: string;
  created_at: string;
  title: string | null;
  description: string | null;
  image: string | null;
  user: {
    user_id: string;
    username: string;
  };
  likes: { user_id: string }[];
  comments: { id: string; content: string; user_id: string }[];
};
export type PostSchemaType = z.infer<typeof postSchema>;

// types.ts

// --- Create Post ---
export type CreatePostInput = {
  user_id: string;
  image?: string | null;
  title?: string | null;
  description?: string | null;
};

export type CreatePostResponse = {
  post_id: string;
  created_at: string;
};

// --- Like / Unlike Post ---
export type LikePostInput = {
  user_id: string;
  post_id: string;
};

export type UnlikePostInput = {
  user_id: string;
  post_id: string;
};

export type LikeResponse = {
  id: string;
  post_id: string;
  user_id: string;
};

// --- Add Comment ---
export type AddCommentInput = {
  user_id: string;
  post_id: string;
  content: string;
};

export type CommentResponse = {
  id: string;
  content: string;
  created_at: string | null;
  user_id: string | null;
  post_id: string | null;
};

// --- Follow / Unfollow User ---
export type FollowUserInput = {
  follower_id: string;
  following_id: string;
};
