"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingAction } from "./actions";

interface OnboardingFormProps {
  initialCompanyName?: string | null;
  initialIndustry?: string | null;
  initialCompanySize?: string | null;
}

export function OnboardingForm({
  initialCompanyName,
  initialIndustry,
  initialCompanySize,
}: OnboardingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await saveOnboardingAction(formData);

    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Failed to save profile.");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Company / Organization Name */}
      <div className="space-y-1.5">
        <label htmlFor="company_name" className="block text-xs font-semibold text-zinc-200">
          Company or Project Name <span className="text-zinc-500">(Optional)</span>
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          defaultValue={initialCompanyName || ""}
          placeholder="e.g. Acme Innovations"
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {/* Industry */}
      <div className="space-y-1.5">
        <label htmlFor="industry" className="block text-xs font-semibold text-zinc-200">
          Primary Industry <span className="text-zinc-500">(Optional)</span>
        </label>
        <select
          id="industry"
          name="industry"
          defaultValue={initialIndustry || ""}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          <option value="">Select industry</option>
          <option value="Technology">Technology</option>
          <option value="Retail">Retail</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Professional Services">Professional Services</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Company Size */}
      <div className="space-y-1.5">
        <label htmlFor="company_size" className="block text-xs font-semibold text-zinc-200">
          Team / Company Size <span className="text-zinc-500">(Optional)</span>
        </label>
        <select
          id="company_size"
          name="company_size"
          defaultValue={initialCompanySize || ""}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          <option value="">Select size</option>
          <option value="Solo">Solo founder</option>
          <option value="2-10">2-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="200+">200+ employees</option>
        </select>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition"
        >
          Skip for now
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
        >
          {loading ? "Saving profile..." : "Continue to Dashboard →"}
        </button>
      </div>
    </form>
  );
}

