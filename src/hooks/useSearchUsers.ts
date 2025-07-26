import { useEffect, useState } from "react";
import useCreateClerkSupabaseClient from "./useCreateClerkSupabaseClient";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

const searchUsers = async (
  supabase: SupabaseClient<Database>,
  text: string
) => {
  if (!text) return [];
  const { data, error } = await supabase
    ?.from("users")
    .select("*")
    .or(`username.ilike.%${text}%, fullname.ilike.%${text}`);

  if (error) throw error;
  return data;
};
export default function useSearchUsers(text: string) {
  const supabase = useCreateClerkSupabaseClient();
  const [searchText, setSearchText] = useState(text);

  const query = useQuery({
    queryKey: ["searchUsers", searchText],
    queryFn: () => searchUsers(supabase, searchText),
    enabled: searchText.length >= 2,
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(text);
      if (text.length >= 2) {
        query.refetch();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [text, query]);
  return query;
}
