// components/feed/PostCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";

export default function PostCard({ post }: { post: any }) {
  return (
    <Card className="w-full max-w-xl mx-auto shadow-md rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <img
          src={post.users?.image || "/default-avatar.png"}
          alt={post.users?.username}
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{post.users?.fullname}</span>
          <span className="text-xs text-muted-foreground">
            @{post.users?.username}
          </span>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(post.created_at).toLocaleString()}
        </span>
      </CardHeader>

      {/* Image */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full max-h-[500px] object-cover"
      />

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {post.title && <h3 className="font-semibold">{post.title}</h3>}
        {post.description && (
          <p className="text-sm text-muted-foreground">{post.description}</p>
        )}

        {/* Likes + Comments */}
        <div className="flex items-center gap-6">
          <LikeButton
            postId={post.post_id}
            initialLikes={post.likes?.count ?? 0}
          />
          <span className="text-sm text-muted-foreground">
            {post.comments?.count ?? 0} comments
          </span>
        </div>

        {/* Comments Section */}
        <CommentsSection postId={post.post_id} />
      </CardContent>
    </Card>
  );
}
