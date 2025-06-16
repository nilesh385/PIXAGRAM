import { z } from "zod";
export type User = {
  user_id: string;
  username: string;
  fullname: string;
  email: string;
  image: string;
  bio: string;
  created_at: string;
};

export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required.",
  }),
  description: z.string(),
  image: z.string(),
});

export type Post = z.infer<typeof postSchema>;
