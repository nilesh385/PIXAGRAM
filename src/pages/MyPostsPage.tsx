import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import userStore from "@/store/userStore"; // Import your zustand store
import type { User } from "@/types/types";

interface Post {
  post_id: string;
  user_id: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
}

const POSTS_PER_PAGE = 5;

export const MyPostsPage: React.FC = () => {
  const { currentUser } = userStore() as { currentUser: User | null };
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-posts", currentUser?.user_id, page],
    queryFn: async (): Promise<Post[]> => {
      if (!currentUser?.user_id) return [];
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", currentUser.user_id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!currentUser?.user_id, // Only run query when user is available
    // keepPreviousData: true,
  });

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl text-center font-bold mb-4">My Posts</h1>

      {!currentUser && (
        <p className="text-gray-500">Please log in to view your posts.</p>
      )}

      {isLoading && <p>Loading posts...</p>}
      {isError && <p className="text-red-500">Failed to load posts.</p>}

      {!isLoading && data?.length === 0 && (
        <p className="text-gray-500">You haven't created any posts yet.</p>
      )}

      <ScrollArea className="h-[calc(100vh-15rem)] w-full md:w-6/12 md:flex md:mx-auto md:my-auto rounded-md border p-4">
        <div className="grid gap-4">
          {data?.map((post) => (
            <Card key={post.post_id} className="shadow-md">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <p className="text-gray-700">{post.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Posted on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLoading || (data?.length ?? 0) < POSTS_PER_PAGE}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
