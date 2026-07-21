import { AuditFormData, AuditRecommendation, AuditResult } from "@/types/audit";
import { getPlan, pricingData, ToolId } from "./pricing-data";
import { auditFormDataSchema } from "./audit-validation";

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function monthlyCost(tool: AuditFormData["tools"][number]) {
  const plan = getPlan(tool.toolId, tool.planId);
  const listCost = plan && !plan.requiresQuote ? plan.monthlyPrice * tool.seats : 0;
  return Math.max(0, tool.monthlySpend && tool.monthlySpend > 0 ? tool.monthlySpend : listCost);
}

function estimatePlanChangeSavings(
  spend: number,
  currentMonthlyPrice: number,
  targetMonthlyPrice: number,
  seats: number
) {
  return Math.min(spend, roundMoney((currentMonthlyPrice - targetMonthlyPrice) * seats));
}

function cheapestPlanForTier(toolId: string, tiers: string[]) {
  return pricingData[toolId as ToolId]?.plans
    .filter((plan) => !plan.requiresQuote && tiers.includes(plan.tier))
    .sort((a, b) => a.monthlyPrice - b.monthlyPrice)[0];
}

export function generateAudit(data: AuditFormData): AuditResult {
  const parsed = auditFormDataSchema.safeParse(data);

  if (!parsed.success) {
    return {
      totalMonthlySpend: 0,
      estimatedAnnualSpend: 0,
      estimatedMonthlySavings: 0,
      reviewableMonthlySavings: 0,
      recommendations: [
        {
          tool: "Audit input",
          severity: "high",
          confidence: "review",
          title: "The audit needs valid tool, plan, seat, and invoice data",
          description: "TokenGuard could not calculate a dependable forecast from the supplied inputs.",
          action: "Review the form values and use invoice subtotals for quote-based or metered vendors.",
          estimatedSavings: 0,
        },
      ],
    };
  }

  data = parsed.data;
  const recommendations: AuditRecommendation[] = [];
  let totalMonthlySpend = 0;
  let verifiedSavings = 0;
  let reviewableSavings = 0;

  for (const tool of data.tools) {
    const toolData = pricingData[tool.toolId as ToolId];
    const currentPlan = getPlan(tool.toolId, tool.planId);
    const spend = monthlyCost(tool);
    totalMonthlySpend += spend;
    if (!toolData || !currentPlan || spend <= 0) continue;

    if (currentPlan.requiresQuote) {
      recommendations.push({
        tool: toolData.name, severity: "medium", confidence: "review",
        title: "Metered or contracted spend needs usage guardrails",
        description: "This amount comes from your invoice because no reliable public unit price applies. It is not treated as a seat subscription and no speculative reduction is counted.",
        action: "Set monthly budgets and alerts, tag spend by product/team, use model routing and prompt/context limits, and evaluate caching or batch processing where your workload permits.",
        estimatedSavings: 0,
      });
      continue;
    }

    const listBaseCost = roundMoney(currentPlan.monthlyPrice * tool.seats);

    // A seat count above the stated user population is the only saving we can
    // calculate without guessing about feature usage. It is capped by invoice spend.
    if (tool.seats > data.teamSize && currentPlan.monthlyPrice > 0) {
      const unusedSeats = tool.seats - data.teamSize;
      const saving = Math.min(spend, roundMoney(unusedSeats * currentPlan.monthlyPrice));
      if (saving > 0) {
        recommendations.push({
          tool: toolData.name, severity: "high", confidence: "verified",
          title: `${unusedSeats} seat${unusedSeats === 1 ? "" : "s"} exceed your stated team size`,
          description: `Your selected ${currentPlan.name} plan lists ${tool.seats} seats for a ${data.teamSize}-person team. This is a count check, not a claim that every extra seat is inactive.`,
          action: "Export the vendor seat roster, confirm owners, then remove or reassign inactive seats before renewal.",
          estimatedSavings: saving,
        });
        verifiedSavings += saving;
      }
    }

    if (currentPlan.tier === "premium") {
      const targetPlan = cheapestPlanForTier(tool.toolId, ["team", "individual"]);
      if (targetPlan && targetPlan.monthlyPrice < currentPlan.monthlyPrice) {
        const saving = estimatePlanChangeSavings(spend, currentPlan.monthlyPrice, targetPlan.monthlyPrice, tool.seats);
        if (saving > 0) {
          recommendations.push({
            tool: toolData.name, severity: "medium", confidence: "review",
            title: `${currentPlan.name} should be justified with usage data`,
            description: `${targetPlan.name} is listed at $${targetPlan.monthlyPrice}/seat/month versus $${currentPlan.monthlyPrice} for the selected premium plan. The lower plan may be enough for users without heavy agent, premium-model, or compliance requirements.`,
            action: "Segment users by 30-day active usage and move low-intensity users to the lower plan only after confirming required features.",
            estimatedSavings: saving,
          });
          reviewableSavings += saving;
        }
      }
    }

    if (currentPlan.tier === "team" && data.teamSize <= 2) {
      const individualPlan = cheapestPlanForTier(tool.toolId, ["individual"]);
      if (individualPlan && individualPlan.monthlyPrice < currentPlan.monthlyPrice) {
        const saving = estimatePlanChangeSavings(spend, currentPlan.monthlyPrice, individualPlan.monthlyPrice, tool.seats);
        if (saving > 0) {
          recommendations.push({
            tool: toolData.name, severity: "medium", confidence: "review",
            title: "Team billing may be unnecessary for a very small team",
            description: `${individualPlan.name} is listed below the selected team plan. The savings depend on whether admin controls, centralized billing, SSO, or policy management are required.`,
            action: "Confirm governance requirements before renewal; downgrade only users who do not need team controls.",
            estimatedSavings: saving,
          });
          reviewableSavings += saving;
        }
      }
    }

    const annualAlternative = toolData.plans.find((plan) => plan.tier === currentPlan.tier && plan.billingCadence === "annual" && plan.monthlyPrice < currentPlan.monthlyPrice);
    if (annualAlternative) {
      const saving = Math.min(spend, roundMoney((currentPlan.monthlyPrice - annualAlternative.monthlyPrice) * tool.seats));
      if (saving > 0) {
        recommendations.push({
          tool: toolData.name, severity: "medium", confidence: "review",
          title: "Annual billing could reduce the per-seat rate",
          description: `${annualAlternative.name} is listed at $${annualAlternative.monthlyPrice}/seat/month equivalent versus $${currentPlan.monthlyPrice} on your selected plan. Confirm contract flexibility and renewal terms first.`,
          action: "Request the annual quote and compare its total commitment with the trailing 12 months of active seats.",
          estimatedSavings: saving,
        });
        reviewableSavings += saving;
      }
    }

    if (tool.monthlySpend && listBaseCost > 0 && tool.monthlySpend > listBaseCost) {
      recommendations.push({
        tool: toolData.name, severity: "medium", confidence: "review",
        title: "Invoice spend exceeds the public base plan cost",
        description: `Your entered invoice is $${roundMoney(tool.monthlySpend - listBaseCost)} above the current base list price. This can come from overages, add-ons, taxes, credits, or regional pricing, so it is not included in verified savings.`,
        action: "Set vendor spend caps, review model/agent usage by user, and move repetitive work to lower-cost approved models where quality permits.",
        estimatedSavings: 0,
      });
    }
  }

  const codingTools = data.tools.filter((tool) => ["cursor", "copilot"].includes(tool.toolId));
  if (codingTools.length > 1) {
    const overlapSaving = Math.min(...codingTools.map(monthlyCost));
    recommendations.push({
      tool: "Developer tooling", severity: "medium", confidence: "review",
      title: "Two code-assistant vendors need an entitlement review",
      description: "Both products may be intentional for different teams. The estimate shown is the smaller vendor spend and should be treated as a maximum review target, not an automatic cancellation.",
      action: "Compare 30-day active users and required controls by team; cancel only duplicate entitlements after a pilot validates the replacement.",
      estimatedSavings: roundMoney(overlapSaving),
    });
    reviewableSavings += overlapSaving;
  }

  const knowledgeTools = data.tools.filter((tool) => ["chatgpt", "claude", "gemini"].includes(tool.toolId) && monthlyCost(tool) > 0);
  if (knowledgeTools.length > 1 && ["Writing", "Research", "Data Analysis", "Mixed Workloads"].includes(data.primaryUseCase)) {
    const overlapSaving = Math.min(...knowledgeTools.map(monthlyCost));
    recommendations.push({
      tool: "General AI assistants", severity: "medium", confidence: "review",
      title: "Multiple general-purpose assistants may be overlapping",
      description: "Chat, research, and analysis tools often overlap at the team level. The estimate shown is the smallest vendor spend in this group and requires a workflow-by-workflow replacement check.",
      action: "Map the workflows handled by each assistant, keep the vendor with required data controls and quality, then cancel duplicate seats after a short pilot.",
      estimatedSavings: roundMoney(overlapSaving),
    });
    reviewableSavings += overlapSaving;
  }

  if (!recommendations.length) {
    recommendations.push({
      tool: "Your stack", severity: "low", confidence: "review", title: "No safe automatic reduction identified",
      description: "The supplied plan, seat, and invoice data do not prove a reduction. This protects you from recommendations that trade away necessary access or compliance controls.",
      action: "Review vendor admin dashboards monthly for inactive users, usage caps, and upcoming renewals.", estimatedSavings: 0,
    });
  }

  return {
    totalMonthlySpend: roundMoney(totalMonthlySpend),
    estimatedAnnualSpend: roundMoney(totalMonthlySpend * 12),
    estimatedMonthlySavings: roundMoney(verifiedSavings),
    reviewableMonthlySavings: roundMoney(reviewableSavings),
    recommendations,
  };
}
