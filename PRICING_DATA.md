# Pricing data, sources, and maintenance

> **Runtime source of truth:** [`lib/pricing-data.ts`](lib/pricing-data.ts)
>
> **Snapshot recorded in code:** 2026-07-21
> **Currency and scope:** public USD list prices; tax, regional pricing, credits, negotiated terms, and variable overages are not modeled unless included in a user-entered invoice subtotal.

This document explains what the application actually knows about prices, how it uses those values, and how to keep that knowledge safe. It is not a vendor contract or a claim that every customer pays the listed amount.

For calculation rules and precision limits, read [docs/audit-methodology.md](docs/audit-methodology.md). For the reason pricing math is deterministic rather than LLM-generated, read [PROMPTS.md](PROMPTS.md).

## Core principle

TokenGuard treats public prices as a **fallback estimate**, not as a universal truth:

```txt
positive invoice subtotal supplied?  use invoice subtotal
otherwise                           use public monthly price × quantity
```

That decision makes a recent invoice the better input for discounts, usage overages, credits, taxes, regional prices, and contract add-ons—provided the user enters a single comparable monthly subtotal. A quote-only or generic invoice entry requires a positive subtotal and receives no speculative saving estimate.

## Supported runtime catalogue

The table below reproduces the static values currently shipped in `lib/pricing-data.ts`. Amounts are normalized monthly USD prices per seat/member unless stated otherwise. Plans marked **paid account** are priced per separately paid user account rather than an organization seat.

| Tool ID | Product | Plan ID | Plan shown in UI | Price | Cadence | Tier | Quote required? |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `cursor` | Cursor | `hobby` | Hobby | $0.00 | Monthly | Free | No |
| `cursor` | Cursor | `pro` | Pro | $20.00 | Monthly | Individual | No |
| `cursor` | Cursor | `teams` | Teams | $40.00 | Monthly | Team | No |
| `cursor` | Cursor | `enterprise` | Enterprise (quote) | $0.00 | Monthly | Premium | Yes |
| `copilot` | GitHub Copilot | `free` | Free | $0.00 | Monthly | Free | No |
| `copilot` | GitHub Copilot | `pro` | Pro | $10.00 | Monthly | Individual | No |
| `copilot` | GitHub Copilot | `pro-plus` | Pro+ | $39.00 | Monthly | Premium | No |
| `copilot` | GitHub Copilot | `max` | Max | $100.00 | Monthly | Premium | No |
| `copilot` | GitHub Copilot | `business` | Business | $19.00 | Monthly | Team | No |
| `copilot` | GitHub Copilot | `enterprise` | Enterprise | $39.00 | Monthly | Premium | No |
| `claude` | Claude | `free` | Free | $0.00 | Monthly | Free | No |
| `claude` | Claude | `pro` | Pro | $20.00 | Monthly | Individual | No |
| `claude` | Claude | `max-5x` | Max 5x | $100.00 | Monthly | Premium | No |
| `claude` | Claude | `team-standard` | Team Standard | $25.00 | Monthly | Team | No |
| `claude` | Claude | `team-premium` | Team Premium | $125.00 | Monthly | Premium | No |
| `chatgpt` | ChatGPT | `free` | Free | $0.00 | Monthly | Free | No |
| `chatgpt` | ChatGPT | `plus` | Plus | $20.00 | Monthly | Individual | No |
| `chatgpt` | ChatGPT | `pro` | Pro | $200.00 | Monthly | Premium | No |
| `chatgpt` | ChatGPT | `business-monthly` | Business | $30.00 | Monthly | Team | No |
| `chatgpt` | ChatGPT | `business-annual` | Business (annual billing) | $25.00 | Annual | Team | No |
| `gemini` | Google AI / Gemini | `free` | Free | $0.00 | Monthly | Free | No |
| `gemini` | Google AI / Gemini | `ai-plus` | Google AI Plus | $9.99 | Monthly | Individual | No |
| `gemini` | Google AI / Gemini | `ai-pro` | Google AI Pro | $19.99 | Monthly | Individual | No |
| `notion-ai` | Notion AI | `free` | Free (limited AI trial) | $0.00 | Monthly | Free | No |
| `notion-ai` | Notion AI | `plus` | Plus (limited AI trial) | $10.00 | Monthly | Individual | No |
| `notion-ai` | Notion AI | `business` | Business (AI included) | $20.00 | Monthly | Team | No |
| `notion-ai` | Notion AI | `enterprise` | Enterprise (quote, AI included) | $0.00 | Monthly | Premium | Yes |
| `midjourney` | Midjourney | `basic-monthly` | Basic | $10.00 | Monthly | Individual | No |
| `midjourney` | Midjourney | `standard-monthly` | Standard | $30.00 | Monthly | Premium | No |
| `midjourney` | Midjourney | `pro-monthly` | Pro | $60.00 | Monthly | Premium | No |
| `midjourney` | Midjourney | `mega-monthly` | Mega | $120.00 | Monthly | Premium | No |
| `midjourney` | Midjourney | `basic-annual` | Basic (annual billing) | $8.00 | Annual | Individual | No |
| `midjourney` | Midjourney | `standard-annual` | Standard (annual billing) | $24.00 | Annual | Premium | No |
| `midjourney` | Midjourney | `pro-annual` | Pro (annual billing) | $48.00 | Annual | Premium | No |
| `midjourney` | Midjourney | `mega-annual` | Mega (annual billing) | $96.00 | Annual | Premium | No |
| `perplexity` | Perplexity | `standard` | Standard | $0.00 | Monthly | Free | No |
| `perplexity` | Perplexity | `pro` | Pro | $20.00 | Monthly | Individual | No |
| `perplexity` | Perplexity | `enterprise-pro` | Enterprise Pro | $40.00 | Monthly | Team | No |
| `perplexity` | Perplexity | `enterprise-max` | Enterprise Max | $325.00 | Monthly | Premium | No |
| `canva` | Canva AI | `free` | Free | $0.00 | Monthly | Free | No |
| `canva` | Canva AI | `pro-annual` | Pro (annual billing) | $12.00 | Annual | Individual | No |
| `canva` | Canva AI | `business-annual` | Business (annual billing) | $20.83 | Annual | Team | No |
| `canva` | Canva AI | `enterprise` | Enterprise (quote) | $0.00 | Monthly | Premium | Yes |
| `other` | Other AI / API invoice | `invoice` | Usage-based or contracted invoice | $0.00 | Monthly | Premium | Yes |

`monthlyPrice` is the normalized monthly amount used by the engine. The ChatGPT, Midjourney, and Canva annual entries are deliberately stored as monthly equivalents so a monthly comparison can be made. It does **not** mean a customer pays monthly when choosing an annual contract. Midjourney rows are priced per paid account; Canva Pro is also an individual paid-account plan.

## Official reference pages

These are the links rendered in the audit UI. Check them immediately before changing the catalogue because vendor packaging and regional pricing change frequently.

| Product | Official reference | What TokenGuard takes from it |
| --- | --- | --- |
| Cursor | [Cursor pricing](https://cursor.com/pricing) | Public self-serve tiers; enterprise is treated as quote-based. Cursor can include usage-based charges, so a bill is more precise than the base plan price. |
| GitHub Copilot | [GitHub Copilot plans](https://github.com/features/copilot/plans) | Individual and organization plan prices. Included/paid AI credits and premium-request behavior are not modeled as unit usage. |
| Claude | [Claude pricing](https://claude.com/pricing) | Individual and team subscription tiers. API/model usage and annual discounts are not automatically generalized from this table. |
| ChatGPT | [ChatGPT pricing](https://chatgpt.com/pricing/) | Consumer/business subscription tiers and the explicitly modeled Business annual alternative. API charges are outside these subscription plans. |
| Google AI / Gemini | [Google One plans](https://one.google.com/about/plans) | Consumer-plan snapshot. The page is country-aware, so the code's USD values must be confirmed for the target sales region. |
| Notion AI | [Notion pricing](https://www.notion.com/pricing) | Notion Business is $20/member/month and includes Notion AI. Free and Plus offer limited trials, so they are not automatic downgrade targets for a Business AI workspace. |
| Midjourney | [Midjourney plan comparison](https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans) | Paid-account plans: $10/$30/$60/$120 monthly or $8/$24/$48/$96 monthly equivalents on annual billing. Extra Fast GPU time is usage-based and excluded from the base plan. |
| Perplexity | [Perplexity pricing](https://www.perplexity.ai/pricing) and [Enterprise billing FAQ](https://www.perplexity.ai/help-center/en/articles/10352986-enterprise-pricing-and-billing-frequently-asked-questions) | Pro is $20/month; Enterprise Pro is $40/seat/month and Enterprise Max is $325/seat/month. API credits are purchased separately. |
| Canva AI | [Canva pricing](https://www.canva.com/pricing/) | Annual public prices: Pro $144/year for one paid account and Business $250/year per person. Shared AI allowances and AI Pass add-ons are not modeled as base subscription price. |
| Generic invoice | [FinOps usage-cost guidance](https://www.finops.org/framework/capabilities/understand-usage-cost-and-quantity/) | A reminder to use observed cost/usage data instead of inventing a universal price for an unsupported or metered vendor. |

## How price data is represented

Each plan has a `PlanPrice` record:

```ts
interface PlanPrice {
  id: string;
  name: string;
  monthlyPrice: number;
  billingCadence: "monthly" | "annual";
  bestFor: string;
  tier: "free" | "individual" | "team" | "premium";
  billingUnit?: "seat" | "account";
  canBeDowngradeTarget?: boolean;
  annualAlternativePlanId?: string;
  requiresQuote?: boolean;
}
```

The metadata is intentionally small:

- `id` is the stable key stored in browser state and saved reports.
- `monthlyPrice` drives cost arithmetic for public plans.
- `billingCadence` distinguishes monthly from annual commitments.
- `tier` drives review-only downgrade and small-team checks.
- `billingUnit` lets the UI distinguish paid accounts from team seats.
- `canBeDowngradeTarget: false` prevents a lower price that lacks equivalent AI capability from becoming a plan-change target.
- `annualAlternativePlanId` pairs a monthly plan with its exact same-plan annual equivalent when tier labels alone are too broad.
- `requiresQuote` prevents the app from treating a $0 placeholder as a real price.
- `bestFor` is user-facing context only; it does not participate in savings math.

## Exact cost behavior

For a tool entry, [`monthlyCost`](lib/audit-engine.ts) calculates:

```txt
listCost = plan.monthlyPrice × quantity  (0 for a quote-only plan)
monthlyCost = max(0, invoiceSubtotal > 0 ? invoiceSubtotal : listCost)
```

The audit then rounds aggregate money to cents. An invoice value of exactly `0` behaves like no invoice and falls back to list price. This is a current implementation constraint, not a statement that a paid subscription cannot be fully credited.

### Why the invoice wins

| Scenario | List-price result | Invoice result | Correct TokenGuard input |
| --- | --- | --- | --- |
| Standard self-serve seats or paid accounts | Usually representative | Not needed | Leave invoice empty. |
| Negotiated discount | Overstates cost | Represents billed subtotal | Enter the current bill. |
| Usage overages / add-ons | Understates cost | Represents blended subtotal | Enter the current bill, then investigate the gap. |
| API or contracted vendor | No trustworthy list price | Required | Select **Other AI / API invoice** and enter a positive subtotal. |
| Tax/credit varies by period | May be incomplete | Depends on accounting scope | Use a consistently defined subtotal and record its scope outside the app. |

## What the engine can and cannot infer from price data

### Supported, deterministic checks

- List-price spend when the plan and seat count are known.
- Invoice-backed spend when a positive monthly subtotal is entered.
- Excess purchased seats above the stated overall team size.
- A lower listed plan, an annual billing alternative, or a smaller overlapping tool cost as a **review target**.
- An invoice above public base cost as a reason to inspect usage and add-ons.

### Intentionally not inferred

- Vendor-specific active-user counts, role assignments, or service accounts.
- Feature equivalence, quality, security, SSO, data residency, or compliance needs.
- Token/model usage, context length, request shape, cache hits, batch discounts, or future API spend.
- The root cause of an invoice/list-price mismatch.
- Whether several review actions can all be realized at once.

## Price data risks and guardrails

| Risk | Current guardrail | Residual limitation |
| --- | --- | --- |
| A vendor changes its price | Source URLs are visible and a review date is embedded in code/UI. | No scheduled sync or freshness alert exists. |
| Regional/currency mismatch | Docs state USD list-price scope; invoice can override. | The UI does not collect currency or region. |
| Enterprise/custom agreement | Quote plans require a positive invoice. | The app cannot allocate the invoice or predict renewal. |
| Metered usage / overages | Generic invoice path gives guardrail recommendations with $0 speculative saving. | No unit-cost model or usage telemetry. |
| Bundled AI workspace price | Notion AI’s selector note explains that Business is the whole workspace subscription. | The app cannot allocate an AI-only portion of a bundled invoice; use a comparable invoice subtotal. |
| AI allowances and credit add-ons | Midjourney, Perplexity, and Canva entries explain what their base plan excludes. | Extra GPU time, API credits, and AI Pass usage are not modeled by list-price arithmetic. |
| Double-counted recommendations | Review-only totals are visually separated. | `reviewableMonthlySavings` is still a gross, non-deduplicated sum. |
| Historical report changes after a price edit | Top-line saved totals remain stored. | Tool cards on a saved report can recalculate from the current catalogue when no invoice is stored. |

## Safe catalog-maintenance procedure

Follow this process every time a vendor price, plan name, or cadence changes:

1. Open the official source page and capture the country, currency, billing cadence, tax statement, plan name, and effective date.
2. Decide whether the plan is self-serve, quote-only, fixed per seat, or usage/metered. Do not turn a quote or metered service into a fixed price without an explicit model and tests.
3. Update `lib/pricing-data.ts`; preserve plan IDs when semantics have not changed so saved drafts/reports remain readable.
4. Update this table, the code's `Last reviewed` comment, [docs/audit-methodology.md](docs/audit-methodology.md), and any user-facing marketing copy that names supported products.
5. Exercise all affected audit rules—list cost, invoice override, premium downgrade, small-team check, annual alternative, and overlap—as applicable.
6. Record a changelog note with the source URL and verification date. For production, persist a price-catalog version with every saved report.

### Price review checklist

- Are prices shown in the intended currency and country?
- Is the number monthly, annual, per-seat, per-org, or a monthly equivalent of an annual commitment?
- Does the public price include bundled usage that can create overages later?
- Can a customer obtain a negotiated price, credit, reseller price, or regional price instead?
- Is the tool a subscription, a metered API, or a mixture of both?
- Does a lower plan preserve required governance, security, and workflow features?
- Can the proposed saving overlap another recommendation?

## Production evolution

A dependable forecast product should replace this static catalog with versioned pricing snapshots: source URL, retrieval time, region/currency, plan terms, content hash, and an approval record. Each saved audit should store the exact plan-price snapshot and rule version used to compute it. That turns "we think the plan cost this much" into a reproducible financial artifact.
