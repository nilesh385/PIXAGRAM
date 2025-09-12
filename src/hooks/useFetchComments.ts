import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";
import type { CommentType } from "@/types/types";
import { supabase } from "@/lib/supabase";

const fetchComments = async (
  post_id: string,
  supabase: SupabaseClient<Database>
): Promise<CommentType[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post_id);
  if (error) {
    console.log("Error while fetching comments:: ", error.message);
    return [];
  }
  const comments = data as CommentType[];

  return comments;
};

export default function useFetchComments(post_id: string) {
  const query = useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchComments(post_id, supabase),
  });
  return query;
}
