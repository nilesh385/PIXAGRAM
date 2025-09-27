// hooks/useUnfollowUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "@/lib/followFunctions";
import userStore from "@/store/userStore";

export function useUnfollowUser(currentUserId: string) {
  const queryClient = useQueryClient();
  const { currentUser, setCurrentUser } = userStore();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      await unfollowUser(currentUserId, targetUserId);
      return targetUserId;
    },
    onSuccess: (targetUserId) => {
      if (!currentUser) return;
      // update Zustand instantly
      setCurrentUser({
        ...currentUser,
        followings: (currentUser.followings ?? []).filter(
          (id) => id !== targetUserId
        ),
      });
      // invalidate queries to sync
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["followings"] });
    },
  });
}
