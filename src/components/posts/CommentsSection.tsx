// components/feed/CommentsSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import AddCommentForm from "./AddCommentForm";
import CommentSkeleton from "./CommentSkeleton";

export default function CommentsSection({ postId }: { postId: string }) {
  const [showComments, setShowComments] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useComments(postId);

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowComments((prev) => !prev)}
      >
        {showComments ? "Hide comments" : "View comments"}
      </Button>

      {showComments && (
        <div className="space-y-2">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {status === "pending" &&
              Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <img
                  src={c.users?.image || "/default-avatar.png"}
                  alt={c.users?.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-muted px-3 py-2 rounded-xl">
                  <p className="text-sm font-medium">{c.users?.fullname}</p>
                  <p className="text-sm text-muted-foreground">{c.content}</p>
                </div>
              </div>
            ))}
            {hasNextPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                Load more
              </Button>
            )}
          </div>
          <AddCommentForm postId={postId} />
        </div>
      )}
    </div>
  );
}
