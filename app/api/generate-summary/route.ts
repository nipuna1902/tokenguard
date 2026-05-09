import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

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
    } = body;

    const prompt = `
You are an AI infrastructure cost optimization expert.

Generate a concise executive summary (100-120 words) for a startup team's AI tooling audit.

Context:
- Team size: ${teamSize}
- Primary use case: ${primaryUseCase}
- Monthly AI spend: $${auditResult.totalMonthlySpend}
- Annual AI spend: $${auditResult.estimatedAnnualSpend}
- Potential monthly savings: $${auditResult.estimatedMonthlySavings}

Recommendations:
${auditResult.recommendations
  .map(
    (r: any) =>
      `- ${r.title}: ${r.description}`
  )
  .join("\n")}

Requirements:
- Professional tone
- Founder-friendly
- Focus on operational efficiency
- Mention optimization opportunities naturally
- Do NOT exaggerate savings
- Keep it concise
`;

    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const result =
      await model.generateContent(
        prompt
      );

    const responseText =
      await result.response.text();

    return Response.json({
      summary: responseText,
    });
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error
    );

    return Response.json({
      summary:
        "Your organization’s AI tooling stack shows several opportunities for optimization. TokenGuard identified potential savings through improved seat allocation, plan optimization, and workflow consolidation strategies.",
    });
  }
}