import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jrfxywyiohfzwaibrjhv.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZnh5d3lpb2hmendhaWJyamh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDY2NDcsImV4cCI6MjEwOTEyMjY0N30.5_8CRRPGQLGOEuMcsm5EVlUMdyipEe9EEI9AFs-MGHM";

// Universal Supabase Client for Bhai Jeweller
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
