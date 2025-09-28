// components/feed/CommentsSection.tsx
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import AddCommentForm from "./AddCommentForm";
import CommentSkeleton from "./CommentSkeleton";

export default function CommentsSection({ postId }: { postId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useComments(postId);

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {status === "pending" &&
          Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
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

      {/* Add Comment Form */}
      <AddCommentForm postId={postId} />
    </div>
  );
}
