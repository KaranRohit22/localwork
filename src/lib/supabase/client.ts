import { createBrowserClient } from "@supabase/ssr";

declare global {
  interface Window {
    __SUPABASE_URL__?: string;
    __SUPABASE_ANON_KEY__?: string;
  }
}

export function createClient() {
  const url =
    (typeof window !== "undefined" && window.__SUPABASE_URL__) ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://placeholder-project.supabase.co";

  const key =
    (typeof window !== "undefined" && window.__SUPABASE_ANON_KEY__) ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  return createBrowserClient(url, key);
}
