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
  monthlyLimit: number;
  usedCount: number;
  remainingCount: number;
  percentageUsed: number;
  resetDate: string; // ISO date string e.g. "2026-10-01"
  canAnalyze: boolean;
}

export interface ReserveAnalysisResult {
  allowed: boolean;
  current_count: number;
  limit: number;
  plan: PlanType;
  error?: string;
}

export interface ReleaseAnalysisResult {
  released: boolean;
  current_count: number;
}

