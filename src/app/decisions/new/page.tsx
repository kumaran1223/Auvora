"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDecisionAction } from "@/app/decisions/actions";

export default function NewDecisionPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createDecisionAction(formData);
      if (res.success && res.decisionId) {
        router.push(`/decisions/${res.decisionId}`);
      } else {
        setError(res.error || "Failed to create decision.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Put a decision under test</h1>
            <p className="text-xs text-zinc-400">Expose blind spots and stress-test assumptions before committing resources.</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Link>
        </div>

        {error && (
          <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Decision Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-semibold text-zinc-200">
              Decision title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Expand sales team into European market in Q3"
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label htmlFor="description" className="block text-xs font-semibold text-zinc-200">
                What decision are you trying to make? <span className="text-red-400">*</span>
              </label>
              <span className="text-[10px] text-zinc-500">Max 5,000 characters</span>
            </div>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={5000}
              placeholder="Describe the core decision, key choices available, primary objectives, and assumptions..."
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {/* Context / Why Now */}
          <div className="space-y-1.5">
            <label htmlFor="why_now" className="block text-xs font-medium text-zinc-300">
              What changed or created the need to decide now? <span className="text-zinc-500">(Optional)</span>
            </label>
            <textarea
              id="why_now"
              name="why_now"
              rows={3}
              placeholder="What triggered this opportunity or deadline? e.g. Competitor launch, runway limit, customer request..."
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Industry */}
            <div className="space-y-1.5">
              <label htmlFor="industry" className="block text-xs font-medium text-zinc-300">
                Industry <span className="text-zinc-500">(Optional)</span>
              </label>
              <select
                id="industry"
                name="industry"
                defaultValue=""
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="" disabled>Select industry</option>
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
              <label htmlFor="company_size" className="block text-xs font-medium text-zinc-300">
                Company size <span className="text-zinc-500">(Optional)</span>
              </label>
              <select
                id="company_size"
                name="company_size"
                defaultValue=""
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="" disabled>Select size</option>
                <option value="Solo">Solo</option>
                <option value="2-10">2-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Estimated Budget */}
            <div className="space-y-1.5">
              <label htmlFor="budget" className="block text-xs font-medium text-zinc-300">
                Estimated budget <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                step="any"
                placeholder="e.g. 50000"
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            {/* Time Horizon */}
            <div className="space-y-1.5">
              <label htmlFor="timeline" className="block text-xs font-medium text-zinc-300">
                Time horizon <span className="text-zinc-500">(Optional)</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                defaultValue=""
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="" disabled>Select timeframe</option>
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="1+ year">1+ year</option>
              </select>
            </div>
          </div>

          {/* Success Definition */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label htmlFor="success_definition" className="block text-xs font-medium text-zinc-300">
                What would a successful outcome look like? <span className="text-zinc-500">(Optional)</span>
              </label>
              <span className="text-[10px] text-zinc-500">Max 5,000 characters</span>
            </div>
            <textarea
              id="success_definition"
              name="success_definition"
              rows={3}
              maxLength={5000}
              placeholder="e.g. Achieving $100k ARR within 6 months while keeping CAC under $300..."
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <Link
              href="/dashboard"
              className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
            >
              {loading ? "Creating decision..." : "Stress-test with Auvora"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

