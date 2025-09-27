// components/feed/AddCommentForm.tsx
import { useAddComment } from "@/hooks/useAddComment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddCommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useAddComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
