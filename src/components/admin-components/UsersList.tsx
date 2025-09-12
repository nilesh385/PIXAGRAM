import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/types";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const USERS_PER_PAGE = 10;

const fetchUsers = async (page: number): Promise<User[]> => {
  const from = page * USERS_PER_PAGE;
  const to = from + USERS_PER_PAGE - 1;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .range(from, to);

  if (error) throw error;
  return data as User[];
};

const UserList = () => {
  const [page, setPage] = useState(0);

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(USERS_PER_PAGE)].map((_, idx) => (
                <Skeleton key={idx} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.user_id} className="bg-muted/50">
                  <CardContent className="flex items-centers gap-6 ">
                    {user.image && (
                      <Avatar>
                        <AvatarImage src={user.image} />
                        <AvatarFallback>
                          {user.fullname?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className="text-lg font-semibold">
                        {user.fullname}
                      </div>
                      <div className="text-muted-foreground">
                        {user.username}{" "}
                      </div>
                    </div>
                    <div>{user.email}</div>
                    <div className="ml-auto">
                      <Button variant="destructive">Block</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </Button>

        <span className="text-muted-foreground">Page {page + 1}</span>

        <Button
          variant="outline"
          disabled={users?.length < USERS_PER_PAGE}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      <Separator />
    </div>
  );
};

export default UserList;
