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