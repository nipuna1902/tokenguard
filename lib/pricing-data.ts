export type BillingCadence = "monthly" | "annual";
export type BillingUnit = "seat" | "account";
export type ToolOverlapGroup = "coding" | "general-assistant";

export interface PlanPrice {
  id: string;
  name: string;
  monthlyPrice: number;
  billingCadence: BillingCadence;
  bestFor: string;
  tier: "free" | "individual" | "team" | "premium";
  /** Whether the price applies per team member or per separately paid account. */
  billingUnit?: BillingUnit;
  /** False when a lower-priced plan does not preserve the paid AI capability. */
  canBeDowngradeTarget?: boolean;
  /** Explicit same-plan annual equivalent when a vendor exposes one. */
  annualAlternativePlanId?: string;
  requiresQuote?: boolean;
}

export interface ToolPricing {
  name: string;
  website: string;
  sourceLabel: string;
  plans: PlanPrice[];
  /** A scope caveat shown beside this tool in the audit wizard. */
  pricingNote?: string;
  /** Enables only deliberate, review-only overlap checks. */
  overlapGroup?: ToolOverlapGroup;
}

// Public USD list prices. These are deliberately limited to self-serve plans:
// negotiated and metered invoices must be entered from the customer's bill.
// Last reviewed: 2026-07-21. Prices exclude tax and possible usage overages.
const rawPricingData = {
  cursor: {
    name: "Cursor",
    website: "https://cursor.com/pricing",
    sourceLabel: "Cursor pricing",
    overlapGroup: "coding",
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
    overlapGroup: "coding",
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
    overlapGroup: "general-assistant",
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
    overlapGroup: "general-assistant",
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
    overlapGroup: "general-assistant",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Light use", tier: "free" },
      { id: "ai-plus", name: "Google AI Plus", monthlyPrice: 9.99, billingCadence: "monthly", bestFor: "Individual productivity", tier: "individual" },
      { id: "ai-pro", name: "Google AI Pro", monthlyPrice: 19.99, billingCadence: "monthly", bestFor: "Advanced individual productivity", tier: "individual" },
    ],
  },
  "notion-ai": {
    name: "Notion AI",
    website: "https://www.notion.com/pricing",
    sourceLabel: "Notion pricing",
    pricingNote: "Notion AI is included in the Business workspace plan shown here, rather than priced as a separate add-on. Use an invoice subtotal when only part of a bundled Notion bill is in scope.",
    plans: [
      { id: "free", name: "Free (limited AI trial)", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Trying Notion AI", tier: "free", canBeDowngradeTarget: false },
      { id: "plus", name: "Plus (limited AI trial)", monthlyPrice: 10, billingCadence: "monthly", bestFor: "Collaborative workspaces without full AI access", tier: "individual", canBeDowngradeTarget: false },
      { id: "business", name: "Business (AI included)", monthlyPrice: 20, billingCadence: "monthly", bestFor: "Workspace members using Notion AI and connected work", tier: "team" },
      { id: "enterprise", name: "Enterprise (quote, AI included)", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Enterprise workspaces with advanced controls", tier: "premium", requiresQuote: true },
    ],
  },
  midjourney: {
    name: "Midjourney",
    website: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
    sourceLabel: "Midjourney plans",
    pricingNote: "Prices cover paid Midjourney accounts. Extra Fast GPU time is usage-based, so enter a recent invoice subtotal when it materially changes the billed amount.",
    plans: [
      { id: "basic-monthly", name: "Basic", monthlyPrice: 10, billingCadence: "monthly", bestFor: "Occasional image generation", tier: "individual", billingUnit: "account", canBeDowngradeTarget: false, annualAlternativePlanId: "basic-annual" },
      { id: "standard-monthly", name: "Standard", monthlyPrice: 30, billingCadence: "monthly", bestFor: "Regular image generation with Relax Mode", tier: "premium", billingUnit: "account", canBeDowngradeTarget: false, annualAlternativePlanId: "standard-annual" },
      { id: "pro-monthly", name: "Pro", monthlyPrice: 60, billingCadence: "monthly", bestFor: "Privacy-sensitive or high-volume creative work", tier: "premium", billingUnit: "account", canBeDowngradeTarget: false, annualAlternativePlanId: "pro-annual" },
      { id: "mega-monthly", name: "Mega", monthlyPrice: 120, billingCadence: "monthly", bestFor: "Highest Fast GPU allocation", tier: "premium", billingUnit: "account", canBeDowngradeTarget: false, annualAlternativePlanId: "mega-annual" },
      { id: "basic-annual", name: "Basic (annual billing)", monthlyPrice: 8, billingCadence: "annual", bestFor: "Occasional image generation with annual commitment", tier: "individual", billingUnit: "account", canBeDowngradeTarget: false },
      { id: "standard-annual", name: "Standard (annual billing)", monthlyPrice: 24, billingCadence: "annual", bestFor: "Regular image generation with annual commitment", tier: "premium", billingUnit: "account", canBeDowngradeTarget: false },
      { id: "pro-annual", name: "Pro (annual billing)", monthlyPrice: 48, billingCadence: "annual", bestFor: "Private or high-volume creative work with annual commitment", tier: "premium", billingUnit: "account", canBeDowngradeTarget: false },
      { id: "mega-annual", name: "Mega (annual billing)", monthlyPrice: 96, billingCadence: "annual", bestFor: "Highest Fast GPU allocation with annual commitment", tier: "premium", billingUnit: "account", canBeDowngradeTarget: false },
    ],
  },
  perplexity: {
    name: "Perplexity",
    website: "https://www.perplexity.ai/pricing",
    sourceLabel: "Perplexity pricing",
    overlapGroup: "general-assistant",
    pricingNote: "Perplexity API credits are billed separately from these subscriptions. Add API or usage charges through the invoice-based entry instead of treating them as included seats.",
    plans: [
      { id: "standard", name: "Standard", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Basic search", tier: "free" },
      { id: "pro", name: "Pro", monthlyPrice: 20, billingCadence: "monthly", bestFor: "Individual research and advanced models", tier: "individual" },
      { id: "enterprise-pro", name: "Enterprise Pro", monthlyPrice: 40, billingCadence: "monthly", bestFor: "Managed research teams", tier: "team" },
      { id: "enterprise-max", name: "Enterprise Max", monthlyPrice: 325, billingCadence: "monthly", bestFor: "High-volume organizational research", tier: "premium" },
    ],
  },
  canva: {
    name: "Canva AI",
    website: "https://www.canva.com/pricing/",
    sourceLabel: "Canva pricing",
    pricingNote: "Canva AI allowances and AI Pass add-ons vary by plan and usage. The annual plan equivalents below cover base subscriptions; use an invoice subtotal for add-ons or a blended bill.",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Basic creative work and limited AI use", tier: "free", billingUnit: "account" },
      { id: "pro-annual", name: "Pro (annual billing)", monthlyPrice: 12, billingCadence: "annual", bestFor: "Individual design and AI tools", tier: "individual", billingUnit: "account" },
      { id: "business-annual", name: "Business (annual billing)", monthlyPrice: 250 / 12, billingCadence: "annual", bestFor: "Teams with brand and AI controls", tier: "team" },
      { id: "enterprise", name: "Enterprise (quote)", monthlyPrice: 0, billingCadence: "monthly", bestFor: "Organizations with advanced controls", tier: "premium", requiresQuote: true },
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
