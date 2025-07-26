import type { PostType } from "@/types/types";
import { create } from "zustand";

export type PostStore = {
  posts: PostType[];
  setPosts: (posts: PostType) => void;
};
const usePostStore = create((set) => ({
  posts: [],
  setPosts: (posts: PostType) => set({ posts }),
}));

export default usePostStore;
