import type { User } from "@/types/types";
import { create } from "zustand";

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  refreshRelations: boolean;
  toggleRefreshRelations: () => void;
}

const userStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user: User | null) => set({ currentUser: user }),
  refreshRelations: false,
  toggleRefreshRelations: () =>
    set((state) => ({ refreshRelations: !state.refreshRelations })),
}));
export default userStore;
