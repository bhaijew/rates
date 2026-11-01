import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jrfxywyiohfzwaibrjhv.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Browser & Server Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
