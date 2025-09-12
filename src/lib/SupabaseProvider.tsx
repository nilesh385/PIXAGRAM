import { useEffect } from "react";
import { useSession } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
}

const SupabaseProvider = ({ children }: Props) => {
  const { session } = useSession();

  useEffect(() => {
    const authenticate = async () => {
      const token = await session?.getToken();
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: "", // Clerk doesn't use refresh tokens with Supabase
        });
      }
    };

    authenticate();
  }, [session]);

  return <>{children}</>;
};

export default SupabaseProvider;
