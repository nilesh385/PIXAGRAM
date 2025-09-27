// UserSearchBar.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import UserCard from "./UserCard";
import userStore from "@/store/userStore";

import type { SearchedUser } from "@/types/types";
import { followUser, unfollowUser } from "@/lib/followFunctions";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 5;

const UserSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { currentUser } = userStore();
  const queryClient = useQueryClient();

  // 🔹 Fetch users
  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery<SearchedUser[]>({
    queryKey: ["search-users", searchTerm, page],
    queryFn: async () => {
      if (!searchTerm) return [];

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("users")
        .select("user_id, username, fullname, image, role")
        .ilike("username", `%${searchTerm}%`)
        .neq("role", "admin")
        .neq("user_id", currentUser?.user_id!)
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: false,
    staleTime: 600,
  });

  // 🔹 Optimistic follow mutation
  const followMutation = useMutation({
    mutationFn: (userId: string) => followUser(currentUser!.user_id, userId),
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["search-users", searchTerm, page],
      });

      const prevUsers = queryClient.getQueryData<SearchedUser[]>([
        "search-users",
        searchTerm,
        page,
      ]);

      queryClient.setQueryData<SearchedUser[]>(
        ["search-users", searchTerm, page],
        (old = []) =>
          old.map((u) =>
            u.user_id === userId ? { ...u, isFollowing: true } : u
          )
      );

      return { prevUsers };
    },
    onError: (_err, _variables, context) => {
      if (context?.prevUsers) {
        queryClient.setQueryData(
          ["search-users", searchTerm, page],
          context.prevUsers
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["followers-following", currentUser?.user_id],
      });
    },
  });

  // 🔹 Optimistic unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: (userId: string) => unfollowUser(currentUser!.user_id, userId),
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["search-users", searchTerm, page],
      });

      const prevUsers = queryClient.getQueryData<SearchedUser[]>([
        "search-users",
        searchTerm,
        page,
      ]);

      queryClient.setQueryData<SearchedUser[]>(
        ["search-users", searchTerm, page],
        (old = []) =>
          old.map((u) =>
            u.user_id === userId ? { ...u, isFollowing: false } : u
          )
      );

      return { prevUsers };
    },
    onError: (_err, _variables, context) => {
      if (context?.prevUsers) {
        queryClient.setQueryData(
          ["search-users", searchTerm, page],
          context.prevUsers
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["followers-following", currentUser?.user_id],
      });
    },
  });

  // 🔹 Realtime subscription
  useEffect(() => {
    if (!currentUser?.user_id) return;

    const channel = supabase
      .channel("realtime-users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["search-users", searchTerm, page],
          });
          queryClient.invalidateQueries({
            queryKey: ["followers-following", currentUser.user_id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.user_id, queryClient, searchTerm, page]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-5">
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 className="animate-spin size-4" /> : "Search"}
        </Button>
      </div>

      {/* Scrollable Results */}
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div className="flex flex-col gap-4">
          {users.length === 0 && !isFetching && (
            <p className="text-sm text-gray-500">No users found</p>
          )}
          {users.map((user) => (
            <UserCard
              key={user.user_id}
              user={user}
              isInitiallyFollowing={currentUser?.followings?.includes(
                user.user_id
              )} // ✅ Zustand truth
              followMutation={{
                mutate: () => followMutation.mutate(user.user_id),
                isPending: followMutation.isPending,
              }}
              unfollowMutation={{
                mutate: () => unfollowMutation.mutate(user.user_id),
                isPending: unfollowMutation.isPending,
              }}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">Page {page}</span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < PAGE_SIZE}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
