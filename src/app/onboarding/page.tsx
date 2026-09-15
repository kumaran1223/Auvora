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
    .select("company_name, industry, company_size")
    .eq("id", user.id)
    .maybeSingle();

  // If user profile already has company details, skip directly to dashboard
  if (profile?.company_name && profile?.industry && profile?.company_size) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Step 1 of 2 • Welcome to Auvora
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tell us about your organization
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Auvora uses your company context to calibrate decision risk analysis, stakeholder impacts, and stress-test scenarios.
          </p>
        </div>

        <OnboardingForm
          initialCompanyName={profile?.company_name}
          initialIndustry={profile?.industry}
          initialCompanySize={profile?.company_size}
        />
      </div>
    </main>
  );
}

