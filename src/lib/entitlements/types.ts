export type PlanType = "free" | "pro" | "business";

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: string;
  monthlyLimit: number;
  description: string;
  features: string[];
}

export interface UserUsageSummary {
  userId: string;
  plan: PlanType;
  planName: string;
  monthlyLimit: number | null;
  usedCount: number;
  remainingCount: number | null;
  percentageUsed: number;
  resetDate: string; // ISO date string e.g. "2026-10-01"
  canAnalyze: boolean;
  isUnlimited: boolean;
}

export interface ReserveAnalysisResult {
  allowed: boolean;
  current_count: number;
  limit: number | null;
  plan: PlanType;
  error?: string;
  isUnlimited: boolean;
}

export interface ReleaseAnalysisResult {
  released: boolean;
  current_count: number;
}

