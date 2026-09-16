"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage(null);

    if (!email) {
      setStatus("error");
      setMessage("Please fill in your email address.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Prevent account enumeration by showing success regardless of true failure,
        // unless it's a rate limit or other critical error that needs user action, 
        // but instructions say: "If an account exists for that email, we've sent a password reset link."
      }

      setStatus("success");
      setMessage("If an account exists for that email, we've sent a password reset link.");
    } catch {
      setStatus("success");
      setMessage("If an account exists for that email, we've sent a password reset link.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset your password</h1>
          <p className="text-sm text-zinc-400">Enter your email and we&apos;ll send you a secure password reset link.</p>
        </div>

        {status === "error" && message && (
          <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400">
            {message}
          </div>
        )}

        {status === "success" && message && (
          <div className="rounded-md border border-emerald-900/50 bg-emerald-950/40 p-3 text-sm text-emerald-400">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
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
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-400">
          <Link href="/login" className="font-medium text-zinc-200 underline hover:text-white">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
