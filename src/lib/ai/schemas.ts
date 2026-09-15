import { z } from "zod";

export const AssumptionSchema = z.object({
  id: z.string(),
  statement: z.string(),
  confidence: z.number().min(0).max(100),
  impact: z.enum(["low", "medium", "high", "critical"]),
  classification: z.enum(["known", "assumed", "unknown", "needs_verification"]),
  why_it_matters: z.string(),
  verification_action: z.string(),
});

export const EvidenceGapSchema = z.object({
  id: z.string(),
  question: z.string(),
  why_it_matters: z.string(),
  decision_impact: z.enum(["low", "medium", "high", "critical"]),
  recommended_verification: z.string(),
});

export const BlindSpotSchema = z.object({
  id: z.string(),
  title: z.string(),
  explanation: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  why_it_may_be_overlooked: z.string(),
  what_to_check: z.string(),
});

export const StakeholderSchema = z.object({
  name: z.string(),
  role: z.string(),
  likely_reaction: z.string(),
  concern: z.string(),
  influence: z.enum(["low", "medium", "high"]),
  mitigation: z.string(),
});

export const RiskSchema = z.object({
  title: z.string(),
  description: z.string(),
  likelihood: z.enum(["low", "medium", "high"]),
  impact: z.enum(["low", "medium", "high", "critical"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  mitigation: z.string(),
});

export const ConsequenceChainSchema = z.object({
  trigger: z.string(),
  immediate_effect: z.string(),
  second_order_effect: z.string(),
  potential_third_order_effect: z.string(),
  strategic_implication: z.string(),
});

export const ScenarioSchema = z.object({
  type: z.enum(["best", "likely", "worst"]),
  title: z.string(),
  description: z.string(),
  probability: z.number().min(0).max(100),
  impact: z.string(),
  triggers: z.array(z.string()),
  early_signals: z.array(z.string()),
  response: z.string(),
});

export const AlternativeSchema = z.object({
  title: z.string(),
  description: z.string(),
  advantages: z.array(z.string()),
  disadvantages: z.array(z.string()),
  risk_level: z.enum(["low", "medium", "high", "critical"]),
  when_to_choose: z.string(),
});

export const FinalStressTestSchema = z.object({
  overall_risk: z.enum(["low", "medium", "high", "critical"]),
  decision_strength: z.enum(["weak", "moderate", "strong"]),
  confidence: z.number().min(0).max(100),
  recommendation: z.enum([
    "proceed",
    "proceed_with_conditions",
    "delay_and_verify",
    "reconsider",
  ]),
  reasoning: z.string(),
  top_3_actions_before_commitment: z.array(z.string()),
  biggest_assumption: z.string(),
  biggest_evidence_gap: z.string(),
  biggest_blind_spot: z.string(),
  decision_trigger: z.string(),
});

export const AuvoraReportSchema = z.object({
  summary: z.object({
    overview: z.string(),
    key_points: z.array(z.string()),
  }),
  risk_score: z.number().min(0).max(100),
  assumptions: z.array(AssumptionSchema),
  evidence_gaps: z.array(EvidenceGapSchema),
  blind_spots: z.array(BlindSpotSchema),
  stakeholders: z.array(StakeholderSchema),
  risks: z.array(RiskSchema),
  consequences: z.array(ConsequenceChainSchema),
  scenarios: z.array(ScenarioSchema),
  alternatives: z.array(AlternativeSchema),
  kill_questions: z.array(z.string()),
  final_stress_test: FinalStressTestSchema,
});

export type AuvoraReportData = z.infer<typeof AuvoraReportSchema>;

// Phase 10B: Decision Replay Schemas

export const AssumptionResultSchema = z.object({
  original_statement: z.string(),
  result: z.enum(["validated", "failed", "inconclusive"]),
  explanation: z.string(),
});

export const RiskResultSchema = z.object({
  risk_title: z.string(),
  materialized: z.enum(["yes", "no", "partially", "inconclusive"]),
  explanation: z.string(),
});

export const BlindSpotResultSchema = z.object({
  blind_spot_title: z.string(),
  result: z.enum(["surfaced", "not_observed", "inconclusive"]),
  explanation: z.string(),
});

export const AuvoraReplaySchema = z.object({
  alignment_score: z.number().min(0).max(100),
  overall_verdict: z.string(),
  key_takeaway: z.string(),
  assumption_results: z.array(AssumptionResultSchema),
  risk_results: z.array(RiskResultSchema),
  blind_spot_results: z.array(BlindSpotResultSchema),
  lessons_learned: z.array(z.string()),
});

export type AuvoraReplayData = z.infer<typeof AuvoraReplaySchema>;

// Phase 10C.2: Decision Pattern Engine Schemas

export const PatternTypeEnum = z.enum([
  "assumption",
  "evidence",
  "risk",
  "blind_spot",
  "timeline",
  "financial",
  "operational",
  "strategic",
  "stakeholder",
  "outcome",
]);

export const PatternConfidenceEnum = z.enum([
  "early_signal",
  "emerging",
  "strong",
]);

export const PatternImpactEnum = z.enum([
  "low",
  "medium",
  "high",
  "critical",
]);

export const SupportingDecisionSchema = z.object({
  decision_id: z.string(),
  title: z.string(),
  evidence: z.string(),
});

export const CounterexampleSchema = z.object({
  decision_id: z.string(),
  title: z.string(),
  evidence: z.string(),
});

export const DecisionPatternSchema = z.object({
  title: z.string(),
  pattern_type: PatternTypeEnum,
  description: z.string(),
  confidence: PatternConfidenceEnum,
  impact: PatternImpactEnum,
  evidence_count: z.number().int().min(1),
  total_decisions: z.number().int().min(3),
  supporting_decisions: z.array(SupportingDecisionSchema),
  counterexamples: z.array(CounterexampleSchema),
  recommendation: z.string(),
});

export const AuvoraPatternReportSchema = z.object({
  overall_summary: z.string(),
  strongest_pattern: z.string().nullable(),
  recommended_change: z.string().nullable(),
  patterns: z.array(DecisionPatternSchema).max(5),
});

export type AuvoraPatternReportData = z.infer<typeof AuvoraPatternReportSchema>;
export type DecisionPatternData = z.infer<typeof DecisionPatternSchema>;



