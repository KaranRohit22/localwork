import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  // In demo / mock mode or if Supabase env vars are not set on Vercel, pass through safely
  if (!url || !key || url.includes("placeholder-project")) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes (Customer & Professional Dashboard)
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const hasAdminCookie =
      request.cookies.get("localwork_admin_authorized")?.value === "true";

    if (isDashboard && !user && !hasAdminCookie) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Auth pages redirect if already logged in
    const authPaths = ["/login", "/register"];
    const isAuthPage = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isAuthPage && user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("Supabase middleware error:", err);
  }

  return supabaseResponse;
}
