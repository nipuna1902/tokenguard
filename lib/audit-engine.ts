import {
  AuditFormData,
  AuditRecommendation,
  AuditResult,
} from "@/types/audit";

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

    // High spend detection
    if (tool.monthlySpend > 200) {
      const savings = Math.round(
        tool.monthlySpend * 0.18
      );

      recommendations.push({
        tool: tool.toolId,

        severity: "high",

        title:
          "High monthly spend detected",

        description:
          "Your current usage appears significantly higher than typical startup team usage for this tool. Consider evaluating lower-tier plans, consolidating seats, or optimizing workflows.",

        estimatedSavings: savings,
      });

      estimatedMonthlySavings += savings;
    }

    // Unused seat allocation
    if (
      tool.seats > data.teamSize
    ) {
      const unusedSeats =
        tool.seats - data.teamSize;

      const savings =
        unusedSeats * 15;

      recommendations.push({
        tool: tool.toolId,

        severity: "medium",

        title:
          "Potential unused seat allocation",

        description:
          "Your configured seat count exceeds your declared team size. You may be paying for inactive or unnecessary seats.",

        estimatedSavings: savings,
      });

      estimatedMonthlySavings +=
        savings;
    }

    // Enterprise downgrade detection
    if (
      tool.planId ===
        "enterprise" &&
      data.teamSize < 15
    ) {
      const savings = Math.round(
        tool.monthlySpend * 0.35
      );

      recommendations.push({
        tool: tool.toolId,

        severity: "high",

        title:
          "Enterprise plan may be unnecessary",

        description:
          "Smaller startup teams often do not fully utilize enterprise-tier AI tooling features. Downgrading to a lower plan could significantly reduce recurring costs.",

        estimatedSavings: savings,
      });

      estimatedMonthlySavings +=
        savings;
    }

    // Tool overlap detection
    if (
      data.tools.length >= 4
    ) {
      const savings = Math.round(
        tool.monthlySpend * 0.12
      );

      recommendations.push({
        tool: tool.toolId,

        severity: "low",

        title:
          "AI tooling overlap detected",

        description:
          "Your stack includes several overlapping AI products. Consolidating workflows across fewer tools may improve efficiency and reduce operational complexity.",

        estimatedSavings: savings,
      });

      estimatedMonthlySavings +=
        savings;
    }
  }

  return {
    totalMonthlySpend,

    estimatedAnnualSpend:
      totalMonthlySpend * 12,

    estimatedMonthlySavings,

    recommendations,
  };
}