import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import Lottie from "lottie-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Comments from "./Comments"; // The separate component
import heartAnimation from "@/assets/Like.json";
import { supabase } from "@/lib/supabase";

interface PostActionsProps {
  post_id: string;
  user_id: string;
}

const PostActions: React.FC<PostActionsProps> = ({ post_id, user_id }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    // Fetch whether the user has liked this post (Supabase)
    const fetchLikeStatus = async () => {
      const { data } = await supabase
        .from("comments")
        .select("is_liked")
        .eq("post_id", post_id)
        .eq("user_id", user_id)
        .single();

      setIsLiked(data?.is_liked || false);
    };

    fetchLikeStatus();
  }, [post_id, user_id]);

  const handleLike = async () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeAnimating(true);

    // Update in Supabase
    await supabase
      .from("comments")
      .upsert({ post_id, user_id, is_liked: newLikeState });

    setTimeout(() => setLikeAnimating(false), 1000);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleLike}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
      >
        {likeAnimating ? (
          <Lottie
            animationData={heartAnimation}
            loop={false}
            className="w-6 h-6"
          />
        ) : (
          <Heart
            className={`w-6 h-6 ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        )}
      </button>

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
            <MessageCircle className="w-6 h-6 text-gray-500" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <Comments post_id={post_id} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostActions;
