# Unit economics and business-model assumptions

> **Status:** this is a planning model, not an operating financial statement. The repository has no billing, CRM, partner, analytics, or revenue data. Do not present sample values here as actual TokenGuard performance.

## Economic question

The product can be evaluated under several business models, but the first question is the same:

> Does a transparent audit create enough trusted, repeatable value that a customer—or a clearly disclosed downstream partner—will pay for the workflow?

The answer cannot be inferred from a high “potential savings” number. It depends on evidence quality, action rate, repeat use, acquisition cost, and realized outcomes.

## Definitions and formulas

| Metric | Formula | Interpretation |
| --- | --- | --- |
| Audit start rate | `audit starts / qualified visitors` | Is the problem/message compelling enough to begin? |
| Valid audit completion rate | `schema-valid audits / audit starts` | Can users supply usable data and finish the workflow? |
| Report save rate | `saved reports / valid audits` | A proxy for perceived value/trust, not proof of willingness to pay. |
| Qualified-lead rate | `qualified leads / visitors` | Requires a defined ICP and qualification rubric. |
| Customer conversion | `paying customers / qualified leads` | Only relevant after a real paid offer exists. |
| CAC | `acquisition spend + attributable labor / acquired customers` | Include founder/research time honestly. |
| Gross margin | `(revenue − variable delivery cost) / revenue` | Provider, storage, support, and human-review costs matter. |
| LTV | `gross margin per period × expected retained periods` | Do not assume retention without cohort data. |
| Realized-savings rate | `confirmed realized savings / recommended candidate savings` | The key quality metric for a cost-optimization product. |

## Candidate business models

| Model | What customer receives | Revenue event | Main cost drivers | What must be validated |
| --- | --- | --- | --- | --- |
| Free assessment / lead generation | A first-pass audit and optional report | Qualified downstream conversation or partner introduction | Acquisition, provider calls, support, privacy/compliance | Does the audit create high-intent, ethical referrals? |
| Subscription workflow | Recurring audits, evidence ledger, integrations, forecasting, action tracking | Monthly/annual subscription | Engineering, integrations, data storage, support | Is the review frequent enough and valuable enough to retain? |
| Assisted optimization | Human-in-the-loop contract/roster/usage review | Project fee or retainer | Expert labor, sales, delivery | Can experts realize value beyond a self-serve report? |
| Enterprise/FinOps add-on | Governance, SSO, data connectors, reporting, controls | Contracted annual deal | Security, implementation, customer success | Does the buyer need cross-vendor workflow rather than a spreadsheet? |

There is no reason to choose a model prematurely. The current app is best treated as a learning wedge for a future evidence-backed workflow.

## Funnel model template

Use variables first, then replace them with measured cohorts:

```text
V = qualified visitors
S = audit-start rate
C = valid-completion rate
R = report-save rate
Q = qualified-lead rate among saved reports
X = customer conversion rate among qualified leads
P = annual contract value (or project revenue)

valid audits       = V × S × C
saved reports      = V × S × C × R
qualified leads    = V × S × C × R × Q
new customers      = V × S × C × R × Q × X
annual revenue     = new customers × P
```

### Illustrative arithmetic only

The following is a worked formula, not a forecast. Replace every rate with observed data before using it in a plan.

| Assumption | Hypothetical value | Calculation |
| --- | ---: | --- |
| Qualified visitors (`V`) | 1,000 | Input volume |
| Start rate (`S`) | 25% | `1,000 × 0.25 = 250 starts` |
| Valid completion (`C`) | 60% | `250 × 0.60 = 150 valid audits` |
| Save rate (`R`) | 20% | `150 × 0.20 = 30 saved reports` |
| Lead qualification (`Q`) | 40% | `30 × 0.40 = 12 qualified leads` |
| Lead-to-customer conversion (`X`) | 15% | `12 × 0.15 = 1.8 expected customers` |
| Annual contract value (`P`) | `$5,000` | `1.8 × $5,000 = $9,000 expected annual revenue` |

The arithmetic demonstrates sensitivity: a weak save rate, qualification rate, or conversion rate can dominate the outcome even when traffic is high. Do not round 1.8 expected customers into a claim of two actual customers.

## Cost model

| Cost category | Present in the codebase? | Cost behavior | How to manage it |
| --- | --- | --- | --- |
| Hosting/build | Yes, deployment dependent | Fixed baseline plus traffic/runtime use | Set budgets and monitor route duration. |
| Supabase storage/API | Yes | Rows, reads, bandwidth, database operations | Retention/expiry, RLS-safe design, separate environments. |
| Gemini summary | Optional | Requests/tokens and quota | Keep summary optional, bounded, rate-limited, and fallback-capable. |
| Resend email | Optional | Messages and delivery volume | Verified domain, suppressions, webhooks, limit retries. |
| Pricing maintenance | Yes, human process | Research/review time | Version sources, schedule review, test updates. |
| Customer support/advisory | Not implemented | Human time | Measure time per completed/reviewed audit before offering services. |
| Security/compliance | Not yet sufficient | Engineering/legal/tooling | Budget before taking sensitive invoices or PII. |

## Value model: savings are not revenue

It is tempting to price as a percentage of “savings found.” That is unsafe for the current product because:

- counted seat savings are still a team-size proxy, not proof of inactive users;
- review-only candidates can overlap and may be mutually exclusive;
- no realized-savings ledger exists;
- contracts, credits, taxes, and operational risk can change actual outcomes.

Before using a gain-share model, the product would need a documented baseline period, a customer-approved action plan, invoice evidence after the change, exclusions, and dispute handling. A fixed project fee or subscription is more defensible until that evidence exists.

## Metrics needed to make the economics real

### Acquisition and conversion

- Channel-qualified visitors and cost per qualified visitor.
- Audit start, valid completion, and report save rates.
- Lead qualification reason and disqualification reason.
- Sales cycle, win/loss reason, contract value, and paid retention.

### Product value and accuracy

- Recommendation view-to-action rate.
- Evidence supplied (invoice, seat roster, contract, usage export).
- Realized savings vs verified/review recommendations.
- False-positive rate and user override reason.
- Pricing snapshot freshness and report reproducibility.

### Delivery cost and risk

- Provider cost per completed audit and fallback rate.
- Email delivery/bounce/complaint rates.
- Support minutes per audit/customer.
- Data retention/deletion workload and security incidents.

## Decision thresholds to define before scaling

These should be set after baseline research, not copied from generic SaaS benchmarks:

| Decision | Evidence required |
| --- | --- |
| Invest in integrations | A repeated, high-value segment cannot act without invoice/roster/usage data. |
| Invest in forecasting | Customers repeatedly need future API-cost decisions and can provide time-series data. |
| Charge for self-serve | Users return around a recurring workflow and can articulate paid value beyond a one-off report. |
| Offer services | Human reviews lead to measurable, repeatable outcomes with acceptable delivery time. |
| Stop/pivot | Pain is infrequent, data access is blocked, or teams do not trust/action the output after evidence improvements. |
