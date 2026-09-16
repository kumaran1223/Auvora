import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getHistoricalDecisionEvidence,
  getLatestPatternReport,
} from "@/lib/db/decision-patterns";
import { PatternsClient } from "@/components/patterns/patterns-client";

export default async function DecisionPatternsPage() {
  const supabase = await createClient();

  // 1. Enforce server-side authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Load historical evidence and latest pattern report in parallel
  const [historyResult, latestReport] = await Promise.all([
    getHistoricalDecisionEvidence(),
    getLatestPatternReport(user.id),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <PatternsClient initialHistory={historyResult} initialReport={latestReport} />
      </div>
    </main>
  );
}

