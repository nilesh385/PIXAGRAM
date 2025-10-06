import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import userStore from "@/store/userStore";
import type { User } from "@/types/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Post {
  post_id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  image: string | null;
  created_at: string;
}

const POSTS_PER_PAGE = 6;

export const MyPostsPage: React.FC = () => {
  const { currentUser } = userStore() as { currentUser: User | null };
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch posts
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
    enabled: !!currentUser?.user_id,
  });

  // Delete post
  const deleteMutation = useMutation({
    mutationFn: async (post: Post) => {
      if (post.image) {
        // Extract storage path
        const path = post.image.split("/storage/v1/object/public/images/")[1];
        if (path) {
          await supabase.storage.from("images").remove([path]);
        }
      }
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("post_id", post.post_id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        📸 My Posts
      </h1>

      {isLoading && (
        <p className="text-center text-gray-400">Loading posts...</p>
      )}
      {isError && (
        <p className="text-center text-red-500">Failed to load posts.</p>
      )}

      {!isLoading && data?.length === 0 && (
        <p className="text-center text-gray-500">
          You haven’t created any posts yet.
        </p>
      )}

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((post) => (
            <Card
              key={post.post_id}
              className="relative overflow-hidden shadow-md hover:shadow-lg transition-shadow rounded-xl"
            >
              {/* Delete with confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition">
                    <Trash2 size={18} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The post and its image will
                      be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(post)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {post.image ? (
                <img
                  src={post.image}
                  alt={"Couldn't load the image"}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-11/12 mx-auto rounded-2xl h-48 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <span className="text-3xl font-bold">
                    {post.title && "📝 No Image"}
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="truncate">{post.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {post.description}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Posted on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLoading || (data?.length ?? 0) < POSTS_PER_PAGE}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
