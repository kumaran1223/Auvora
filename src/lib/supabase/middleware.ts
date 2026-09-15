import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
    "https://giyahlefsqyhtewdlslc.supabase.co";
  const supabasePublishableKey =
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
    "placeholder-publishable-key";

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
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

  let user = null;
  try {
    // Refresh user session safely from server
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // If Supabase is unconfigured or unreachable, treat user as unauthenticated
    user = null;
  }

  const pathname = request.nextUrl.pathname;

  // 1. Protect /dashboard route: unauthenticated users redirect to /login
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c);
    });
    return redirectResponse;
  }

  // 2. Authenticated users visiting /login or /signup redirect to /dashboard
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
