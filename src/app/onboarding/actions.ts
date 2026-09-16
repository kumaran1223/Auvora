"use server";

import { createClient } from "@/lib/supabase/server";

const GOALS_OPTIONS = [
  "Make better business decisions",
  "Identify hidden risks",
  "Challenge my assumptions",
  "Evaluate new opportunities",
  "Plan growth",
  "Compare alternatives",
];

const PRIORITIES_OPTIONS = [
  "Reduce risk",
  "Find missing information",
  "Understand consequences",
  "Challenge assumptions",
  "Compare alternatives",
  "Make decisions faster",
];

const DISCOVERY_OPTIONS = [
  "Search",
  "Social media",
  "Friend or colleague",
  "Product recommendation",
  "Other",
];

const UPGRADE_OPTIONS = [
  "I may upgrade when I need more usage",
  "I'll explore the Free plan first",
  "I'm just evaluating Auvora for now",
];

export async function saveOnboardingAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication required." };
    }

    let goals: string[] = [];
    let priorities: string[] = [];
    try {
      goals = JSON.parse(formData.get("goals") as string);
      priorities = JSON.parse(formData.get("priorities") as string);
    } catch {
      return { error: "Invalid data format." };
    }

    const discoverySource = formData.get("discovery_source") as string;
    const upgradeInterest = formData.get("upgrade_interest") as string;
    const fullName = (formData.get("full_name") as string)?.trim() || null;
    const companyName = (formData.get("company_name") as string)?.trim() || null;
    const industry = (formData.get("industry") as string)?.trim() || null;
    const companySize = (formData.get("company_size") as string)?.trim() || null;

    // Validation
    if (!Array.isArray(goals) || goals.length === 0 || goals.length > GOALS_OPTIONS.length) {
      return { error: "Please select valid goals." };
    }
    if (!goals.every((g) => GOALS_OPTIONS.includes(g))) {
      return { error: "Invalid goal selection." };
    }

    if (!Array.isArray(priorities) || priorities.length === 0 || priorities.length > PRIORITIES_OPTIONS.length) {
      return { error: "Please select valid priorities." };
    }
    if (!priorities.every((p) => PRIORITIES_OPTIONS.includes(p))) {
      return { error: "Invalid priority selection." };
    }

    if (!DISCOVERY_OPTIONS.includes(discoverySource)) {
      return { error: "Invalid discovery source." };
    }

    if (!UPGRADE_OPTIONS.includes(upgradeInterest)) {
      return { error: "Invalid upgrade interest." };
    }

    const onboarding_data = {
      goals,
      priorities,
      discovery_source: discoverySource,
      upgrade_interest: upgradeInterest,
    };

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company_name: companyName,
        industry: industry,
        company_size: companySize,
        onboarding_data,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Onboarding save error:", error);
      return { error: "Failed to save onboarding information." };
    }

    return { success: true };
  } catch (err) {
    console.error("Onboarding unexpected error:", err);
    return { error: "An unexpected error occurred." };
  }
}
