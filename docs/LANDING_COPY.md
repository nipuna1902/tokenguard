# Landing-page copy and claim guide

> **Purpose:** approved product messaging for TokenGuard.
> **Important:** this is a copy specification, not proof that every phrase is already implemented in `components/`. Before publishing a claim, compare it with the runtime catalog in [`lib/pricing-data.ts`](../lib/pricing-data.ts) and the limits in [audit-methodology.md](audit-methodology.md).

## Positioning

**One-line value proposition**

> Review your AI-tool subscription spend, spot safe savings checks, and prioritize the next cost decision.

**Supporting explanation**

> TokenGuard combines public plan prices with the invoice totals you provide to create a transparent first-pass audit. It separates count-based savings checks from opportunities that need contract, feature, or usage review.

This wording is intentionally narrower than “predicts AI spend” or “automatically finds savings.” The current product is a deterministic point-in-time audit; it does not ingest billing data or forecast tokens/API usage.

## Approved hero copy

| Element | Recommended copy | Why it is safe |
| --- | --- | --- |
| Eyebrow | AI spend audits for startup teams | Matches the product scope. |
| Heading | Understand what your AI stack costs—and what to review next. | Does not promise automatic savings. |
| Subheading | Add your supported AI subscriptions, seats, and optional invoice subtotals. Get a transparent audit that separates count-based savings checks from review-only opportunities. | Explains the inputs and confidence model. |
| Primary CTA | Run a free audit | The audit can run without an account. |
| Secondary CTA | See how the audit works | Must link to an actual example/report only when one exists. |
| Trust line | No login required to generate an audit. | Accurate for the current wizard. |

## How-it-works copy

### 1. Describe your current stack

Select your team size, primary workflow, tools, plans, seats, and—where available—a recent monthly invoice subtotal.

### 2. Get a transparent audit

TokenGuard calculates monthly and annualized spend from public list prices or your invoice total. It labels each recommendation as a counted seat-check or an item that needs review.

### 3. Validate and share the next step

Use the action checklist to verify vendor rosters, contracts, and feature needs. Optionally save a shareable report when storage is configured.

## Supported-catalog language

Use the following wording when describing what is supported **as separate selectable products today**:

> TokenGuard currently includes public-plan snapshots for Cursor, GitHub Copilot, Claude, ChatGPT, Google AI / Gemini, Notion AI, Midjourney, Perplexity, and Canva AI. Other AI products, API bills, and contracted spend can be entered as a generic invoice-backed line item.

Avoid saying that TokenGuard has native per-vendor support for OpenAI API, Anthropic API, Windsurf, or every AI platform. They do not have separate tool IDs or pricing models in the audit form and are covered only through **Other AI / API invoice**.

## Savings-language rules

| Do say | Do not say | Reason |
| --- | --- | --- |
| “Identify savings checks and review opportunities.” | “Find guaranteed savings.” | Only the seat-count condition is counted, and it still needs a roster check. |
| “Estimate monthly and annualized spend.” | “Predict future AI spend.” | Annual spend is the current monthly run rate × 12. |
| “Use your invoice subtotal when it is more accurate.” | “We know your real bill automatically.” | Users enter invoices manually. |
| “Review duplicate tools and plan fit.” | “Cancel redundant tools automatically.” | Feature, compliance, and workflow checks are not available. |
| “Public prices last reviewed on [date].” | “Always current pricing.” | The catalog is static and must be maintained. |

## FAQ copy

### Does TokenGuard require a login?

No. You can run an audit without creating an account. Saving a shareable report asks for an email and requires report storage to be configured for that deployment.

### How are savings calculated?

TokenGuard uses deterministic rules, not an LLM, for financial calculations. The counted-saving total is limited to a seat count above the team size you entered, using the selected plan’s public price and capped by your entered spend. Other plan, renewal, and consolidation ideas are shown separately as review-only opportunities.

### What does “requires review” mean?

It means a potential change could depend on product features, contract commitments, security controls, active usage, or team workflow. Validate the vendor roster, admin dashboard, invoice, and renewal terms before acting.

### How accurate are the prices?

The catalog uses a manually maintained public USD price snapshot. Taxes, regional prices, credits, negotiated terms, add-ons, and usage overages are outside that snapshot. A recent invoice subtotal is usually the better input when it differs from public list price.

### Does TokenGuard forecast API or token costs?

Not today. API and contracted costs can be entered as one invoice-backed line item, but the app does not model token volumes, model mix, or future usage. See [audit-methodology.md](audit-methodology.md) for the roadmap to a real forecast.

### Is company information visible in a shareable report?

The public page does not render email, company, or role. However, the current Supabase access pattern needs a server-side/RLS hardening pass before real PII is collected. See [operations.md](operations.md) for the production requirement.

## Social proof and proof standards

Do not publish invented testimonials, unverified customer logos, or fabricated saving examples. The older mock testimonials are intentionally removed from this approved-copy guide.

Acceptable proof once it exists:

- a customer-approved quote with role/company attribution;
- an anonymized, consented before/after audit showing the calculation basis;
- a published case study with methodology, period, and exclusions;
- aggregate metrics with collection method and sample size.

For a hypothetical example, label it clearly:

> Example only: a 3-person team paying for five $20 seats would have a $40/month seat-count review target before the vendor roster is confirmed.

## Conversion and privacy guidance

- Explain why an email is requested: it is used to save and send a report.
- Do not promise ongoing monitoring, alerting, or price-change notifications; those features do not exist.
- Do not promise an email if `RESEND_API_KEY` or a verified sender is not configured; the UI correctly treats email as best-effort after report persistence.
- Add a privacy notice, consent language, and retention/deletion policy before collecting real lead or invoice data.
- Link the secondary CTA only to a real example report or a static explanation page; the current “View Example Report” button has no destination behavior.

## Pre-publish checklist

- [ ] Every named product has a matching supported catalog entry or is explicitly described as generic invoice input.
- [ ] No headline treats review-only amounts as realized or guaranteed savings.
- [ ] No copy claims API forecasting, live integrations, monitoring, or automated actions.
- [ ] Price date/currency/scope is visible where monetary output is marketed.
- [ ] Testimonials, logos, and metrics are real, approved, and attributable.
- [ ] Privacy, consent, storage, and email language matches the deployment’s actual controls.
- [ ] The full audit flow, public report, and email link have been smoke-tested in the target environment.
