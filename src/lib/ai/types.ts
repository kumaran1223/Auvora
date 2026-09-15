import type { Decision } from "@/types/database";

export interface NormalizedDecisionContext {
  decision: {
    id: string;
    title: string;
    description: string;
    industry: string | null;
    company_size: string | null;
    budget: number | null;
    timeline: string | null;
    success_definition: string | null;
  };
}

export function normalizeDecisionContext(decision: Decision): NormalizedDecisionContext {
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
    },
  };
}

export interface NormalizedReplayContext {
  decision: {
    title: string;
    description: string;
    timeline: string | null;
    success_definition: string | null;
  };
  original_analysis: {
    assumptions: unknown[];
    evidence_gaps: unknown[];
    blind_spots: unknown[];
    risks: unknown[];
    scenarios: unknown[];
    final_stress_test: Record<string, unknown>;
  };
  recorded_outcome: {
    outcome_status: string;
    what_happened: string;
    what_surprised_you: string;
    recorded_at: string;
  };
}

export function normalizeReplayContext(
  decision: Decision,
  report: {
    assumptions?: unknown;
    evidence_gaps?: unknown;
    blind_spots?: unknown;
    consequences?: unknown;
    scenarios?: unknown;
    final_stress_test?: unknown;
  },
  outcome: {
    outcome_status: string;
    actual_outcome?: unknown;
    outcome_notes?: string | null;
    recorded_at?: string | null;
    created_at: string;
  }
): NormalizedReplayContext {
  const actualObj = (outcome.actual_outcome as {
    what_happened?: string;
    what_surprised_you?: string;
  }) || {};

  const consequencesObj = (report.consequences as { risks?: unknown[] }) || {};

  return {
    decision: {
      title: decision.title,
      description: decision.description,
      timeline: decision.timeline ?? null,
      success_definition: decision.success_definition ?? null,
    },
    original_analysis: {
      assumptions: Array.isArray(report.assumptions) ? report.assumptions : [],
      evidence_gaps: Array.isArray(report.evidence_gaps) ? report.evidence_gaps : [],
      blind_spots: Array.isArray(report.blind_spots) ? report.blind_spots : [],
      risks: Array.isArray(consequencesObj.risks) ? consequencesObj.risks : [],
      scenarios: Array.isArray(report.scenarios) ? report.scenarios : [],
      final_stress_test: (report.final_stress_test as Record<string, unknown>) || {},
    },
    recorded_outcome: {
      outcome_status: outcome.outcome_status,
      what_happened: actualObj.what_happened || outcome.outcome_notes || "No detailed notes provided.",
      what_surprised_you: actualObj.what_surprised_you || "None reported.",
      recorded_at: outcome.recorded_at || outcome.created_at,
    },
  };
}
