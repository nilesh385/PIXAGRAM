// hooks/useAdminUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const USERS_PER_PAGE = 10;

export function useAdminUsers(page: number) {
  return useQuery({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      const from = (page - 1) * USERS_PER_PAGE;
      const to = from + USERS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useToggleBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isBlocked,
    }: {
      userId: string;
      isBlocked: boolean | null;
    }) => {
      const { error } = await supabase
        .from("users")
        .update({ is_blocked: !isBlocked })
        .eq("user_id", userId);

      if (error) throw error;
      return { userId, isBlocked: !isBlocked };
    },
    onMutate: async ({ userId, isBlocked }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-users"] });

      const prevData = queryClient.getQueryData<any>(["admin-users"]);

      queryClient.setQueryData(["admin-users"], (old: any) => {
        if (!old) return old;
        return old.map((u: any) =>
          u.user_id === userId ? { ...u, is_blocked: !isBlocked } : u
        );
      });

      return { prevData };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData)
        queryClient.setQueryData(["admin-users"], ctx.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
