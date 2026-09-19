import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/decisions/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/pricing",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password"
  ],
};
