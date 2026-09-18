import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export function getAdminSupabaseClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const secretKey = process.env["SUPABASE_SECRET_KEY"];

  if (!url || !secretKey) {
    return null;
  }

  return createClient(url, secretKey);
}

export async function isAdmin(userId?: string): Promise<boolean> {
  try {
    let targetUserId = userId;

    if (!targetUserId) {
      const supabase = await createServerClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || !user.id) {
        return false;
      }
      targetUserId = user.id;
    }

    const adminClient = getAdminSupabaseClient();
    if (!adminClient) {
      return false;
    }

    const { data, error } = await adminClient
      .from("admin_users")
      .select("id")
      .eq("id", targetUserId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

