import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import useCreateClerkSupabaseClient from "./useCreateClerkSupabaseClient";

const fetchPosts = async (supabase: SupabaseClient) => {
  const { data: currentFollowings } = await supabase
    .from("users")
    .select("followings");
  currentFollowings?.map(async (user_id) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user_id);
  });
};

const useFetchPosts = () => {
  const supabase = useCreateClerkSupabaseClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(supabase),
  });
};
