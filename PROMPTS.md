# PROMPTS.md

## AI Usage Philosophy

TokenGuard intentionally limits AI usage to executive summary generation only.

The core audit engine — including pricing calculations, savings estimation, plan optimization, and recommendation logic — uses deterministic business heuristics rather than LLM-generated reasoning.

This design decision was made to ensure:

- Financial defensibility
- Consistent outputs
- Explainable recommendations
- Predictable optimization behavior
- Reduced hallucination risk

The assignment specifically emphasized understanding when not to use AI. For that reason, TokenGuard avoids using LLMs for pricing math or infrastructure optimization calculations.

Instead:

- rule-based logic powers the audit engine,
- AI is only used to improve readability and presentation quality of the final audit summary.

---

# LLM Provider

Provider:

- Google Gemini API

Model:

- gemini-2.5-flash

Integration:

- Server-side Next.js API route

---

# Summary Generation Prompt

The following prompt template is dynamically populated using audit results and user onboarding inputs.

```txt
You are an AI infrastructure cost optimization expert.

Generate a concise executive summary (100-120 words) for a startup team's AI tooling audit.

Context:
- Team size: {teamSize}
- Primary use case: {primaryUseCase}
- Monthly AI spend: ${totalMonthlySpend}
- Annual AI spend: ${estimatedAnnualSpend}
- Potential monthly savings: ${estimatedMonthlySavings}

Recommendations:
{recommendations}

Requirements:
- Professional tone
- Founder-friendly
- Focus on operational efficiency
- Mention optimization opportunities naturally
- Do NOT exaggerate savings
- Keep it concise
```
