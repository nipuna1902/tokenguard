export type BillingCadence = "monthly" | "annual";

export interface PlanPrice {
  id: string;
  name: string;
  monthlyPrice: number;
  billingCadence: BillingCadence;
  bestFor: string;
  tier: "free" | "individual" | "team" | "premium";
  requiresQuote?: boolean;
}

export interface ToolPricing {
  name: string;
  website: string;
  sourceLabel: string;
  plans: PlanPrice[];
}

// Public USD list prices. These are deliberately limited to self-serve plans:
// negotiated and metered invoices must be entered from the customer's bill.
// Last reviewed: 2026-07-21. Prices exclude tax and possible usage overages.
const rawPricingData = {
  cursor: {
    name: "Cursor",
    website: "https://cursor.com/pricing",
    sourceLabel: "Cursor pricing",
    plans: [
      { id: "hobby", name: "Hobby", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Occasional individual use", tier: "free" },
      { id: "pro", name: "Pro", monthlyPrice: 20, billingCadence: "monthly", bestFor: "Individual developers", tier: "individual" },
      { id: "teams", name: "Teams", monthlyPrice: 40, billingCadence: "monthly", bestFor: "Managed development teams", tier: "team" },
      { id: "enterprise", name: "Enterprise (quote)", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Contracted deployments", tier: "premium", requiresQuote: true },
    ],
  },
  copilot: {
    name: "GitHub Copilot",
    website: "https://github.com/features/copilot/plans",
    sourceLabel: "GitHub Copilot plans",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Light use", tier: "free" },
      { id: "pro", name: "Pro", monthlyPrice: 10, billingCadence: "monthly", bestFor: "Individual developers", tier: "individual" },
      { id: "pro-plus", name: "Pro+", monthlyPrice: 39, billingCadence: "monthly", bestFor: "Premium-model users", tier: "premium" },
      { id: "max", name: "Max", monthlyPrice: 100, billingCadence: "monthly", bestFor: "High-volume agent workflows", tier: "premium" },
      { id: "business", name: "Business", monthlyPrice: 19, billingCadence: "monthly", bestFor: "Managed organizations", tier: "team" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 39, billingCadence: "monthly", bestFor: "Enterprise governance", tier: "premium" },
    ],
  },
  claude: {
    name: "Claude",
    website: "https://claude.com/pricing",
    sourceLabel: "Claude pricing",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Light use", tier: "free" },
      { id: "pro", name: "Pro", monthlyPrice: 20, billingCadence: "monthly", bestFor: "Individual users", tier: "individual" },
      { id: "max-5x", name: "Max 5x", monthlyPrice: 100, billingCadence: "monthly", bestFor: "Heavy individual use", tier: "premium" },
      { id: "team-standard", name: "Team Standard", monthlyPrice: 25, billingCadence: "monthly", bestFor: "Managed teams", tier: "team" },
      { id: "team-premium", name: "Team Premium", monthlyPrice: 125, billingCadence: "monthly", bestFor: "Heavy managed users", tier: "premium" },
    ],
  },
  chatgpt: {
    name: "ChatGPT",
    website: "https://chatgpt.com/pricing/",
    sourceLabel: "ChatGPT pricing",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Light use", tier: "free" },
      { id: "plus", name: "Plus", monthlyPrice: 20, billingCadence: "monthly", bestFor: "Individual users", tier: "individual" },
      { id: "pro", name: "Pro", monthlyPrice: 200, billingCadence: "monthly", bestFor: "Power users", tier: "premium" },
      { id: "business-monthly", name: "Business", monthlyPrice: 30, billingCadence: "monthly", bestFor: "Teams with admin controls", tier: "team" },
      { id: "business-annual", name: "Business (annual billing)", monthlyPrice: 25, billingCadence: "annual", bestFor: "Teams committing annually", tier: "team" },
    ],
  },
  gemini: {
    name: "Google AI / Gemini",
    website: "https://one.google.com/about/plans",
    sourceLabel: "Google One plans",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Light use", tier: "free" },
      { id: "ai-plus", name: "Google AI Plus", monthlyPrice: 9.99, billingCadence: "monthly", bestFor: "Individual productivity", tier: "individual" },
      { id: "ai-pro", name: "Google AI Pro", monthlyPrice: 19.99, billingCadence: "monthly", bestFor: "Advanced individual productivity", tier: "individual" },
    ],
  },
  other: {
    name: "Other AI / API invoice",
    website: "https://www.finops.org/framework/capabilities/understand-usage-cost-and-quantity/",
    sourceLabel: "FinOps usage-cost guidance",
    plans: [
      { id: "invoice", name: "Usage-based or contracted invoice", monthlyPrice: 0, billingCadence: "monthly", bestFor: "API, model, or vendor costs not listed above", tier: "premium", requiresQuote: true },
    ],
  },
} satisfies Record<string, ToolPricing>;

export type ToolId = keyof typeof rawPricingData;

export const pricingData: Record<ToolId, ToolPricing> = rawPricingData;

export function getPlan(toolId: string, planId: string): PlanPrice | undefined {
  return pricingData[toolId as ToolId]?.plans.find((plan) => plan.id === planId);
}
