import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/types";
import { useEffect, useState } from "react";

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("is_blocked", true);
      setBlockedUsers(data || []);
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblockUser = async (userId: string) => {
    const { error } = await supabase
      .from("users")
      .update({ is_blocked: false })
      .eq("user_id", userId);

    if (error) {
      console.error("Error unblocking user:", error);
    } else {
      console.log("User unblocked successfully");
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profile</TableHead>
          <TableHead>Fullname</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blockedUsers.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No blocked users found
            </TableCell>
          </TableRow>
        )}
        {blockedUsers.length > 0 &&
          blockedUsers.map((u) => (
            <TableRow key={u.user_id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={u.image} alt={u.username} />
                  <AvatarFallback>{u.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{u.fullname}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                {new Date(u.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => handleUnblockUser(u.user_id)}
                >
                  Unblock
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
