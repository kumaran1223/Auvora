import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
    "https://giyahlefsqyhtewdlslc.supabase.co";
  const supabasePublishableKey =
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
    "placeholder-publishable-key";

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll called from Server Component; safe to ignore when middleware handles refresh
        }
      },
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, cache: "no-store" });
      },
    },
  });
}
