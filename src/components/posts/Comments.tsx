import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface CommentsProps {
  post_id: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

const Comments: React.FC<CommentsProps> = ({ post_id }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, user_id, created_at")
        .eq("post_id", post_id)
        .order("created_at", { ascending: true });

      if (!error) setComments(data || []);
    };

    fetchComments();
  }, [post_id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id, content: newComment, user_id: "CURRENT_USER_ID" }])
      .select("*")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data]);
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-64 overflow-y-auto space-y-2">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="border-b border-gray-200 pb-2">
              <p className="text-sm">{c.content}</p>
              <span className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Write a comment..."
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Comments;
