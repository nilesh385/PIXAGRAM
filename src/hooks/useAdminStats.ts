// hooks/useAdminStats.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAdminStats(period: "week" | "month" | "year") {
  return useQuery({
    queryKey: ["admin-stats", period],
    queryFn: async () => {
      // Users count
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("created_at");

      if (userError) throw userError;

      // Posts count
      const { data: posts, error: postError } = await supabase
        .from("posts")
        .select("created_at");

      if (postError) throw postError;

      return { users, posts };
    },
  });
}
