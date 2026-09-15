import { createClient } from "@/lib/supabase/server";
import type { Decision, DecisionOutcome, DecisionReport, DecisionReplay } from "@/types/database";

export type EvidenceProvenance = "ORIGINAL_AUVORA" | "USER_REPORTED" | "REPLAY_INFERENCE";

export interface HistoricalDecisionEvidence {
  decision: {
    id: string;
    title: string;
    description: string;
    industry: string | null;
    company_size: string | null;
    budget: number | null;
    timeline: string | null;
    success_definition: string | null;
    created_at: string;
    updated_at: string;
  };
  outcome: {
    id: string;
    status: string;
    actual_outcome: Record<string, unknown> | null;
    recorded_at: string | null;
    created_at: string;
    updated_at: string;
    provenance: "USER_REPORTED";
  };
  original_analysis: {
    assumptions: unknown[];
    evidence_gaps: unknown[];
    blind_spots: unknown[];
    stakeholders: unknown[];
    consequences: unknown[];
    scenarios: unknown[];
    alternatives: unknown[];
    final_stress_test: Record<string, unknown>;
    provenance: "ORIGINAL_AUVORA";
  };
  replay: {
    available: boolean;
    inconsistent?: boolean;
    id?: string;
    outcome_recorded_at?: string;
    alignment_score?: number;
    overall_verdict?: string;
    key_takeaway?: string;
    assumption_results?: unknown[];
    risk_results?: unknown[];
    blind_spot_results?: unknown[];
    lessons_learned?: string[];
    created_at?: string;
    updated_at?: string;
    provenance?: "REPLAY_INFERENCE";
  };
}

export interface DecisionPatternsHistoryResult {
  status: "insufficient_history" | "ready";
  eligibleDecisionCount: number;
  minimumRequired: 3;
  decisions: HistoricalDecisionEvidence[];
}

/**
 * Retrieve normalized historical evidence for Phase 10C decision pattern aggregation.
 * Zero OpenAI requests, zero quota consumption, strictly server-authenticated.
 */
export async function getHistoricalDecisionEvidence(): Promise<DecisionPatternsHistoryResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "insufficient_history",
      eligibleDecisionCount: 0,
      minimumRequired: 3,
      decisions: [],
    };
  }

  // 1. Fetch completed decisions belonging to the authenticated user in parallel
  const [decisionsRes, outcomesRes, reportsRes, replaysRes] = await Promise.all([
    supabase
      .from("decisions")
      .select("id, user_id, title, description, industry, company_size, budget, timeline, success_definition, status, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("decision_outcomes")
      .select("id, decision_id, user_id, outcome_status, actual_outcome, outcome_notes, recorded_at, created_at, updated_at")
      .eq("user_id", user.id),
    supabase
      .from("decision_reports")
      .select("id, decision_id, user_id, assumptions, evidence_gaps, blind_spots, stakeholders, consequences, scenarios, alternatives, final_stress_test")
      .eq("user_id", user.id),
    supabase
      .from("decision_replays")
      .select("id, decision_id, user_id, outcome_id, outcome_recorded_at, alignment_score, overall_verdict, key_takeaway, assumption_results, risk_results, blind_spot_results, lessons_learned, created_at, updated_at")
      .eq("user_id", user.id),
  ]);

  const rawDecisions = (decisionsRes.data as Decision[]) || [];
  const rawOutcomes = (outcomesRes.data as DecisionOutcome[]) || [];
  const rawReports = (reportsRes.data as DecisionReport[]) || [];
  const rawReplays = (replaysRes.data as DecisionReplay[]) || [];

  const outcomeMap = new Map<string, DecisionOutcome>();
  rawOutcomes.forEach((o) => outcomeMap.set(o.decision_id, o));

  const reportMap = new Map<string, DecisionReport>();
  rawReports.forEach((r) => reportMap.set(r.decision_id, r));

  const replayMap = new Map<string, DecisionReplay>();
  rawReplays.forEach((rp) => replayMap.set(rp.decision_id, rp));

  // 2. Filter eligible decisions: MUST be completed AND have a recorded outcome
  const eligibleDecisions = rawDecisions.filter((d) => outcomeMap.has(d.id));

  // 3. Bound dataset to maximum 20 most recent eligible decisions
  const boundedEligible = eligibleDecisions.slice(0, 20);
  const eligibleCount = eligibleDecisions.length;

  // 4. Minimum history check (3 eligible decisions required)
  if (eligibleCount < 3) {
    return {
      status: "insufficient_history",
      eligibleDecisionCount: eligibleCount,
      minimumRequired: 3,
      decisions: [],
    };
  }

  // 5. Map normalized evidence structure
  const evidenceList: HistoricalDecisionEvidence[] = boundedEligible.map((decision) => {
    const outcome = outcomeMap.get(decision.id)!;
    const report = reportMap.get(decision.id);
    const replay = replayMap.get(decision.id);

    // Replay consistency check
    let replaySection: HistoricalDecisionEvidence["replay"] = {
      available: false,
      inconsistent: false,
    };

    if (replay) {
      if (replay.outcome_id === outcome.id) {
        replaySection = {
          available: true,
          inconsistent: false,
          id: replay.id,
          outcome_recorded_at: replay.outcome_recorded_at,
          alignment_score: replay.alignment_score,
          overall_verdict: replay.overall_verdict,
          key_takeaway: replay.key_takeaway,
          assumption_results: (replay.assumption_results as unknown[]) || [],
          risk_results: (replay.risk_results as unknown[]) || [],
          blind_spot_results: (replay.blind_spot_results as unknown[]) || [],
          lessons_learned: (replay.lessons_learned as string[]) || [],
          created_at: replay.created_at,
          updated_at: replay.updated_at,
          provenance: "REPLAY_INFERENCE",
        };
      } else {
        // Replay exists but was created for a prior version of the outcome
        replaySection = {
          available: false,
          inconsistent: true,
        };
      }
    }

    const consequencesObj = (report?.consequences as { chains?: unknown[] }) || {};

    return {
      decision: {
        id: decision.id,
        title: decision.title,
        description: decision.description,
        industry: decision.industry ?? null,
        company_size: decision.company_size ?? null,
        budget: decision.budget ?? null,
        timeline: decision.timeline ?? null,
        success_definition: decision.success_definition ?? null,
        created_at: decision.created_at,
        updated_at: decision.updated_at,
      },
      outcome: {
        id: outcome.id,
        status: outcome.outcome_status,
        actual_outcome: outcome.actual_outcome,
        recorded_at: outcome.recorded_at,
        created_at: outcome.created_at,
        updated_at: outcome.updated_at,
        provenance: "USER_REPORTED",
      },
      original_analysis: {
        assumptions: Array.isArray(report?.assumptions) ? (report.assumptions as unknown[]) : [],
        evidence_gaps: Array.isArray(report?.evidence_gaps) ? (report.evidence_gaps as unknown[]) : [],
        blind_spots: Array.isArray(report?.blind_spots) ? (report.blind_spots as unknown[]) : [],
        stakeholders: Array.isArray(report?.stakeholders) ? (report.stakeholders as unknown[]) : [],
        consequences: Array.isArray(consequencesObj.chains) ? (consequencesObj.chains as unknown[]) : [],
        scenarios: Array.isArray(report?.scenarios) ? (report.scenarios as unknown[]) : [],
        alternatives: Array.isArray(report?.alternatives) ? (report.alternatives as unknown[]) : [],
        final_stress_test: (report?.final_stress_test as Record<string, unknown>) || {},
        provenance: "ORIGINAL_AUVORA",
      },
      replay: replaySection,
    };
  });

  return {
    status: "ready",
    eligibleDecisionCount: eligibleCount,
    minimumRequired: 3,
    decisions: evidenceList,
  };
}
