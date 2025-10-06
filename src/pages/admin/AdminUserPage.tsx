"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useToggleBlockUser } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminLayout from "@/components/admin/AdminLayuout";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useAdminUsers(page);
  const { mutate: toggleBlock } = useToggleBlockUser();

  if (isLoading) return <p>Loading users...</p>;
  if (!users) return <p>No users found.</p>;

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.is_blocked ? "Blocked" : "Active"}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        {user.is_blocked ? "Unblock" : "Block"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.is_blocked ? "Unblock User?" : "Block User?"}
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            toggleBlock({
                              userId: user.user_id,
                              isBlocked: user.is_blocked,
                            })
                          }
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
