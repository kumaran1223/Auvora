"use server";

import { revalidatePath } from "next/cache";
import {
  createDecision,
  updateDecision,
  deleteDecision,
  getDecisionById,
} from "@/lib/db/decisions";
import type { DecisionStatus } from "@/types/database";

export async function createDecisionAction(formData: FormData) {
  try {
    const title = (formData.get("title") as string | null)?.trim();
    let description = (formData.get("description") as string | null)?.trim();
    const whyNow = (formData.get("why_now") as string | null)?.trim();
    const industry = (formData.get("industry") as string | null)?.trim() || null;
    const companySize = (formData.get("company_size") as string | null)?.trim() || null;
    const budgetRaw = (formData.get("budget") as string | null)?.trim();
    const timeline = (formData.get("timeline") as string | null)?.trim() || null;
    const successDefinition =
      (formData.get("success_definition") as string | null)?.trim() || null;

    if (!title || !description) {
      return { error: "Title and description are required fields." };
    }

    if (whyNow) {
      description = `${description}\n\nWhy now:\n${whyNow}`;
    }

    const budget = budgetRaw && !isNaN(Number(budgetRaw)) ? Number(budgetRaw) : null;

    const decision = await createDecision({
      title,
      description,
      industry,
      company_size: companySize,
      budget,
      timeline,
      success_definition: successDefinition,
      status: "draft",
    });

    return { success: true, decisionId: decision.id };
  } catch {
    return { error: "Unable to create decision. Please try again." };
  }
}

export async function updateDecisionAction(decisionId: string, formData: FormData) {
  try {
    const existing = await getDecisionById(decisionId);
    if (!existing) {
      return { error: "Decision not found or unauthorized." };
    }

    const title = (formData.get("title") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim();
    const industry = (formData.get("industry") as string | null)?.trim() || null;
    const companySize = (formData.get("company_size") as string | null)?.trim() || null;
    const budgetRaw = (formData.get("budget") as string | null)?.trim();
    const timeline = (formData.get("timeline") as string | null)?.trim() || null;
    const successDefinition =
      (formData.get("success_definition") as string | null)?.trim() || null;

    if (!title || !description) {
      return { error: "Title and description are required fields." };
    }

    const budget = budgetRaw && !isNaN(Number(budgetRaw)) ? Number(budgetRaw) : null;

    await updateDecision(decisionId, {
      title,
      description,
      industry,
      company_size: companySize,
      budget,
      timeline,
      success_definition: successDefinition,
    });

    revalidatePath(`/decisions/${decisionId}`);
    return { success: true };
  } catch {
    return { error: "Unable to update decision. Please try again." };
  }
}

export async function archiveDecisionAction(decisionId: string) {
  try {
    const existing = await getDecisionById(decisionId);
    if (!existing) {
      return { error: "Decision not found or unauthorized." };
    }

    const newStatus: DecisionStatus = existing.status === "archived" ? "draft" : "archived";

    await updateDecision(decisionId, {
      status: newStatus,
    });

    revalidatePath(`/decisions/${decisionId}`);
    return { success: true, status: newStatus };
  } catch {
    return { error: "Unable to archive decision. Please try again." };
  }
}

export async function deleteDecisionAction(decisionId: string) {
  try {
    const existing = await getDecisionById(decisionId);
    if (!existing) {
      return { error: "Decision not found or unauthorized." };
    }

    await deleteDecision(decisionId);

    return { success: true };
  } catch {
    return { error: "Unable to delete decision. Please try again." };
  }
}

