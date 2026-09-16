import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  // If user profile has already completed onboarding, skip directly to dashboard
  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-2xl">
        <OnboardingForm />
      </div>
    </main>
  );
}
