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
import { Button } from "@/components/ui/button";
import type { PostType } from "@/types/types";
import { toast } from "sonner";

export function PostsPage() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, users(username)")
        .order("created_at", { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (post_id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", post_id);
    if (error) {
      toast("Error deleting post :: " + error?.message);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.length === 0 && (
          <TableCell colSpan={5} className="text-center py-4">
            No posts found
          </TableCell>
        )}
        {posts.length > 0 &&
          posts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <img
                  src={p.image_url!}
                  alt={p.title!}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.description}</TableCell>
              <TableCell>{p.user_id}</TableCell>
              <TableCell>
                {new Date(p.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant={"destructive"}
                  className={"cursor-pointer"}
                  onClick={() => handleDeletePost(p.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
