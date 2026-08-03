import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL" && supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY") {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.warn("Supabase credentials missing or set to placeholder values. Running in Local Storage Mode.");
}

export { supabase };
export const isSupabaseConfigured = () => !!supabase;
