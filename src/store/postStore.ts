import type { PostType } from "@/types/types";
import { create } from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  setPosts: (posts: PostType) => set({ posts }),
}));

export default usePostStore;
