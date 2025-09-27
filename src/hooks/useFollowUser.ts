// hooks/useFollowUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser } from "@/lib/followFunctions";
import userStore from "@/store/userStore";

export function useFollowUser(currentUserId: string) {
  const queryClient = useQueryClient();
  const { currentUser, setCurrentUser } = userStore();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      await followUser(currentUserId, targetUserId);
      return targetUserId;
    },
    onSuccess: (targetUserId) => {
      if (!currentUser) return;
      // update Zustand instantly
      setCurrentUser({
        ...currentUser,
        followings: [...(currentUser.followings ?? []), targetUserId],
      });
      // invalidate queries to sync
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["followings"] });
    },
  });
}
