import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Heart } from "lucide-react";
import useCreateClerkSupabaseClient from "@/hooks/useCreateClerkSupabaseClient";
import { useUser } from "@clerk/clerk-react";
import type { CommentType, PostType } from "@/types/types";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const POSTS_PER_PAGE = 10;

const fetchPosts = async (page: number): Promise<PostType[]> => {
  const supabase = useCreateClerkSupabaseClient();
  const from = page * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
};

const fetchCommentsByPost = async (postId: string): Promise<CommentType[]> => {
  const supabase = useCreateClerkSupabaseClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

const AllPostsWithComments = () => {
  const [page, setPage] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const supabase = useCreateClerkSupabaseClient();

  const currentUser = useUser(); // Make sure session exists

  const { data: posts = [], isLoading } = useQuery<PostType[], Error>({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60,
  });

  const { data: comments = [] } = useQuery<CommentType[], Error>({
    queryKey: ["comments", selectedPostId],
    queryFn: () => fetchCommentsByPost(selectedPostId!),
    enabled: !!selectedPostId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.from("comments").insert({
        post_id: selectedPostId,
        user_id: currentUser.user?.id,
        content: newComment,
        is_liked: false,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast("Comment Posted!!");
      queryClient.invalidateQueries({ queryKey: ["comments", selectedPostId] });
      setNewComment("");
    },
    onError: () => {
      toast("Error posting comment");
    },
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {isLoading && posts.length === 0 && (
        <div className="grid gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[60%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {isLoading === false && posts.length === 0 && (
        <div>
          <h1>No Posts Found</h1>
        </div>
      )}
      {isLoading === false &&
        posts.length > 0 &&
        posts.map((post) => {
          const postComments =
            comments?.filter((c) => c.post_id === post.id && c.content) || [];
          const isLikedByUser = comments?.some(
            (c) =>
              c.post_id === post.id &&
              c.is_liked &&
              c.user_id === currentUser.user?.id
          );

          return (
            <Card key={post.id} className="bg-muted/50">
              {post.image_url && (
                <img
                  src={post.image_url!}
                  alt={post.title || "Post"}
                  className="rounded-t-xl w-full max-h-60 object-cover"
                />
              )}
              <CardContent className="p-4 space-y-2">
                {post.title && (
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                )}
                {post.description && (
                  <p className="text-muted-foreground">{post.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Posted on {new Date(post.created_at).toLocaleString()}
                </p>

                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-1">
                    <Heart
                      className={`w-5 h-5 ${
                        isLikedByUser
                          ? "text-red-500 fill-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm">
                      {
                        comments.filter(
                          (c) => c.post_id === post.id && c.is_liked
                        ).length
                      }
                    </span>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedPostId(post.id)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{postComments.length}</span>
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Comments</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {postComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="text-sm border-b border-muted-foreground/20 pb-2"
                          >
                            {comment.content}
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                        />
                        <Button
                          onClick={handleAddComment}
                          disabled={addCommentMutation.isPending}
                        >
                          Post
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          Previous
        </Button>

        <span className="text-muted-foreground">Page {page + 1}</span>

        <Button
          variant="outline"
          disabled={posts.length < POSTS_PER_PAGE}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <Separator />
    </div>
  );
};

export default AllPostsWithComments;
