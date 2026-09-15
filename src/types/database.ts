export type DecisionStatus = "draft" | "analyzing" | "completed" | "archived";
export type ScenarioType = "best" | "likely" | "worst";
export type OutcomeStatus =
  | "pending"
  | "successful"
  | "partially_successful"
  | "unsuccessful"
  | "cancelled";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  plan: string;
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
