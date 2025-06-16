import type { User } from "@/types/types";
import { create } from "zustand";

const userStore = create((set) => ({
  currentUser: null,
  searchedUsers: [],
  setCurrentUser: (user: User) => set({ currentUser: user }),
  setSearchedUsers: (users: User[]) => set({ searchedUsers: users }),
}));
export default userStore;
