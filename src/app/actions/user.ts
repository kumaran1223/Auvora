"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function deleteUserAccount() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user || !user.id) {
    return { error: "You must be signed in to delete your account." };
  }

  const userId = user.id;

  const { data: activeSub, error: subError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .in("status", ["active", "authenticated"])
    .eq("cancel_at_period_end", false)
    .maybeSingle();

  if (subError) {
    return { error: "Unable to verify your subscription status. Please try again." };
  }

  if (activeSub) {
    return { error: "Please cancel your active subscription before deleting your account." };
  }

  const adminClient = getAdminSupabaseClient();
  if (!adminClient) {
    return { error: "Unable to delete your account right now. Please try again." };
  }

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    return { error: "Unable to delete your account right now. Please try again." };
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
  if (deleteError) {
    return { error: "Unable to delete your account right now. Please try again." };
  }

  redirect("/");
}

