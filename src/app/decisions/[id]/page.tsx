import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserUsageSummary } from "@/lib/entitlements";
import {
  getDecisionById,
  getDecisionReport,
  getDecisionOutcome,
  getDecisionReplay,
  parseDecisionReportData,
} from "@/lib/db/decisions";
import { ArchiveButton } from "@/components/decisions/archive-button";
import { DeleteModal } from "@/components/decisions/delete-modal";
import { ReanalyzeDialog } from "@/components/decisions/reanalyze-dialog";
import { AnalysisPoller } from "@/components/decisions/analysis-poller";
import { ReportNavigation } from "@/components/report/report-navigation";
import { ExecutiveStressTest } from "@/components/report/executive-stress-test";
import { AssumptionRiskMap } from "@/components/report/assumption-risk-map";
import { EvidenceGaps } from "@/components/report/evidence-gaps";
import { BlindSpots } from "@/components/report/blind-spots";
import { StakeholderAnalysis } from "@/components/report/stakeholder-analysis";
import { RiskAnalysis } from "@/components/report/risk-analysis";
import { ConsequenceChains } from "@/components/report/consequence-chains";
import { ScenarioAnalysis } from "@/components/report/scenario-analysis";
import { AlternativePaths } from "@/components/report/alternative-paths";
import { KillQuestions } from "@/components/report/kill-questions";
import { FinalStressTest } from "@/components/report/final-stress-test";
import { OutcomeSection } from "@/components/decisions/outcome-section";
import { DecisionAutopsy } from "@/components/autopsy/decision-autopsy";


interface DecisionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const usage = await getUserUsageSummary(user.id);
  const isFree = usage.plan === "free" && !usage.isUnlimited;

  const decision = await getDecisionById(id);

  if (!decision) {
    notFound();
  }

  const [rawReport, outcome, replay] = await Promise.all([
    getDecisionReport(id),
    getDecisionOutcome(id),
    getDecisionReplay(id),
  ]);

  const statusColors: Record<string, string> = {
    draft: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    analyzing: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    archived: "border-zinc-700 bg-zinc-800 text-zinc-400",
  };

  let parsedReport = rawReport ? parseDecisionReportData(rawReport) : null;
  if (parsedReport && isFree) {
    parsedReport = {
      ...parsedReport,
      blind_spots: [],
      alternatives: [],
      kill_questions: [],
      final_stress_test: parsedReport.final_stress_test
    };
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      {/* Top Navbar */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 p-4 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              href={`/decisions/${decision.id}/edit`}
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
            >
              Edit
            </Link>
            {!isFree && (
              <a
                href={`/api/decisions/${decision.id}/pdf`}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 flex items-center space-x-1"
                download="auvora-decision-report.pdf"
              >
                <span>Download PDF</span>
              </a>
            )}
            <ArchiveButton decisionId={decision.id} currentStatus={decision.status} />
            <DeleteModal decisionId={decision.id} decisionTitle={decision.title} />
          </div>
        </div>
      </div>

      {/* Decision Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/30 p-6 md:p-12">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold tracking-tight text-white">{decision.title}</h1>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    statusColors[decision.status] || statusColors["draft"]
                  }`}
                >
                  {decision.status}
                </span>
              </div>
            </div>

            <div>
              <ReanalyzeDialog decisionId={decision.id} hasExistingReport={Boolean(parsedReport)} />
            </div>
          </div>

          {/* Decision Description */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-base text-zinc-300 whitespace-pre-wrap leading-relaxed">
            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Decision Scope / Context
            </span>
            {decision.description}
          </div>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
            {decision.industry && <span>Industry: <strong className="text-zinc-200">{decision.industry}</strong></span>}
            {decision.company_size && <span>Size: <strong className="text-zinc-200">{decision.company_size}</strong></span>}
            {decision.budget != null && <span>Budget: <strong className="text-zinc-200">{decision.budget.toLocaleString()}</strong></span>}
            {decision.timeline && <span>Time Horizon: <strong className="text-zinc-200">{decision.timeline}</strong></span>}
            <span>Created: {new Date(decision.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Sticky Report Navigation (if report exists) */}
      {parsedReport && <ReportNavigation />}

      {/* Report Content / Loading / Empty State Area */}
      <div className="mx-auto max-w-7xl px-6 pt-8 space-y-16">
        {decision.status === "analyzing" ? (
          /* Loading State */
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-blue-500/30 bg-blue-950/20 p-8 text-center space-y-4">
            <AnalysisPoller />
            <div className="flex items-center space-x-3 text-blue-400">
              <svg className="animate-spin h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <h3 className="text-lg font-bold text-white">Stress-testing your decision...</h3>
            </div>
            <p className="max-w-md text-sm text-zinc-300 leading-relaxed">
              Auvora is examining assumptions, evidence gaps, blind spots, risks, second-order consequences, and possible outcomes.
            </p>
          </div>
        ) : !parsedReport ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-5">
            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl font-bold text-white">Put this decision under the microscope.</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Auvora will challenge the assumptions, evidence, risks, consequences, and alternatives behind this decision.
              </p>
            </div>
          </div>
        ) : (
          /* Report Experience (11 Sections) */
            <>
              <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}><ExecutiveStressTest report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '60ms' }}><AssumptionRiskMap report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}><EvidenceGaps report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '180ms' }}>{isFree ? <LockedFeatureCard title="Blind Spots" description="Critical risks you might be ignoring because of cognitive bias." /> : <BlindSpots report={parsedReport} />}</div>
              <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}><StakeholderAnalysis report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><RiskAnalysis report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><ConsequenceChains report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><ScenarioAnalysis report={parsedReport} /></div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>{isFree ? <LockedFeatureCard title="Alternative Paths" description="Better or safer ways to achieve your core goal." /> : <AlternativePaths report={parsedReport} />}</div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>{isFree ? <LockedFeatureCard title="Kill Questions" description="Critical questions designed to challenge the decision and expose deal-breaker risks." /> : <KillQuestions report={parsedReport} />}</div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}><FinalStressTest report={parsedReport} /></div>
            </>
        )}

        {/* Outcome Section (Decision Reality Track) */}
        <OutcomeSection decisionId={decision.id} outcome={outcome} />

        {/* Decision Autopsy Section (Post-Decision Learning Experience) */}
        <DecisionAutopsy
          decisionId={decision.id}
          decisionTitle={decision.title}
          decisionCreatedAt={decision.created_at}
          status={decision.status}
          hasReport={Boolean(parsedReport)}
          outcome={outcome}
          replay={replay}
        />
      </div>
    </main>
  );
}



function LockedFeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <section className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        <p className="text-base text-zinc-400">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center space-y-4">
        <div className="rounded-full bg-zinc-800 p-3">
          <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-lg font-semibold text-white">Available with Pro</h3>
          <p className="text-sm text-zinc-400">Unlock this section to see deeper analysis for this decision.</p>
        </div>
        <Link href="/pricing" className="mt-2 inline-flex rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400">
          Unlock with Pro
        </Link>
      </div>
    </section>
  );
}








