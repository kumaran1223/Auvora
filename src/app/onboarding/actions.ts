"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication required." };
    }

    const companyName = (formData.get("company_name") as string | null)?.trim() || null;
    const industry = (formData.get("industry") as string | null)?.trim() || null;
    const companySize = (formData.get("company_size") as string | null)?.trim() || null;

    const { error } = await supabase
      .from("profiles")
      .update({
        company_name: companyName,
        industry: industry,
        company_size: companySize,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update error:", error);
      return { error: "Failed to update profile information." };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "An unexpected error occurred." };
  }
}
