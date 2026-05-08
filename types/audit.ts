export interface AuditToolInput {
  toolId: string;
  planId: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  teamSize: number;

  primaryUseCase:
    | "Coding"
    | "Writing"
    | "Research"
    | "Data Analysis"
    | "Mixed Workloads";

  tools: AuditToolInput[];
}

export interface AuditRecommendation {
  tool: string;

  severity:
    | "low"
    | "medium"
    | "high";

  title: string;

  description: string;

  estimatedSavings: number;
}

export interface AuditResult {
  totalMonthlySpend: number;

  estimatedAnnualSpend: number;

  estimatedMonthlySavings: number;

  recommendations: AuditRecommendation[];
}