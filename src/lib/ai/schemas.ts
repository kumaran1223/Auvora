import { z } from "zod";

export const AssumptionSchema = z.object({
  id: z.string(),
  statement: z.string().max(800),
  confidence: z.number().min(0).max(100),
  impact: z.enum(["low", "medium", "high", "critical"]),
  classification: z.enum(["known", "assumed", "unknown", "needs_verification"]),
  why_it_matters: z.string().max(800),
  verification_action: z.string().max(800),
});

export const EvidenceGapSchema = z.object({
  id: z.string(),
  question: z.string().max(800),
  why_it_matters: z.string().max(800),
  decision_impact: z.enum(["low", "medium", "high", "critical"]),
  recommended_verification: z.string().max(800),
});

export const BlindSpotSchema = z.object({
  id: z.string(),
  title: z.string().max(800),
  explanation: z.string().max(800),
  severity: z.enum(["low", "medium", "high", "critical"]),
  why_it_may_be_overlooked: z.string().max(800),
  what_to_check: z.string().max(800),
});

export const StakeholderSchema = z.object({
  name: z.string().max(800),
  role: z.string().max(800),
  likely_reaction: z.string().max(800),
  concern: z.string().max(800),
  influence: z.enum(["low", "medium", "high"]),
  mitigation: z.string().max(800),
});

export const RiskSchema = z.object({
  title: z.string().max(800),
  description: z.string().max(800),
  likelihood: z.enum(["low", "medium", "high"]),
  impact: z.enum(["low", "medium", "high", "critical"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  mitigation: z.string().max(800),
});

export const ConsequenceChainSchema = z.object({
  trigger: z.string().max(800),
  immediate_effect: z.string().max(800),
  second_order_effect: z.string().max(800),
  potential_third_order_effect: z.string().max(800),
  strategic_implication: z.string().max(800),
});

export const ScenarioSchema = z.object({
  type: z.enum(["best", "likely", "worst"]),
  title: z.string().max(800),
  description: z.string().max(800),
  probability: z.number().min(0).max(100),
  impact: z.string().max(800),
  triggers: z.array(z.string().max(800)),
  early_signals: z.array(z.string().max(800)),
  response: z.string().max(800),
});

export const AlternativeSchema = z.object({
  title: z.string().max(800),
  description: z.string().max(800),
  advantages: z.array(z.string().max(800)),
  disadvantages: z.array(z.string().max(800)),
  risk_level: z.enum(["low", "medium", "high", "critical"]),
  when_to_choose: z.string().max(800),
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
  reasoning: z.string().max(800),
  top_3_actions_before_commitment: z.array(z.string().max(800)),
  biggest_assumption: z.string().max(800),
  biggest_evidence_gap: z.string().max(800),
  biggest_blind_spot: z.string().max(800),
  decision_trigger: z.string().max(800),
});

export const AuvoraReportSchema = z.object({
  summary: z.object({
    overview: z.string().max(800),
    key_points: z.array(z.string().max(800)).max(4),
  }),
  risk_score: z.number().min(0).max(100),
  assumptions: z.array(AssumptionSchema).max(4),
  evidence_gaps: z.array(EvidenceGapSchema).max(4),
  blind_spots: z.array(BlindSpotSchema).max(4),
  stakeholders: z.array(StakeholderSchema).max(3),
  risks: z.array(RiskSchema).max(4),
  consequences: z.array(ConsequenceChainSchema).max(3),
  scenarios: z.array(ScenarioSchema).length(3),
  alternatives: z.array(AlternativeSchema).max(3),
  kill_questions: z.array(z.string().max(800)).max(3),
  final_stress_test: FinalStressTestSchema,
});

export type AuvoraReportData = z.infer<typeof AuvoraReportSchema>;

// Phase 10B: Decision Replay Schemas

export const AssumptionResultSchema = z.object({
  original_statement: z.string().max(800),
  result: z.enum(["validated", "failed", "inconclusive"]),
  explanation: z.string().max(800),
});

export const RiskResultSchema = z.object({
  risk_title: z.string().max(800),
  materialized: z.enum(["yes", "no", "partially", "inconclusive"]),
  explanation: z.string().max(800),
});

export const BlindSpotResultSchema = z.object({
  blind_spot_title: z.string().max(800),
  result: z.enum(["surfaced", "not_observed", "inconclusive"]),
  explanation: z.string().max(800),
});

export const AuvoraReplaySchema = z.object({
  alignment_score: z.number().min(0).max(100),
  overall_verdict: z.string().max(800),
  key_takeaway: z.string().max(800),
  assumption_results: z.array(AssumptionResultSchema),
  risk_results: z.array(RiskResultSchema),
  blind_spot_results: z.array(BlindSpotResultSchema),
  lessons_learned: z.array(z.string().max(800)),
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
  title: z.string().max(800),
  evidence: z.string().max(800),
});

export const CounterexampleSchema = z.object({
  decision_id: z.string(),
  title: z.string().max(800),
  evidence: z.string().max(800),
});

export const DecisionPatternSchema = z.object({
  title: z.string().max(800),
  pattern_type: PatternTypeEnum,
  description: z.string().max(800),
  confidence: PatternConfidenceEnum,
  impact: PatternImpactEnum,
  evidence_count: z.number().int().min(1),
  total_decisions: z.number().int().min(3),
  supporting_decisions: z.array(SupportingDecisionSchema),
  counterexamples: z.array(CounterexampleSchema),
  recommendation: z.string().max(800),
});

export const AuvoraPatternReportSchema = z.object({
  overall_summary: z.string().max(800),
  strongest_pattern: z.string().max(800).nullable(),
  recommended_change: z.string().max(800).nullable(),
  patterns: z.array(DecisionPatternSchema).max(5),
});

export type AuvoraPatternReportData = z.infer<typeof AuvoraPatternReportSchema>;
export type DecisionPatternData = z.infer<typeof DecisionPatternSchema>;



