// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
