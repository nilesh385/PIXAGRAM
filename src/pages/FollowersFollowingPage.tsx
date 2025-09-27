import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import userStore from "@/store/userStore";
import { useFollowUser } from "@/hooks/useFollowUser";
import { useUnfollowUser } from "@/hooks/useUnfollowUser";

interface RelationUser {
  user_id: string;
  username: string;
  fullname: string;
  image: string | null;
}

export default function FollowersFollowingPage() {
  const { currentUser } = userStore();
  const queryClient = useQueryClient();

  const [searchFollowers, setSearchFollowers] = useState("");
  const [searchFollowing, setSearchFollowing] = useState("");

  // ✅ Use hooks instead of writing follow/unfollow mutations here
  const followUser = useFollowUser(currentUser?.user_id || "");
  const unfollowUser = useUnfollowUser(currentUser?.user_id || "");

  const fetchRelations = async (): Promise<{
    followers: RelationUser[];
    followings: RelationUser[];
  }> => {
    if (!currentUser) return { followers: [], followings: [] };

    const { data: followersData } = await supabase
      .from("users")
      .select("user_id, username, fullname, image")
      .in("user_id", currentUser.followers || []);

    const { data: followingData } = await supabase
      .from("users")
      .select("user_id, username, fullname, image")
      .in("user_id", currentUser.followings || []);

    return {
      followers: followersData || [],
      followings: followingData || [],
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["followers-following", currentUser?.user_id],
    queryFn: fetchRelations,
    enabled: !!currentUser,
  });

  // --- Realtime Sub ---
  useEffect(() => {
    if (!currentUser?.user_id) return;

    const channel = supabase
      .channel("realtime-followers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          const newRow = payload.new as { user_id: string };
          if (newRow?.user_id === currentUser.user_id) {
            queryClient.invalidateQueries({
              queryKey: ["followers-following", currentUser.user_id],
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.user_id, queryClient]);

  if (isLoading) return <p className="p-6">Loading followers & following...</p>;

  const filteredFollowers =
    data?.followers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchFollowers.toLowerCase()) ||
        user.fullname.toLowerCase().includes(searchFollowers.toLowerCase())
    ) || [];

  const filteredFollowing =
    data?.followings.filter(
      (user) =>
        user.username.toLowerCase().includes(searchFollowing.toLowerCase()) ||
        user.fullname.toLowerCase().includes(searchFollowing.toLowerCase())
    ) || [];

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Followers & Following</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Followers */}
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
            <Input
              placeholder="Search followers..."
              value={searchFollowers}
              onChange={(e) => setSearchFollowers(e.target.value)}
              className="mt-2"
            />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {filteredFollowers.length === 0 && (
                <p className="text-gray-500">No followers found.</p>
              )}
              <ul className="space-y-3">
                {filteredFollowers.map((user) => (
                  <li
                    key={user.user_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image || "/default-avatar.png"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.fullname}</p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    {!currentUser?.followings?.includes(user.user_id) ? (
                      <Button
                        size="sm"
                        onClick={() => followUser.mutate(user.user_id)}
                        disabled={followUser.isPending}
                      >
                        {followUser.isPending ? "Following..." : "Follow Back"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => unfollowUser.mutate(user.user_id)}
                        disabled={unfollowUser.isPending}
                      >
                        {unfollowUser.isPending ? "Unfollowing..." : "Unfollow"}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Following */}
        <Card>
          <CardHeader>
            <CardTitle>Following</CardTitle>
            <Input
              placeholder="Search following..."
              value={searchFollowing}
              onChange={(e) => setSearchFollowing(e.target.value)}
              className="mt-2"
            />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {filteredFollowing.length === 0 && (
                <p className="text-gray-500">No following found.</p>
              )}
              <ul className="space-y-3">
                {filteredFollowing.map((user) => (
                  <li
                    key={user.user_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image || "/default-avatar.png"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.fullname}</p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => unfollowUser.mutate(user.user_id)}
                      disabled={unfollowUser.isPending}
                    >
                      {unfollowUser.isPending ? "Unfollowing..." : "Unfollow"}
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
