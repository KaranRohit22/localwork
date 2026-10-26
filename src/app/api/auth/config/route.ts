import { NextResponse } from "next/server";

export async function GET() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://placeholder-project.supabase.co";

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  const isConfigured = !url.includes("placeholder-project");

  // Extract project ref if standard supabase url
  let projectRef: string | null = null;
  try {
    const parsed = new URL(url);
    const hostParts = parsed.hostname.split(".");
    if (hostParts.length >= 3 && parsed.hostname.endsWith(".supabase.co")) {
      projectRef = hostParts[0];
    }
  } catch {
    // Ignore invalid url
  }

  return NextResponse.json({
    url,
    anonKey,
    isConfigured,
    projectRef,
    serverTimestamp: new Date().toISOString(),
  });
}
