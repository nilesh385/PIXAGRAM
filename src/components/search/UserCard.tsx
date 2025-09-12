import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SearchedUser, User } from "@/types/types";
import { Loader2 } from "lucide-react";

interface UserCardProps {
  user: User | SearchedUser;
  isFollowing?: boolean;
  followMutation?: {
    mutate: () => void;
    isPending: boolean;
  };
  unfollowMutation?: {
    mutate: () => void;
    isPending: boolean;
  };
}

export default function UserCard({
  user,
  isFollowing,
  followMutation,
  unfollowMutation,
}: UserCardProps) {
  return (
    <Card className="w-full ">
      <CardContent className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img
            src={user.image!}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-200">{user.fullname}</span>
            <span className="text-sm text-gray-500">@{user.username}</span>
          </div>
        </div>

        {/* Right Section */}
        <div>
          {followMutation &&
            unfollowMutation &&
            (isFollowing ? (
              <Button
                variant="secondary"
                onClick={() => unfollowMutation.mutate()}
                disabled={unfollowMutation.isPending}
              >
                {unfollowMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Unfollow"
                )}
              </Button>
            ) : (
              <Button
                onClick={() => followMutation.mutate()}
                disabled={followMutation.isPending}
              >
                {followMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Follow"
                )}
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
