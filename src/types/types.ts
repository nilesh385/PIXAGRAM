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
  title: string;
  description: string;
  image: string;
  created_at: string;
  users?: Pick<User, "username" | "image">; // joined field
}

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
export type PostSchemaType = z.infer<typeof postSchema>;
