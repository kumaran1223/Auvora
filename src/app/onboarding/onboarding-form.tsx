"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingAction } from "./actions";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

type Step = 1 | 2 | 3 | 4 | 5 | 6;

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

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [goals, setGoals] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  
  // Business Context Fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");

  const [discoverySource, setDiscoverySource] = useState<string>("");
  const [upgradeInterest, setUpgradeInterest] = useState<string>("");

  const toggleSelection = (
    current: string[],
    value: string,
    setFn: (v: string[]) => void
  ) => {
    if (current.includes(value)) {
      setFn(current.filter((item) => item !== value));
    } else {
      setFn([...current, value]);
    }
  };

  const handleNext = () => {
    if (step === 2 && goals.length === 0) {
      setError("Please select at least one goal.");
      return;
    }
    if (step === 3 && priorities.length === 0) {
      setError("Please select at least one priority.");
      return;
    }
    if (step === 4) {
      if (!fullName.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!industry.trim()) {
        setError("Please enter your industry.");
        return;
      }
      if (!companySize.trim()) {
        setError("Please specify your company size.");
        return;
      }
    }
    if (step === 5 && !discoverySource) {
      setError("Please select how you discovered Auvora.");
      return;
    }

    setError("");
    setStep((prev) => (prev + 1) as Step);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!upgradeInterest) {
      setError("Please select an option.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("goals", JSON.stringify(goals));
      formData.append("priorities", JSON.stringify(priorities));
      formData.append("full_name", fullName);
      formData.append("company_name", companyName);
      formData.append("industry", industry);
      formData.append("company_size", companySize);
      formData.append("discovery_source", discoverySource);
      formData.append("upgrade_interest", upgradeInterest);

      const result = await saveOnboardingAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-10 shadow-2xl transition-all duration-300 hover:border-zinc-700/80 hover:shadow-zinc-900/50 motion-reduce:transition-none">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6 transition-opacity duration-300">
        <div className="text-sm font-semibold uppercase tracking-wider text-amber-500">
          Step {step} of 6
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards motion-reduce:transition-none motion-reduce:animate-none" key={step}>
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-8 text-center py-4">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome to Auvora
              </h1>
              <p className="text-xl text-zinc-300 font-medium">
                AI that challenges the decision — not just answers the question.
              </p>
            </div>
            <p className="text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Auvora helps you stress-test important business decisions by exposing assumptions, evidence gaps, risks, blind spots, and consequences before you commit.
            </p>
            <div className="pt-4">
              <button
                onClick={handleNext}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-bold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
              >
                Let&apos;s get started
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">What do you want Auvora to help you with?</h2>
              <p className="text-sm text-zinc-400">Select all that apply.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleSelection(goals, option, setGoals)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 hover:scale-[1.01] active:scale-[0.99] ${
                    goals.includes(option)
                      ? "border-amber-500/50 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="text-base font-medium">{option}</span>
                  {goals.includes(option) && <CheckIcon className="h-5 w-5 text-amber-500 animate-in zoom-in duration-200 motion-reduce:animate-none" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Priorities */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">What matters most when you&apos;re making an important decision?</h2>
              <p className="text-sm text-zinc-400">Select all that apply.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRIORITIES_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleSelection(priorities, option, setPriorities)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 hover:scale-[1.01] active:scale-[0.99] ${
                    priorities.includes(option)
                      ? "border-amber-500/50 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="text-base font-medium">{option}</span>
                  {priorities.includes(option) && <CheckIcon className="h-5 w-5 text-amber-500 animate-in zoom-in duration-200 motion-reduce:animate-none" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Business Context */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Tell Auvora a little about your business</h2>
              <p className="text-sm text-zinc-400">This helps us understand the context behind your decisions.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300" htmlFor="companyName">Company name <span className="text-zinc-500">(Optional)</span></label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="industry">Industry</label>
                  <input
                    id="industry"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Technology"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="companySize">Company size</label>
                  <select
                    id="companySize"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                  >
                    <option value="" disabled>Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Discovery */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">How did you discover Auvora?</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {DISCOVERY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setDiscoverySource(option)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 hover:scale-[1.01] active:scale-[0.99] ${
                    discoverySource === option
                      ? "border-amber-500/50 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="text-base font-medium">{option}</span>
                  {discoverySource === option && <CheckIcon className="h-5 w-5 text-amber-500 animate-in zoom-in duration-200 motion-reduce:animate-none" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Upgrade Interest */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">If Auvora becomes useful to your workflow, which sounds most like you?</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {UPGRADE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setUpgradeInterest(option)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 hover:scale-[1.01] active:scale-[0.99] ${
                    upgradeInterest === option
                      ? "border-amber-500/50 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="text-base font-medium">{option}</span>
                  {upgradeInterest === option && <CheckIcon className="h-5 w-5 text-amber-500 animate-in zoom-in duration-200 motion-reduce:animate-none" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none">
          {error}
        </div>
      )}

      {/* Navigation Buttons (Step 2+) */}
      {step > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80 transition-opacity duration-300">
          <button
            onClick={handleBack}
            disabled={loading}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 motion-reduce:transition-none"
          >
            Back
          </button>
          
          {step < 6 ? (
            <button
              onClick={handleNext}
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-white px-8 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none"
            >
              {loading ? "Saving..." : "Enter Auvora"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
