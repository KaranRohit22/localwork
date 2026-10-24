import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  // Use request to ensure route is evaluated dynamically
  const urlParams = new URL(request.url).searchParams;
  const _force = urlParams.get("t");
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isPlaceholder = !url || url.includes("placeholder-project");

  if (isPlaceholder) {
    return NextResponse.json({
      connected: false,
      status: "mock_mode",
      message: "Supabase environment variables are missing or not applied to this deployment.",
      diagnosticChecks: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? "PRESENT (Value: " + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + "...)"
          : "NOT SET (Missing in Vercel)",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "PRESENT"
          : "NOT SET (Missing in Vercel)",
        SUPABASE_SERVICE_ROLE_KEY: serviceKey
          ? "PRESENT"
          : "NOT SET (Missing in Vercel)",
        SUPABASE_URL_alternative: process.env.SUPABASE_URL
          ? "PRESENT (Rename to NEXT_PUBLIC_SUPABASE_URL)"
          : "NOT SET",
        vercelEnvironment: process.env.VERCEL_ENV || "unknown / localhost",
      },
      nextStepAction: "Make sure variables are added in Vercel under Project Settings -> Environment Variables with [x] Production checked, then Redeploy without build cache.",
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
        message: "Supabase URL is connected, but query failed. Did you run the SQL migration (001_initial_schema.sql)?",
        errorDetails: error.message,
        supabaseUrl: url,
      });
    }

    return NextResponse.json({
      connected: true,
      status: "live",
      message: "Supabase is successfully connected and responding with live data!",
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
