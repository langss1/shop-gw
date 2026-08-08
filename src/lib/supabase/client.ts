import { createBrowserClient } from "@supabase/ssr";

import { SUPABASE_KEY, SUPABASE_URL } from "./config";

/** Supabase client untuk komponen client (form admin, upload storage). */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
