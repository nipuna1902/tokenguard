import {
  AuditFormData,
  AuditRecommendation,
  AuditResult,
} from "@/types/audit";

import { pricingData } from "./pricing-data";

export function generateAudit(
  data: AuditFormData
): AuditResult {
  const recommendations: AuditRecommendation[] =
    [];

  let totalMonthlySpend = 0;

  let estimatedMonthlySavings = 0;

  for (const tool of data.tools) {
    totalMonthlySpend +=
      tool.monthlySpend;

    const toolData =
      pricingData[
        tool.toolId as keyof typeof pricingData
      ];

    if (!toolData) continue;

    const currentPlan =
      toolData.plans.find(
        (plan) =>
          plan.id === tool.planId
      );

    if (!currentPlan) continue;
    if (
      data.teamSize <
      currentPlan.recommendedTeamSize /
        3
    ) {
      const cheaperPlan =
        toolData.plans.find(
          (plan) =>
            plan.monthlyPrice <
            currentPlan.monthlyPrice
        );

      if (cheaperPlan) {
        const savings =
          (
            currentPlan.monthlyPrice -
            cheaperPlan.monthlyPrice
          ) * tool.seats;

        if (savings > 0) {
          recommendations.push({
            tool: toolData.name,

            severity: "high",

            title:
              "Current plan appears oversized",

            description: `${currentPlan.name} is typically optimized for larger teams. Based on your current team size, ${cheaperPlan.name} would likely provide sufficient functionality at a lower operational cost.`,

            estimatedSavings: savings,
          });

          estimatedMonthlySavings +=
            savings;
        }
      }
    }
    if (
      tool.seats >
      data.teamSize
    ) {
      const unusedSeats =
        tool.seats -
        data.teamSize;

      const savings =
        unusedSeats *
        currentPlan.monthlyPrice;

      if (savings > 0) {
        recommendations.push({
          tool: toolData.name,

          severity: "medium",

          title:
            "Potential unused seat allocation",

          description: `Your organization currently pays for ${tool.seats} seats despite a declared team size of ${data.teamSize}. Removing inactive seats could reduce unnecessary recurring costs.`,

          estimatedSavings: savings,
        });

        estimatedMonthlySavings +=
          savings;
      }
    }
    if (
      data.tools.length >= 4
    ) {
      const overlapSavings =
        Math.round(
          tool.monthlySpend *
            0.15
        );

      recommendations.push({
        tool: toolData.name,

        severity: "low",

        title:
          "Potential tooling overlap detected",

        description: `Your stack includes several overlapping AI products. Consolidating workflows across fewer platforms may reduce both cost and operational complexity.`,

        estimatedSavings:
          overlapSavings,
      });

      estimatedMonthlySavings +=
        overlapSavings;
    }
    if (
      currentPlan.tier ===
        "enterprise" &&
      data.teamSize < 10
    ) {
      const savings =
        Math.round(
          tool.monthlySpend *
            0.35
        );

      recommendations.push({
        tool: toolData.name,

        severity: "high",

        title:
          "Enterprise tier may be unnecessary",

        description: `Enterprise-grade AI subscriptions are generally optimized for larger organizations with compliance and governance requirements. Your current team profile suggests a lower-tier plan may provide similar utility.`,

        estimatedSavings: savings,
      });

      estimatedMonthlySavings +=
        savings;
    }
  }
  if (
    estimatedMonthlySavings <
    100
  ) {
    recommendations.push({
      tool: "Overall Stack",

      severity: "low",

      title:
        "Your AI spend appears relatively optimized",

      description:
        "Based on the tools and plans provided, your organization already appears to be operating with relatively efficient AI tooling allocation. Limited optimization opportunities were identified.",

      estimatedSavings: 0,
    });
  }

  return {
    totalMonthlySpend,

    estimatedAnnualSpend:
      totalMonthlySpend * 12,

    estimatedMonthlySavings,

    recommendations,
  };
}