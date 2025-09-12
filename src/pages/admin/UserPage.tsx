"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/types";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("role", "user")
        .order("created_at", { ascending: false });
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: string) => {
    const { error } = await supabase
      .from("users")
      .update({ is_blocked: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error blocking user:", error);
    } else {
      console.log("User blocked successfully");
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
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No users found
            </TableCell>
          </TableRow>
        )}
        {users.length > 0 &&
          users.map((u) => {
            if (!u.is_blocked) {
              return (
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
                      onClick={() => handleBlockUser(u.user_id)}
                    >
                      Block
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }
          })}
      </TableBody>
    </Table>
  );
}
