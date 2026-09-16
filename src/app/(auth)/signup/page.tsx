"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const IconChallenge = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const IconSearch = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const IconAlert = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
const IconActivity = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
const IconCompare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
);

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        const errorMessage = signUpError.message?.toLowerCase() || "";
        
        if (signUpError.status === 429 || errorMessage.includes("rate limit")) {
          setError("Too many signup attempts. Please wait a few minutes and try again.");
        } else if (
          errorMessage.includes("already registered") ||
          errorMessage.includes("already exists") ||
          signUpError.status === 409
        ) {
          setError("An account may already exist with this email. Try signing in instead.");
        } else if (errorMessage.includes("invalid email") || errorMessage.includes("email address")) {
          setError("Please enter a valid email address.");
        } else {
          setError("We couldn't create your account right now. Please try again later.");
        }
        
        setLoading(false);
        return;
      }

      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("We couldn't create your account right now. Please try again later.");
      setLoading(false);
    }
  };

  const valueProps = [
    { icon: <IconChallenge className="h-5 w-5 text-amber-400" />, label: "Challenge assumptions" },
    { icon: <IconSearch className="h-5 w-5 text-blue-400" />, label: "Find missing information" },
    { icon: <IconAlert className="h-5 w-5 text-red-400" />, label: "Expose hidden risks" },
    { icon: <IconActivity className="h-5 w-5 text-purple-400" />, label: "Understand consequences" },
    { icon: <IconCompare className="h-5 w-5 text-emerald-400" />, label: "Compare alternatives" },
  ];

  return (
    <main className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex w-full flex-col lg:flex-row">
        
        {/* Left Side - Value Proposition */}
        <div className="relative hidden w-full flex-col justify-center border-r border-zinc-800 bg-zinc-900/40 p-12 lg:flex lg:w-1/2 xl:p-24 animate-in fade-in duration-700 motion-reduce:transition-none motion-reduce:animate-none">
          <div className="mx-auto max-w-lg space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white xl:text-5xl">
                Welcome to Auvora
              </h1>
              <p className="text-xl font-medium text-zinc-300">
                AI that challenges the decision — not just answers the question.
              </p>
              <p className="text-base leading-relaxed text-zinc-400">
                Auvora helps you stress-test important business decisions before you commit.
              </p>
            </div>

            <div className="space-y-4">
              {valueProps.map((prop, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-4 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 motion-reduce:transition-none delay-100 animate-in slide-in-from-left-4 fade-in fill-mode-backwards"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                    {prop.icon}
                  </div>
                  <span className="text-base font-semibold text-zinc-200">{prop.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2 xl:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:transition-none motion-reduce:animate-none">
          <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 sm:p-10 shadow-2xl transition-all duration-300 hover:border-zinc-700/80 hover:shadow-zinc-900/50 motion-reduce:transition-none">
            
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white">Create account</h2>
              <p className="text-sm text-zinc-400">Get started with Auvora AI decision intelligence</p>
            </div>

            {error && (
              <div className="rounded-md border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="text-center text-sm text-zinc-400 pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-zinc-200 underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded px-1 -mx-1">
                Sign in
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

