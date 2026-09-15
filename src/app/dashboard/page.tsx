import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Retrieve user's profile securely via RLS
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, plan, created_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-950 text-zinc-100 text-center">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">Auvora</h1>
        <p className="text-xl text-zinc-300">You&apos;re signed in.</p>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Account:</span>
            <span className="font-mono text-zinc-200">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Current Plan:</span>
            <span className="font-semibold uppercase tracking-wider text-emerald-400">
              {profile?.plan || "free"}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

