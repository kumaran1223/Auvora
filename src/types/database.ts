export type DecisionStatus = "draft" | "analyzing" | "completed" | "archived";
export type ScenarioType = "best" | "likely" | "worst";
export type OutcomeStatus =
  | "pending"
  | "successful"
  | "partially_successful"
  | "unsuccessful"
  | "cancelled";

export type SubscriptionStatus =
  | "created"
  | "authenticated"
  | "active"
  | "pending"
  | "halted"
  | "cancelled"
  | "completed"
  | "expired";

export interface OnboardingData {
  goals: string[];
  priorities: string[];
  discovery_source: string;
  upgrade_interest: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  plan: string;
  onboarding_data?: OnboardingData | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Decision {
  id: string;
  user_id: string;
  title: string;
  description: string;
  industry: string | null;
  company_size: string | null;
  budget: number | null;
  timeline: string | null;
  success_definition: string | null;
  status: DecisionStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateDecisionInput {
  title: string;
  description: string;
  industry?: string | null;
  company_size?: string | null;
  budget?: number | null;
  timeline?: string | null;
  success_definition?: string | null;
  status?: DecisionStatus;
}

export interface UpdateDecisionInput {
  title?: string;
  description?: string;
  industry?: string | null;
  company_size?: string | null;
  budget?: number | null;
  timeline?: string | null;
  success_definition?: string | null;
  status?: DecisionStatus;
}

export interface DecisionReport {
  id: string;
  decision_id: string;
  user_id: string;
  risk_score: number | null;
  summary: Record<string, unknown> | null;
  assumptions: Record<string, unknown> | null;
  evidence_gaps: Record<string, unknown> | null;
  blind_spots: Record<string, unknown> | null;
  stakeholders: Record<string, unknown> | null;
  consequences: Record<string, unknown> | null;
  scenarios: Record<string, unknown> | null;
  alternatives: Record<string, unknown> | null;
  final_stress_test: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Scenario {
  id: string;
  decision_id: string;
  user_id: string;
  scenario_type: ScenarioType;
  title: string;
  description: string | null;
  probability: number | null;
  impact: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface DecisionOutcome {
  id: string;
  decision_id: string;
  user_id: string;
  outcome_status: OutcomeStatus;
  actual_outcome: Record<string, unknown> | null;
  outcome_notes: string | null;
  recorded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecisionUsage {
  id: string;
  user_id: string;
  period_start: string;
  analysis_count: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan: "pro" | "business";
  razorpay_subscription_id: string;
  razorpay_plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  last_webhook_created_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookEventRecord {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed_at: string;
  created_at: string;
}

export interface DecisionReplay {
  id: string;
  decision_id: string;
  user_id: string;
  outcome_id: string;
  outcome_recorded_at: string;
  alignment_score: number;
  overall_verdict: string;
  key_takeaway: string;
  assumption_results: Array<{
    original_statement: string;
    result: "validated" | "failed" | "inconclusive";
    explanation: string;
  }>;
  risk_results: Array<{
    risk_title: string;
    materialized: "yes" | "no" | "partially" | "inconclusive";
    explanation: string;
  }>;
  blind_spot_results: Array<{
    blind_spot_title: string;
    result: "surfaced" | "not_observed" | "inconclusive";
    explanation: string;
  }>;
  lessons_learned: string[];
  created_at: string;
  updated_at: string;
}

export interface DecisionPattern {
  title: string;
  pattern_type:
    | "assumption"
    | "evidence"
    | "risk"
    | "blind_spot"
    | "timeline"
    | "financial"
    | "operational"
    | "strategic"
    | "stakeholder"
    | "outcome";
  description: string;
  confidence: "early_signal" | "emerging" | "strong";
  impact: "low" | "medium" | "high" | "critical";
  evidence_count: number;
  total_decisions: number;
  supporting_decisions: Array<{
    decision_id: string;
    title: string;
    evidence: string;
  }>;
  counterexamples: Array<{
    decision_id: string;
    title: string;
    evidence: string;
  }>;
  recommendation: string;
}

export interface DecisionPatternReport {
  id: string;
  user_id: string;
  decision_count: number;
  overall_summary: string;
  strongest_pattern: string | null;
  recommended_change: string | null;
  patterns: DecisionPattern[];
  created_at: string;
  updated_at: string;
}


