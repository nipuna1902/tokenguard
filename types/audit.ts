export const primaryUseCases = [
  "Coding",
  "Writing",
  "Research",
  "Data Analysis",
  "Mixed Workloads",
] as const;

export type PrimaryUseCase = (typeof primaryUseCases)[number];

export interface AuditToolInput {
  toolId: string;
  planId: string;
  seats: number;
  /** Actual recent monthly invoice subtotal. Empty means list price × seats. */
  monthlySpend?: number;
}

export interface AuditFormData {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: AuditToolInput[];
}

export type RecommendationConfidence = "verified" | "review";

export interface AuditRecommendation {
  tool: string;
  severity: "low" | "medium" | "high";
  confidence: RecommendationConfidence;
  title: string;
  description: string;
  action: string;
  estimatedSavings: number;
}

export interface AuditResult {
  totalMonthlySpend: number;
  estimatedAnnualSpend: number;
  estimatedMonthlySavings: number;
  reviewableMonthlySavings: number;
  recommendations: AuditRecommendation[];
}
