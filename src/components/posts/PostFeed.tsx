// components/PostsFeed.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePostsFeed } from "@/hooks/usePostsFeed";
import type { Post } from "@/types/types";

interface PostsFeedProps {
  currentUserId: string;
}

const PostsFeed: React.FC<PostsFeedProps> = ({ currentUserId }) => {
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const { data, isLoading, isFetching } = usePostsFeed(
    currentUserId,
    page,
    limit
  );

  const posts: Post[] = (data?.posts as unknown as Post[]) || [];
  const total: number = data?.total || 0;
  const totalPages: number = Math.ceil(total / limit);

  return (
    <ScrollArea className="h-[calc(100vh-120px)] w-full md:w-2/3 md:flex md:mx-auto md:my-auto rounded-2xl border p-4">
      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: limit }).map((_, idx) => (
            <Card key={idx} className="rounded-2xl">
              <CardContent className="p-4">
                <Skeleton className="w-12 h-12 rounded-full mb-4" />
                <Skeleton className="w-full h-48 rounded-xl mb-4" />
                <Skeleton className="w-1/2 h-4" />
              </CardContent>
            </Card>
          ))
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No posts from followed users.
          </p>
        ) : (
          posts.map((post) => (
            <Card key={post.post_id} className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.users?.image || "/default-avatar.png"}
                    alt={post.users?.username || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{post.users?.username}</span>
                </div>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-xl mb-3"
                />
                <h2 className="font-semibold">{post.title}</h2>
                {post.description && (
                  <p className="text-sm text-gray-700 mb-3">
                    {post.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4">
            <Button
              variant="outline"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages || isFetching}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default PostsFeed;
