import { z } from "zod";
export type User = {
  user_id: string;
  username: string;
  fullname: string;
  email: string;
  image: string;
  role: string;
  created_at: string;
};
export type PostType = {
  id: string;
  user_id: string;
  image_url?: string | null;
  title?: string | null;
  description?: string | null;
  created_at: string;
};
export type CommentType = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_liked: boolean;
  created_at: string;
};
export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required.",
  }),
  description: z.string(),
  image: z.string(),
});
export const commentSchema = z.object({
  content: z.string({ required_error: "Comment is required." }),
  is_liked: z.boolean(),
});

export type Post = z.infer<typeof postSchema>;
export type Comment = z.infer<typeof commentSchema>;
