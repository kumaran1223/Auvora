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

