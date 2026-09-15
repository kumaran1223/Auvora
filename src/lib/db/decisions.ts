import { createClient } from "@/lib/supabase/server";
import type {
  Decision,
  CreateDecisionInput,
  UpdateDecisionInput,
  DecisionReport,
  Scenario,
  DecisionOutcome,
} from "@/types/database";

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
    throw new Error("Failed to fetch decision.");
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
  const { data, error } = await supabase
    .from("decision_reports")
    .select("*")
    .eq("decision_id", decisionId)
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

