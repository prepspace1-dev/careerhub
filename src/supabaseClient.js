import { createClient } from "@supabase/supabase-js";

// Production Supabase Cloud Credentials Fallback
const DEFAULT_SUPABASE_URL = "https://kyqvdaexuylcudcrlvwa.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cXZkYWV4dXlsY3VkY3JsdndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NDEyMzksImV4cCI6MjEwMTMxNzIzOX0.sj5TfwSpu9mIEjtfNoU2fb6h0jn467IOEJkuDRpUWl4";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL" && supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY") {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.warn("Supabase credentials missing. Running in Local Storage Mode.");
}

export { supabase };
export const isSupabaseConfigured = () => !!supabase;
