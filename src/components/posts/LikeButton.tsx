// components/feed/LikeButton.tsx
import { useLikePost } from "@/hooks/useLikePost";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import likeAnimation from "@/assets/like.json";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import userStore from "@/store/userStore";

export default function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const { currentUser } = userStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const { mutate } = useLikePost(postId);

  // preload whether this user has liked the post
  useEffect(() => {
    const fetchIsLiked = async () => {
      if (!currentUser?.user_id) return;
      const { data, error } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", currentUser.user_id)
        .maybeSingle();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchIsLiked();
  }, [postId, currentUser]);

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    mutate(isLiked);
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={toggleLike}
    >
      <div className={cn("w-10 h-10")}>
        {isLiked ? (
          <Lottie animationData={likeAnimation} loop={false} autoplay />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7 text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.707C11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        )}
      </div>
      <span className="text-sm">{likes}</span>
    </div>
  );
}
