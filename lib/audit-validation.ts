import { z } from "zod";

import { pricingData, ToolId } from "@/lib/pricing-data";
import { primaryUseCases } from "@/types/audit";

const optionalMoneySchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return Number(value);
}, z.number().finite().min(0).max(10_000_000).optional());

const positiveIntSchema = z.preprocess(
  (value) => Number(value),
  z.number().int().min(1).max(100_000)
);

export const primaryUseCaseSchema = z.enum(primaryUseCases);

export const auditToolDraftSchema = z.object({
  toolId: z.string().default(""),
  planId: z.string().default(""),
  seats: positiveIntSchema.catch(1),
  monthlySpend: optionalMoneySchema,
});

export const auditToolInputSchema = auditToolDraftSchema.superRefine((tool, ctx) => {
  const selectedTool = pricingData[tool.toolId as ToolId];
  const selectedPlan = selectedTool?.plans.find((plan) => plan.id === tool.planId);

  if (!selectedTool) {
    ctx.addIssue({
      code: "custom",
      path: ["toolId"],
      message: "Select a supported AI tool.",
    });
  }

  if (!selectedPlan) {
    ctx.addIssue({
      code: "custom",
      path: ["planId"],
      message: "Select a valid plan for this tool.",
    });
  }

  if (selectedPlan?.requiresQuote && !tool.monthlySpend) {
    ctx.addIssue({
      code: "custom",
      path: ["monthlySpend"],
      message: "Invoice-based plans need a recent monthly subtotal.",
    });
  }
});

export const auditFormDataSchema = z.object({
  teamSize: positiveIntSchema,
  primaryUseCase: primaryUseCaseSchema,
  tools: z.array(auditToolInputSchema).min(1).max(50),
});

export const auditRecommendationSchema = z.object({
  tool: z.string().min(1).max(100),
  severity: z.enum(["low", "medium", "high"]),
  confidence: z.enum(["verified", "review"]),
  title: z.string().min(1).max(180),
  description: z.string().min(1).max(1_000),
  action: z.string().min(1).max(1_000),
  estimatedSavings: z.number().finite().min(0).max(10_000_000),
});

export const auditResultSchema = z.object({
  totalMonthlySpend: z.number().finite().min(0).max(10_000_000),
  estimatedAnnualSpend: z.number().finite().min(0).max(120_000_000),
  estimatedMonthlySavings: z.number().finite().min(0).max(10_000_000),
  reviewableMonthlySavings: z.number().finite().min(0).max(10_000_000),
  recommendations: z.array(auditRecommendationSchema).min(1).max(100),
});

export const auditSessionSchema = z.object({
  currentStep: z.number().int().min(1).max(3).catch(1),
  teamSize: z.number().int().min(0).max(100_000).catch(0),
  primaryUseCase: z.union([primaryUseCaseSchema, z.literal("")]).catch(""),
  tools: z.array(auditToolDraftSchema).min(1).max(50).catch([
    {
      toolId: "",
      planId: "",
      seats: 1,
    },
  ]),
  auditResult: auditResultSchema.nullable().catch(null),
  aiSummary: z.string().max(2_000).catch(""),
});
