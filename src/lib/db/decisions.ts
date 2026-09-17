import { createClient } from "@/lib/supabase/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  Decision,
  CreateDecisionInput,
  UpdateDecisionInput,
  DecisionReport,
  Scenario,
  DecisionOutcome,
  DecisionReplay,
} from "@/types/database";
import type { AuvoraReplayData } from "@/lib/ai/schemas";

export interface DecisionWithMeta extends Decision {
  risk_score?: number | null;
  outcome?: DecisionOutcome | null;
}

/**
 * Retrieve all decisions belonging to the authenticated user.
 */
export async function getUserDecisions(): Promise<Decision[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch decisions.");
  }

  return (data as Decision[]) || [];
}

/**
 * Retrieve decisions with metadata (reports and outcomes) for dashboard.
 */
export async function getUserDecisionsWithMeta(): Promise<DecisionWithMeta[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const [decisionsRes, reportsRes, outcomesRes] = await Promise.all([
    supabase
      .from("decisions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("decision_reports").select("decision_id, risk_score").eq("user_id", user.id),
    supabase.from("decision_outcomes").select("id, decision_id, user_id, outcome_status, actual_outcome, outcome_notes, recorded_at, created_at, updated_at").eq("user_id", user.id),
  ]);

  if (decisionsRes.error) {
    throw new Error("Failed to fetch decisions metadata.");
  }

  const decisions = (decisionsRes.data as Decision[]) || [];
  const reports = (reportsRes.data as { decision_id: string; risk_score: number | null }[]) || [];
  const outcomes = (outcomesRes.data as DecisionOutcome[]) || [];

  const reportMap = new Map<string, number | null>();
  reports.forEach((r) => reportMap.set(r.decision_id, r.risk_score));

  const outcomeMap = new Map<string, DecisionOutcome>();
  outcomes.forEach((o) => outcomeMap.set(o.decision_id, o));

  return decisions.map((d) => ({
    ...d,
    risk_score: reportMap.get(d.id) ?? null,
    outcome: outcomeMap.get(d.id) ?? null,
  }));
}

/**
 * Retrieve a specific decision by ID for the authenticated user.
 */
export async function getDecisionById(decisionId: string): Promise<Decision | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("id", decisionId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data as Decision) || null;
}

/**
 * Create a new decision record for the authenticated user.
 */
export async function createDecision(input: CreateDecisionInput): Promise<Decision> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { data, error } = await supabase
    .from("decisions")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      industry: input.industry ?? null,
      company_size: input.company_size ?? null,
      budget: input.budget ?? null,
      timeline: input.timeline ?? null,
      success_definition: input.success_definition ?? null,
      status: input.status ?? "draft",
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Failed to create decision.");
  }

  return data as Decision;
}

/**
 * Update an existing decision record belonging to the authenticated user.
 */
export async function updateDecision(
  decisionId: string,
  input: UpdateDecisionInput
): Promise<Decision> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("decisions")
    .update(input)
    .eq("id", decisionId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Failed to update decision.");
  }

  return data as Decision;
}

/**
 * Delete a decision record belonging to the authenticated user.
 */
export async function deleteDecision(decisionId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("decisions").delete().eq("id", decisionId);

  if (error) {
    throw new Error("Failed to delete decision.");
  }

  return true;
}

/**
 * Retrieve the decision report associated with a specific decision.
 */
export async function getDecisionReport(
  decisionId: string
): Promise<DecisionReport | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const adminClient = getAdminSupabaseClient();
  if (!adminClient) throw new Error("Missing admin client");

  const { data, error } = await adminClient
    .from("decision_reports")
    .select("*")
    .eq("decision_id", decisionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch decision report.");
  }

  return (data as DecisionReport) || null;
}

/**
 * Retrieve scenarios associated with a specific decision.
 */
export async function getDecisionScenarios(
  decisionId: string
): Promise<Scenario[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scenarios")
    .select("*")
    .eq("decision_id", decisionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch scenarios.");
  }

  return (data as Scenario[]) || [];
}

/**
 * Retrieve the decision outcome associated with a specific decision.
 */
export async function getDecisionOutcome(
  decisionId: string
): Promise<DecisionOutcome | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decision_outcomes")
    .select("*")
    .eq("decision_id", decisionId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch decision outcome.");
  }

  return (data as DecisionOutcome) || null;
}

/**
 * Save or update (upsert) the decision outcome for a decision.
 */
export async function saveDecisionOutcome(
  decisionId: string,
  input: {
    outcome_status: "successful" | "partially_successful" | "unsuccessful" | "cancelled";
    what_happened: string;
    what_surprised_you?: string;
  }
): Promise<DecisionOutcome> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  // Verify ownership of the target decision
  const decision = await getDecisionById(decisionId);
  if (!decision || decision.user_id !== user.id) {
    throw new Error("Decision not found or unauthorized.");
  }

  const payload = {
    decision_id: decisionId,
    user_id: user.id,
    outcome_status: input.outcome_status,
    actual_outcome: {
      what_happened: input.what_happened,
      what_surprised_you: input.what_surprised_you || "",
    },
    outcome_notes: input.what_happened,
    recorded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: existingOutcome } = await supabase
    .from("decision_outcomes")
    .select("id")
    .eq("decision_id", decisionId)
    .maybeSingle();

  let savedData: DecisionOutcome | null = null;
  let saveError = null;

  if (existingOutcome) {
    const { data, error } = await supabase
      .from("decision_outcomes")
      .update(payload)
      .eq("id", existingOutcome.id)
      .select("*")
      .single();
    savedData = data as DecisionOutcome;
    saveError = error;
  } else {
    const { data, error } = await supabase
      .from("decision_outcomes")
      .insert(payload)
      .select("*")
      .single();
    savedData = data as DecisionOutcome;
    saveError = error;

    // Fallback: handle potential Postgres 23505 unique constraint race condition
    if (saveError && (saveError as { code?: string }).code === "23505") {
      const { data: retryData, error: retryError } = await supabase
        .from("decision_outcomes")
        .update(payload)
        .eq("decision_id", decisionId)
        .select("*")
        .single();
      savedData = retryData as DecisionOutcome;
      saveError = retryError;
    }
  }

  if (saveError || !savedData) {
    console.error("Save outcome DB error:", saveError);
    throw new Error("Failed to save decision outcome.");
  }

  return savedData;
}

/**
 * Retrieve the decision replay associated with a specific decision.
 */
export async function getDecisionReplay(
  decisionId: string
): Promise<DecisionReplay | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decision_replays")
    .select("*")
    .eq("decision_id", decisionId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch decision replay.");
  }

  return (data as DecisionReplay) || null;
}

/**
 * Save or update (upsert) the decision replay for a decision.
 */
export async function saveDecisionReplay(
  decisionId: string,
  outcomeId: string,
  outcomeRecordedAt: string,
  replayData: AuvoraReplayData
): Promise<DecisionReplay> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  // Verify ownership of the target decision
  const decision = await getDecisionById(decisionId);
  if (!decision || decision.user_id !== user.id) {
    throw new Error("Decision not found or unauthorized.");
  }

  const payload = {
    decision_id: decisionId,
    user_id: user.id,
    outcome_id: outcomeId,
    outcome_recorded_at: outcomeRecordedAt,
    alignment_score: replayData.alignment_score,
    overall_verdict: replayData.overall_verdict,
    key_takeaway: replayData.key_takeaway,
    assumption_results: replayData.assumption_results,
    risk_results: replayData.risk_results,
    blind_spot_results: replayData.blind_spot_results,
    lessons_learned: replayData.lessons_learned,
    updated_at: new Date().toISOString(),
  };

  const { data: existingReplay } = await supabase
    .from("decision_replays")
    .select("id")
    .eq("decision_id", decisionId)
    .maybeSingle();

  let savedData: DecisionReplay | null = null;
  let saveError = null;

  if (existingReplay) {
    const { data, error } = await supabase
      .from("decision_replays")
      .update(payload)
      .eq("id", existingReplay.id)
      .select("*")
      .single();
    savedData = data as DecisionReplay;
    saveError = error;
  } else {
    const { data, error } = await supabase
      .from("decision_replays")
      .insert(payload)
      .select("*")
      .single();
    savedData = data as DecisionReplay;
    saveError = error;

    // Fallback: handle potential Postgres 23505 unique constraint race condition
    if (saveError && (saveError as { code?: string }).code === "23505") {
      const { data: retryData, error: retryError } = await supabase
        .from("decision_replays")
        .update(payload)
        .eq("decision_id", decisionId)
        .select("*")
        .single();
      savedData = retryData as DecisionReplay;
      saveError = retryError;
    }
  }

  if (saveError || !savedData) {
    console.error("Save replay DB error:", saveError);
    throw new Error("Failed to save decision replay.");
  }

  return savedData;
}


import type { AuvoraReportData } from "@/lib/ai/schemas";

/**
 * Safely parses Supabase JSONB fields into typed AuvoraReportData.
 */
export function parseDecisionReportData(rawReport: DecisionReport): AuvoraReportData | null {
  if (!rawReport) return null;
  try {
    const summaryObj = (rawReport.summary as { overview?: string; key_points?: string[] }) || {};
    const consequencesObj = (rawReport.consequences as { chains?: unknown[]; risks?: unknown[] }) || {};
    const finalTestObj = (rawReport.final_stress_test as Record<string, unknown>) || {};

    return {
      summary: {
        overview: summaryObj.overview || "No summary overview provided.",
        key_points: Array.isArray(summaryObj.key_points) ? summaryObj.key_points : [],
      },
      risk_score: Number(rawReport.risk_score) || 50,
      assumptions: Array.isArray(rawReport.assumptions) ? (rawReport.assumptions as AuvoraReportData["assumptions"]) : [],
      evidence_gaps: Array.isArray(rawReport.evidence_gaps) ? (rawReport.evidence_gaps as AuvoraReportData["evidence_gaps"]) : [],
      blind_spots: Array.isArray(rawReport.blind_spots) ? (rawReport.blind_spots as AuvoraReportData["blind_spots"]) : [],
      stakeholders: Array.isArray(rawReport.stakeholders) ? (rawReport.stakeholders as AuvoraReportData["stakeholders"]) : [],
      risks: Array.isArray(consequencesObj.risks) ? (consequencesObj.risks as AuvoraReportData["risks"]) : [],
      consequences: Array.isArray(consequencesObj.chains) ? (consequencesObj.chains as AuvoraReportData["consequences"]) : [],
      scenarios: Array.isArray(rawReport.scenarios) ? (rawReport.scenarios as AuvoraReportData["scenarios"]) : [],
      alternatives: Array.isArray(rawReport.alternatives) ? (rawReport.alternatives as AuvoraReportData["alternatives"]) : [],
      kill_questions: Array.isArray(finalTestObj["kill_questions"]) ? (finalTestObj["kill_questions"] as string[]) : [],
      final_stress_test: {
        overall_risk: (finalTestObj["overall_risk"] as AuvoraReportData["final_stress_test"]["overall_risk"]) || "medium",
        decision_strength: (finalTestObj["decision_strength"] as AuvoraReportData["final_stress_test"]["decision_strength"]) || "moderate",
        confidence: Number(finalTestObj["confidence"]) || 70,
        recommendation: (finalTestObj["recommendation"] as AuvoraReportData["final_stress_test"]["recommendation"]) || "proceed_with_conditions",
        reasoning: (finalTestObj["reasoning"] as string) || "Proceed cautiously.",
        top_3_actions_before_commitment: Array.isArray(finalTestObj["top_3_actions_before_commitment"])
          ? (finalTestObj["top_3_actions_before_commitment"] as string[])
          : [],
        biggest_assumption: (finalTestObj["biggest_assumption"] as string) || "N/A",
        biggest_evidence_gap: (finalTestObj["biggest_evidence_gap"] as string) || "N/A",
        biggest_blind_spot: (finalTestObj["biggest_blind_spot"] as string) || "N/A",
        decision_trigger: (finalTestObj["decision_trigger"] as string) || "N/A",
      },
    };
  } catch {
    return null;
  }
}

