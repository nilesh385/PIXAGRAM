"use client";

import { useState } from "react";
import { useAdminPosts, useDeletePost } from "@/hooks/useAdminPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function AdminPosts() {
  const [page, setPage] = useState(1);
  const { data: posts, isLoading } = useAdminPosts(page);
  const { mutate: deletePost } = useDeletePost();

  if (isLoading) return <p>Loading posts...</p>;
  if (!posts) return <p>No posts found.</p>;

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        {posts.map((post) => (
          <Card key={post.post_id} className="shadow-md">
            <CardHeader>
              <CardTitle>{post.title || "Untitled Post"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                by {post.users.fullname} (@{post.users.username})
              </p>
            </CardHeader>
            <CardContent>
              <p>{post.description}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="mt-2 rounded-md max-h-64 object-cover"
                />
              )}
              <div className="mt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deletePost({
                            postId: post.post_id,
                            imageUrl: post.image,
                          })
                        }
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}

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
