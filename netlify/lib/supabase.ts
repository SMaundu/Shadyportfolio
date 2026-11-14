import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config";

let client: SupabaseClient | null | undefined;

/** Service-role client (bypasses RLS). Server-only. Returns null when not configured. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = config.supabaseUrl();
  const key = config.supabaseServiceKey();
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

/** For tests. */
export const __resetSupabase = () => {
  client = undefined;
};
