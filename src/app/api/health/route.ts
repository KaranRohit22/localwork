import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !url || url.includes("placeholder-project");

  if (isPlaceholder) {
    return NextResponse.json({
      connected: false,
      status: "mock_mode",
      message: "Supabase environment variables are not configured yet (using mock mode).",
      supabaseUrl: url || "not set",
    });
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("service_categories")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        connected: false,
        status: "error",
        message: "Connected to Supabase URL, but database query failed.",
        error: error.message,
        supabaseUrl: url,
      });
    }

    return NextResponse.json({
      connected: true,
      status: "live",
      message: "Supabase is successfully connected and responding!",
      supabaseUrl: url,
      categoriesCount: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({
      connected: false,
      status: "error",
      message: err instanceof Error ? err.message : "Failed to connect to Supabase",
    });
  }
}
