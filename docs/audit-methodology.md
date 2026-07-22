# TokenGuard audit methodology and reliability guide

> **Code-accurate snapshot:** 2026-07-21
> **Primary implementation:** [`lib/audit-engine.ts`](../lib/audit-engine.ts), [`lib/pricing-data.ts`](../lib/pricing-data.ts), and [`lib/audit-validation.ts`](../lib/audit-validation.ts)

## The short version

TokenGuard is a deterministic **subscription-spend audit**, not a machine-learning forecast of future AI usage. A user supplies team size, tools, plans, seats, and optionally invoice subtotals. The app combines those inputs with a small, manually maintained catalogue of public USD list prices and produces:

- current monthly and annual spend estimates;
- **verified savings**, limited to a mathematically checkable seat-count condition; and
- **review-only opportunities**, which are plausible actions but require usage, contract, or governance evidence before acting.

An LLM never performs the financial calculation. Gemini may turn the already-calculated result into an executive summary; a deterministic fallback is used when Gemini is unavailable.

This separation is the main reliability decision in the product: language generation can improve readability, but it must not decide what a customer should save.

## What problem the audit solves

Teams often buy AI subscriptions independently and lose a clear view of total spend, purchased seats, and overlapping tools. TokenGuard gives a quick, explainable first-pass review of that stack.

It is intended to answer questions such as:

- “What are we paying each month based on our invoices or public plan prices?”
- “Did we buy more named seats than the team size we supplied?”
- “Which plan, renewal, or duplicate-tool decisions should an operator investigate next?”

It deliberately does **not** claim to know whether a user is inactive, whether a lower plan preserves every required feature, or what a metered API invoice will be next month. Those claims need vendor usage exports, contract terms, and historical consumption data that the current product does not collect.

## End-to-end data flow

```mermaid
flowchart LR
    U[User] --> W[Three-step audit wizard]
    W --> V[Zod validation]
    V --> E[Deterministic audit engine]
    P[Static public price catalogue] --> E
    E --> R[Results: spend, verified savings, review-only opportunities]
    R --> S[Summary API]
    S -->|Gemini configured| G[Gemini 2.5 Flash]
    S -->|Unavailable or no key| F[Deterministic fallback summary]
    R --> L[Optional lead capture]
    L --> DB[(Supabase audit_reports)]
    L --> M[Resend email route]
    DB --> PR[Public report /audit/report/[id]]
```

### Wizard inputs

| Input | Used for | Notes |
| --- | --- | --- |
| Team size | Seat-count comparison; small-team review rule | Must be an integer from 1 to 100,000 for a valid audit. |
| Primary use case | Limits one assistant-overlap rule | Values are Coding, Writing, Research, Data Analysis, or Mixed Workloads. |
| Tool and plan | Finds price, tier, billing cadence, and source link | A selected plan must belong to a supported tool. |
| Seats / paid accounts | List-price calculation and entitlement-count review | Intended to be a positive integer, maximum 100,000. Midjourney and selected Canva plans are labeled as paid accounts in the UI. |
| Optional monthly invoice subtotal | Overrides list-price estimate | Required for quote-based / metered entries. |

The browser keeps wizard state in `localStorage` under `tokenguard-audit-session`. Malformed stored JSON is removed instead of crashing the wizard, and restored state is passed through a session schema before use.

## Pricing model

### Source of truth in the current product

[`lib/pricing-data.ts`](../lib/pricing-data.ts) is the runtime source of truth. It is a manually maintained catalogue of public, self-serve, **USD** list prices, marked “last reviewed: 2026-07-21.” The catalogue intentionally does not attempt to model negotiated contracts or token-metered rates.

Public price pages are linked in the UI so a user can verify a selected vendor’s plan. Prices exclude tax, regional price differences, credits, and possible usage overages. For those cases, the customer’s recent invoice subtotal is the better input.

| Tool | Supported plans in code | Official source linked by the app |
| --- | --- | --- |
| Cursor | Hobby $0; Pro $20; Teams $40; Enterprise (quote) | [cursor.com/pricing](https://cursor.com/pricing) |
| GitHub Copilot | Free $0; Pro $10; Pro+ $39; Max $100; Business $19; Enterprise $39 | [GitHub Copilot plans](https://github.com/features/copilot/plans) |
| Claude | Free $0; Pro $20; Max 5x $100; Team Standard $25; Team Premium $125 | [claude.com/pricing](https://claude.com/pricing) |
| ChatGPT | Free $0; Plus $20; Pro $200; Business $30; Business annual-billing equivalent $25 | [chatgpt.com/pricing](https://chatgpt.com/pricing/) |
| Google AI / Gemini | Free $0; Google AI Plus $9.99; Google AI Pro $19.99 | [Google One plans](https://one.google.com/about/plans) |
| Notion AI | Free / Plus limited trial; Business $20 (AI included); Enterprise quote | [notion.com/pricing](https://www.notion.com/pricing) |
| Midjourney | Basic $10; Standard $30; Pro $60; Mega $120; annual equivalents $8/$24/$48/$96 | [Midjourney plans](https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans) |
| Perplexity | Standard $0; Pro $20; Enterprise Pro $40; Enterprise Max $325 | [Perplexity pricing](https://www.perplexity.ai/pricing) |
| Canva AI | Free $0; Pro annual equivalent $12; Business annual equivalent $20.83; Enterprise quote | [Canva pricing](https://www.canva.com/pricing/) |
| Other AI / API invoice | Usage-based or contracted invoice (quote-only) | [FinOps usage-cost guidance](https://www.finops.org/framework/capabilities/understand-usage-cost-and-quantity/) |

All prices in the table are monthly USD amounts per seat/member unless a plan is explicitly represented as an annual-billing monthly equivalent or paid account. `Enterprise (quote)` and `Other AI / API invoice` are marked `requiresQuote`; a non-zero invoice subtotal is mandatory before the audit will run.

Notion AI is included in its Business workspace subscription, so its list price represents the broader workspace cost rather than an incremental AI add-on. Midjourney extra GPU time, Perplexity API credits, and Canva AI Pass/add-ons are not represented by base plan prices; use a recent invoice subtotal when those charges are material.

### Monthly cost formula

For each tool entry `i`, the engine computes:

```txt
listCost_i = publicMonthlyPrice_i × seats_i
monthlyCost_i = max(0, invoiceSubtotal_i if invoiceSubtotal_i > 0 else listCost_i)
totalMonthlySpend = roundToCents(sum(monthlyCost_i))
estimatedAnnualSpend = roundToCents(totalMonthlySpend × 12)
```

In plain language: a positive invoice subtotal takes precedence over the public list-price estimate. This lets an actual bill capture discounts, add-ons, tax, credits, or metered charges if the user includes them. The engine uses two-decimal rounding for output values.

Two important implications:

1. An invoice entry is an aggregate number, not an allocation of tax, overages, or credits. TokenGuard cannot identify the cause of a gap between invoice and list cost without more data.
2. In the present implementation, an entered value of exactly `$0` is treated the same as a missing invoice and falls back to list price. That is appropriate for the listed free plans but is not a way to represent a fully credited paid-plan invoice.

## Audit decision rules

The engine validates the full form before doing any arithmetic. Invalid input returns a high-priority **review** message and zeroed totals rather than inventing a result.

### 1. Verified savings: excess purchased seats

This is the only recommendation class included in `estimatedMonthlySavings`, the prominent “Verified monthly savings” total.

When all of the following are true:

- a selected self-serve plan has a positive per-seat price;
- purchased seats are greater than the declared team size; and
- the entry has a positive calculated monthly cost,

the engine calculates:

```txt
unusedSeatCount = purchasedSeats − teamSize
verifiedSaving_i = min(monthlyCost_i, unusedSeatCount × planMonthlyPrice_i)
verifiedMonthlySavings = roundToCents(sum(verifiedSaving_i))
```

The cap ensures a recommendation cannot claim savings larger than the entered monthly cost. It is still a **count check**, not proof that every excess seat is inactive: the extra seats may be contractors, shared service accounts, or intentionally reserved capacity. The action is therefore to export the vendor roster, confirm owners, and then remove or reassign inactive seats.

### 2. Review-only opportunities

The following recommendations can carry an `estimatedSavings` value, but their value goes only into `reviewableMonthlySavings`, never into the verified total.

| Rule | Trigger and calculation | Why it needs review |
| --- | --- | --- |
| Quote / metered spend guardrails | Any `requiresQuote` plan with supplied invoice; no numeric saving is added | The app lacks unit prices, workload, model, and usage data. |
| Premium-plan downgrade | Premium plan has a cheaper self-serve individual or team plan on the same billing cadence; target is the cheapest catalog-eligible plan | Premium capacity, workflow, privacy, compliance, and admin features may be required. |
| Very-small-team plan review | Team plan and declared team size is 2 or fewer; a cheaper individual plan exists | Central billing, SSO, policy, and governance requirements can justify the team plan. |
| Annual-billing alternative | The catalog exposes a cheaper annual equivalent for the selected plan; vendors with multiple same-tier plans use an explicit mapping | Savings require a commitment and may reduce renewal flexibility. |
| Invoice exceeds public base cost | Positive invoice is above list price × quantity; no numeric saving is added | Difference could be tax, regional pricing, add-ons, overages, or credits. |
| Coding-tool overlap | Both Cursor and GitHub Copilot appear; target is the smaller of their calculated monthly costs | Products may intentionally serve different teams or workflows. |
| General-assistant overlap | At least two of ChatGPT, Claude, Gemini, and Perplexity have positive spend, and use case is not Coding | Quality, data controls, integrations, and workflow coverage differ. |

For a downgrade, small-team, or annual-billing opportunity, the gross estimate is bounded by both the price difference and current cost:

```txt
reviewEstimate_i = min(monthlyCost_i, (currentPlanPrice − candidatePlanPrice) × seats_i)
```

For tool-overlap rules, the review target is the smaller participating vendor spend. This is deliberately a maximum investigation target, not a recommendation to cancel a product automatically.

### 3. No safe saving found

If no rule produces a recommendation, the engine returns a low-priority review message: “No safe automatic reduction identified.” It does not fabricate a saving to make the result look valuable.

## Confidence model and how to present results honestly

`AuditRecommendation.confidence` has two values:

| Label in product | Meaning | Included in prominent saving total? |
| --- | --- | --- |
| `verified` / “counted saving” | The exact condition can be checked from the supplied seat count, team size, price, and/or invoice. Today this means only the excess-seat arithmetic. | Yes |
| `review` / “requires review” | A meaningful operational decision is still needed. | No |

The results page labels the two totals separately and instructs users to validate review items against vendor admin exports, invoices, and renewal terms. This prevents a common SaaS-audit failure mode: displaying a large headline number that silently combines mutually exclusive or speculative actions.

### Important caveat: review totals are gross, not a forecast

`reviewableMonthlySavings` is the sum of all review estimates. The rules are evaluated independently, so a single spend line can contribute to more than one opportunity (for example, a plan downgrade and an annual-billing alternative). An overlap target can also intersect with a plan-change target.

Therefore, treat this number as a **gross review queue**, not an additive savings forecast or a budget commitment. The verified total is intentionally more conservative; it should also be confirmed with the vendor roster before execution.

## Validation and failure behavior

### Input validation

[`lib/audit-validation.ts`](../lib/audit-validation.ts) uses Zod on both the client flow and the summary API:

- team size must be an integer from 1 to 100,000;
- there must be 1–50 tool records;
- money must be finite, non-negative, and at most $10,000,000;
- tool and plan identifiers must exist in the catalogue and match one another;
- quote-based plans need a recent positive invoice subtotal;
- audit results and summary requests are shape-checked and size-bounded.

The draft seat schema uses Zod `.catch(1)`, which makes malformed stored/draft seat values fall back to one seat. That is resilient for local state restoration, but it can conceal a malformed seat value rather than surface a field-level error. Also, the UI’s basic team-size check is less strict than the final integer schema, so a non-integer passes the first screen but generates a safe invalid-input result later.

### LLM boundary

`POST /api/generate-summary` validates the audit context before use. With `GEMINI_API_KEY`, it sends only bounded audit JSON to Gemini 2.5 Flash and instructs the model to separate verified from review-only results and not invent savings, vendors, or prices. The response is trimmed to 1,200 characters.

Without a Gemini key, the route returns a deterministic summary derived from the computed totals. A non-validation runtime error returns a generic fallback sentence. That generic error fallback should be treated as presentation-only because it can be less precise than the deterministic audit result.

### Storage and delivery boundary

Saving a report is optional. The browser inserts the form payload into Supabase’s `audit_reports` table, then calls `POST /api/send-email` with a validated email, report identifier, and verified monthly savings. Missing configuration produces an explicit storage or email-delivery error instead of a false success.

The public report is rendered from Supabase data at `/audit/report/[id]`. It displays stored monthly spend, annual spend, verified monthly savings, the stored summary, and a tool list. It does not display email or company name. It structurally filters saved tool records before rendering, but it does not replay or persist the full recommendation set.

## Current precision limits

These limits are intentional constraints of the MVP, not hidden assumptions:

1. **No future-usage forecast.** There is no historical time series, token volume, request mix, user activity, or renewal calendar. API and metered spend cannot be predicted from one invoice subtotal.
2. **Manual pricing snapshot.** Prices are hard-coded, manually reviewed, and can drift as vendors change packaging or regional terms. The app does not fetch vendors at runtime or run a scheduled verification job.
3. **Small catalogue.** Products outside the supported plans are grouped under “Other AI / API invoice,” which enables guardrail advice but not a unit-cost optimization.
4. **No entitlement or activity evidence.** Team size is a blunt proxy for active-seat counts. Contractor seats, service accounts, shared workflows, and compliance requirements can all make a count-based recommendation unsuitable.
5. **Invoice ambiguity.** A total invoice can include taxes, credits, add-ons, and usage overages. The app flags the gap but cannot allocate it to a root cause.
6. **Review-estimate overlap.** As noted above, reviewable savings are not deduplicated.
7. **Historical-report drift.** A saved report stores top-line totals but not a pricing snapshot or the complete audit result. The report page recomputes each displayed tool cost from the current catalogue when no invoice was saved, so a later price edit can make its tool list differ from the historical top-line total.
8. **Client-originated persistence.** The lead-capture component writes directly through the public Supabase client. Production correctness and privacy depend on the actual table schema and Row Level Security policies, which are deployment configuration and are not included as migrations in this repository.

## Reliability roadmap: what would make this a dependable prediction product

The current system is dependable for a transparent first-pass subscription audit. To call it a high-precision spend **prediction** system, build the following in priority order.

### P0 — make every result reproducible and evidence-backed

1. **Version and snapshot prices.** Store source URL, retrieval date, currency, region, billing cadence, and a content/version hash for every price used. Save that snapshot with each report.
2. **Capture invoice context.** Collect billing period, currency, tax, credits, committed-use discounts, add-ons, annual commitments, and whether the amount is subscription, API, or blended spend.
3. **Validate and save through a server-side boundary.** Revalidate inputs and calculated results on the server; use a generated report record with strict RLS, instead of trusting a browser insert as the authoritative report artifact.
4. **Add regression tests and CI.** Test exact money arithmetic, quote-plan validation, zero-invoice behavior, review overlap, invalid local state, public-report snapshots, and API fallbacks. The current `package.json` has lint/build scripts but no test script or test files; [TESTS.md](../TESTS.md) records the gap and the proposed suite.

### P1 — replace proxies with operating evidence

5. **Import vendor billing and entitlement data.** Start with CSV uploads, then add least-privilege integrations for billing exports, seat rosters, active-user windows, renewal dates, and admin-control requirements.
6. **Build a decision ledger.** Store every recommendation’s evidence, calculation inputs, rule version, exclusions, owner, action status, and realized savings. This makes the audit explainable months later.
7. **Deduplicate scenarios.** Model mutually exclusive actions—cancel, downgrade, annual commit, or consolidate—as alternatives and present a highest-confidence portfolio rather than a gross sum.
8. **Calibrate confidence.** Make confidence evidence-based (for example: invoice freshness, active-seat proof, contract end date, and measured feature usage) instead of a binary rule label alone.

### P2 — add real forecasting safely

9. **Collect a time series.** Use daily or monthly vendor usage, token/model mix, seats, price changes, product launches, and business drivers such as headcount. Then forecast by vendor and cost type with confidence intervals.
10. **Separate subscription and usage models.** Fixed per-seat subscriptions need entitlement/renewal scenarios; APIs need usage-rate forecasts, model routing simulations, cache/batch effects, and anomaly detection.
11. **Measure realized outcomes.** Compare recommendations with post-change invoices. Track forecast error (MAE/MAPE where meaningful), false-positive reductions, savings realized, and user overrides before improving rules.
12. **Keep human approval in the loop.** Never automate cancellations or downgrades solely from a model; require a named owner and an evidence checklist, especially for security, compliance, and production workloads.

## Key design decisions

TokenGuard separates deterministic finance logic from generative AI. The audit engine uses a manually maintained list-price catalogue plus customer invoices to calculate spend. Only excess seats above the stated team size enter the verified-savings total. Plan changes and tool consolidation remain review-only because the app does not yet have usage, contract, or governance data. Gemini summarizes the result with a deterministic fallback, so it cannot alter the financial recommendation.

| Design area | Current behavior and implication |
| --- | --- |
| Financial recommendations | Deterministic and testable rules make price, feature, and savings provenance inspectable. Gemini only summarizes bounded input. |
| Verified savings | Arithmetic can be checked from supplied inputs, but a vendor roster is still needed to prove a specific seat is inactive. |
| Review opportunities | These prioritize investigation without claiming that money is realized; their total is separate from the verified headline. |
| Pricing truth | `lib/pricing-data.ts` links to official vendor pages and records a review date. Production reports should store a catalog version and price snapshot. |
| Invoice context | A positive invoice overrides list price and can reflect real discounts or charges, but remains blended unless the application collects cost components. |
| Forecasting boundary | This is an audit, not a forecast: it has no history, usage telemetry, active-seat proof, or contract data. Integrations and scenario forecasting are the next step. |
| Overlap control | Mutually exclusive actions need a scenario solver, evidence records, and post-change outcome measurement before their savings can be combined. |
| Report reproducibility | Top-line totals are saved today, but the full recommendation set and price snapshot are not; persist both with rule and catalog versions. |

## File map

| Concern | File |
| --- | --- |
| Domain types and confidence labels | [`types/audit.ts`](../types/audit.ts) |
| Public price catalogue and official links | [`lib/pricing-data.ts`](../lib/pricing-data.ts) |
| Cost formula and recommendations | [`lib/audit-engine.ts`](../lib/audit-engine.ts) |
| Zod schemas and local-session guardrails | [`lib/audit-validation.ts`](../lib/audit-validation.ts) |
| Wizard state and orchestration | [`app/audit/page.tsx`](../app/audit/page.tsx) |
| Results transparency labels | [`components/audit/audit-results.tsx`](../components/audit/audit-results.tsx) |
| LLM summary boundary | [`app/api/generate-summary/route.ts`](../app/api/generate-summary/route.ts) |
| Saved report and public view | [`components/audit/lead-capture.tsx`](../components/audit/lead-capture.tsx), [`app/audit/report/[id]/page.tsx`](../app/audit/report/[id]/page.tsx) |
| Transactional email validation | [`app/api/send-email/route.ts`](../app/api/send-email/route.ts) |

## Bottom line

TokenGuard’s current strength is conservative, explainable subscription auditing. Its safety comes from saying “review this” when evidence is insufficient instead of turning every possible optimization into promised savings. Its next maturity step is not a more persuasive LLM prompt; it is better operational data, immutable audit snapshots, scenario-aware math, and measured real-world outcomes.
