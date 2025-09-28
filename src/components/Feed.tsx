// components/feed/Feed.tsx
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import PostCard from "./posts/PostCard";
import PostSkeleton from "./posts/PostSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useFeedPosts();
  const { ref, inView } = useInView();

  // Auto-load next page when last element is in view
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (status === "pending") {
    return (
      <ScrollArea className="h-[80vh] rounded-md border p-4">
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (status === "error") {
    return (
      <ScrollArea className="h-[80vh] rounded-md border p-4">
        <p className="text-center text-red-500">Failed to load feed</p>
      </ScrollArea>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <ScrollArea className="h-[80vh] rounded-md border p-4">
      <div className="flex flex-col gap-6">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Follow some users to see their posts here.
          </p>
        ) : (
          posts.map((post, idx) => (
            <div
              key={post.post_id}
              ref={idx === posts.length - 1 ? ref : undefined}
            >
              <PostCard post={post} />
            </div>
          ))
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin size-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
