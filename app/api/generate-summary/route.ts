import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

import { auditResultSchema, primaryUseCaseSchema } from "@/lib/audit-validation";

const summaryRequestSchema = z.object({
  teamSize: z.number().int().min(1).max(100_000),
  primaryUseCase: primaryUseCaseSchema,
  auditResult: auditResultSchema,
});

function fallbackSummary(
  auditResult: z.infer<typeof auditResultSchema>
) {
  const verifiedSavings =
    auditResult.estimatedMonthlySavings > 0
      ? `Verified savings are estimated at $${auditResult.estimatedMonthlySavings.toFixed(2)} per month based on directly checkable paid-entitlement counts.`
      : "No automatically verified savings were identified from the supplied plan and entitlement data.";

  const reviewableSavings =
    auditResult.reviewableMonthlySavings > 0
      ? ` Another $${auditResult.reviewableMonthlySavings.toFixed(2)} per month is flagged for contract, usage, or consolidation review.`
      : "";

  return `TokenGuard estimates current AI spend at $${auditResult.totalMonthlySpend.toFixed(2)} per month and $${auditResult.estimatedAnnualSpend.toFixed(2)} annually. ${verifiedSavings}${reviewableSavings} Recommended actions should be validated against vendor admin exports, invoices, and renewal terms before changes are made.`;
}

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      teamSize,
      primaryUseCase,
      auditResult,
    } = summaryRequestSchema.parse(body);

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        summary: fallbackSummary(auditResult),
      });
    }

    const auditContext = JSON.stringify(
      {
        teamSize,
        primaryUseCase,
        monthlySpend: auditResult.totalMonthlySpend,
        annualSpend: auditResult.estimatedAnnualSpend,
        verifiedMonthlySavings: auditResult.estimatedMonthlySavings,
        reviewableMonthlySavings: auditResult.reviewableMonthlySavings,
        recommendations: auditResult.recommendations.map((recommendation) => ({
          confidence: recommendation.confidence,
          title: recommendation.title,
          description: recommendation.description,
          action: recommendation.action,
          estimatedSavings: recommendation.estimatedSavings,
        })),
      },
      null,
      2
    );

    const prompt = `
You are an AI infrastructure cost optimization expert.

Generate a concise executive summary (100-120 words) for a startup team's AI tooling audit.

Audit JSON:
${auditContext}

Requirements:
- Professional tone
- Founder-friendly
- Focus on operational efficiency
- Mention verified savings separately from review-only opportunities
- Do NOT exaggerate savings
- Do NOT invent vendors, prices, or savings not present in the JSON
- Keep it concise
`;

    const genAI =
      new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      );

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

    const result =
      await model.generateContent(
        prompt
      );

    const responseText =
      await result.response.text();

    return Response.json({
      summary: responseText.trim().slice(0, 1_200),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Invalid audit summary request.",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json({
      summary:
        "Your organization’s AI tooling stack shows several opportunities for optimization. TokenGuard identified potential savings through improved seat allocation, plan optimization, and workflow consolidation strategies.",
    });
  }
}
