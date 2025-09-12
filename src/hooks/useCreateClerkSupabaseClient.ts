// import type { Database } from "@/types/db";
// import { useSession } from "@clerk/clerk-react";
// import { createClient } from "@supabase/supabase-js";
// import { useMemo } from "react";

// function CreateClerkSupabaseClient() {
//   const { session } = useSession();

//   const supabaseClient = useMemo(() => {
//     return createClient<Database>(
//       import.meta.env.VITE_SUPABASE_URL!,
//       import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
//       {
//         global: {
//           fetch: async (url, options = {}) => {
//             const clerkToken = await session!.getToken();

//             const headers = new Headers(options?.headers);
//             headers.set("Authorization", `Bearer ${clerkToken}`);
//             return fetch(url, {
//               ...options,
//               headers,
//             });
//           },
//         },
//       }
//     );
//   }, [session]);

//   return supabaseClient;
// }

// const supabase = CreateClerkSupabaseClient();

// export default supabase;
