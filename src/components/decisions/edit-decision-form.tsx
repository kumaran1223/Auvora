"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateDecisionAction } from "@/app/decisions/actions";
import type { Decision } from "@/types/database";

interface EditDecisionFormProps {
  decision: Decision;
}

export function EditDecisionForm({ decision }: EditDecisionFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await updateDecisionAction(decision.id, formData);
      if (res.success) {
        router.push(`/decisions/${decision.id}`);
        router.refresh();
      } else {
        setError(res.error || "Failed to update decision.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Decision Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-semibold text-zinc-200">
          Decision title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={decision.title}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-semibold text-zinc-200">
          Description / What you are considering <span className="text-red-400">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={decision.description}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Industry */}
        <div className="space-y-1.5">
          <label htmlFor="industry" className="block text-sm font-medium text-zinc-300">
            Industry
          </label>
          <select
            id="industry"
            name="industry"
            defaultValue={decision.industry || ""}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            <option value="">None selected</option>
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
          <label htmlFor="company_size" className="block text-sm font-medium text-zinc-300">
            Company size
          </label>
          <select
            id="company_size"
            name="company_size"
            defaultValue={decision.company_size || ""}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            <option value="">None selected</option>
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
          <label htmlFor="budget" className="block text-sm font-medium text-zinc-300">
            Estimated budget
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            step="any"
            defaultValue={decision.budget != null ? decision.budget : ""}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>

        {/* Time Horizon */}
        <div className="space-y-1.5">
          <label htmlFor="timeline" className="block text-sm font-medium text-zinc-300">
            Time horizon
          </label>
          <select
            id="timeline"
            name="timeline"
            defaultValue={decision.timeline || ""}
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            <option value="">None selected</option>
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
        <label htmlFor="success_definition" className="block text-sm font-medium text-zinc-300">
          What would make this decision successful?
        </label>
        <textarea
          id="success_definition"
          name="success_definition"
          rows={3}
          defaultValue={decision.success_definition || ""}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <Link
          href={`/decisions/${decision.id}`}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none"
        >
          {loading ? "Updating..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

