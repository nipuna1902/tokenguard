# Go-to-market hypotheses and validation plan

> **Status:** strategy document, not measured market validation. TokenGuard currently has no analytics, CRM, scheduling, customer-success workflow, or billing integration. Treat every audience, channel, and conversion number here as a testable hypothesis.

## Product wedge

TokenGuard's narrow initial wedge is not “AI cost optimization for everyone.” It is a fast, transparent **first-pass subscription audit** for small teams that have adopted several AI tools without one clear owner for seats, invoices, and renewals.

The product is most useful before a renewal, budget review, finance close, procurement discussion, or cost-cutting exercise. It should create a next action—verify seats, compare renewal terms, inspect an invoice gap, or test tool consolidation—rather than merely display a large speculative saving number.

## Ideal customer profile (ICP)

| Dimension | Initial hypothesis | Why it matters | What would disprove it |
| --- | --- | --- |
| Company stage | 5–50 person software/startup team | Enough seats/tools for sprawl, but not enough procurement process to solve it manually. | Teams below this size have no pain or teams above it require integrations/security first. |
| Primary buyer | Technical founder, engineering manager, or operations/finance lead | They feel cost pressure and can initiate a review. | The user can view an audit but cannot influence a tool decision. |
| Spend pattern | Several seat-based AI subscriptions plus a few invoice-driven costs | The deterministic audit is strongest for seat and plan visibility. | Most meaningful cost is token/API usage, which current product cannot forecast. |
| Trigger | Renewal, unexpected invoice, headcount change, tool consolidation, budget review | Creates urgency and gives a clear call to action. | Users perceive the problem as an annual low-priority task. |
| Data availability | Can access a recent invoice and vendor seat roster | Supplies the evidence needed to turn a review into action. | User cannot access or safely share any spend data. |

## Jobs to be done

| Job | Current product support | Evidence still missing |
| --- | --- | --- |
| “Help me see our AI-tool monthly run rate.” | Good first-pass support from list prices/invoice totals. | Actual invoice line-item import. |
| “Tell me what I should review before renewal.” | Good directional support through labeled recommendations. | Contract dates, feature requirements, and active-seat data. |
| “Prove which seats are unused.” | Weak: team size is only a proxy. | Vendor roster and 30-day activity evidence. |
| “Forecast our API cost next quarter.” | Not supported. | Historical usage, model mix, and forecasting model. |
| “Make a procurement decision for me.” | Not supported and should not be promised. | Governance workflow and human approval. |

## Positioning

### Recommended message

> “A transparent AI subscription audit that separates what can be counted from what needs a human review.”

### Differentiation

| Alternative | Why a team might choose it | TokenGuard's useful difference |
| --- | --- | --- |
| Spreadsheet/manual invoice review | Full control, no new vendor | Faster initial structure and repeatable recommendations. |
| Generic SaaS-management platform | Broad vendor coverage and enterprise workflows | Lightweight, AI-tool-specific entry point; less onboarding. |
| FinOps/API-cost platform | Deep cloud/model cost analysis | Different scope; TokenGuard should hand off rather than pretend to forecast tokens. |
| Vendor-admin dashboard | Accurate data for one tool | Cross-tool starting point, not a substitute for admin evidence. |

### Claims to use and avoid

| Use | Avoid |
| --- | --- |
| “Estimate current spend and prioritize reviews.” | “Predict your AI spend.” |
| “Counted seat checks and review-only opportunities.” | “Guaranteed savings.” |
| “Enter a recent invoice when public price is not enough.” | “We automatically ingest all billing data.” |
| “Public price snapshot, last reviewed on a documented date.” | “Always-current pricing.” |

See [LANDING_COPY.md](LANDING_COPY.md) for user-facing wording and [audit-methodology.md](audit-methodology.md) for the technical limits behind it.

## Acquisition hypotheses

Start with channels that can produce learning rather than optimizing for reach.

| Channel | Hypothesis | First experiment | Success signal | Failure signal |
| --- | --- | --- | --- | --- |
| Founder/engineering communities | People discuss tool sprawl during price changes and renewals. | Publish a de-identified, method-backed seat-audit example and ask for counterexamples. | Qualified conversations about real workflows. | Engagement is only about the headline saving, not the workflow. |
| Direct customer discovery | Operators will share their process if not hard-sold. | Recruit 10 relevant operators for structured research conversations. | Repeated, concrete pain and data-access patterns. | Vague enthusiasm; no recent review behavior. |
| SEO/problem content | Searchers need comparisons/renewal checklists. | Create a source-cited “AI tool renewal checklist,” not generic AI-cost content. | Organic visits that start and complete audits. | Traffic without relevant completion intent. |
| Partnerships/advisors | Fractional CFOs, dev-tool consultants, or startup operators see recurring spend reviews. | Offer an anonymized pilot workflow and collect failure cases. | Referrals with invoice/roster evidence. | Partners only ask for unsupported API forecasts. |
| Product-led sharing | A safe public report can initiate team discussion. | Add a clear privacy notice and test voluntary sharing with disposable data. | Intentional shares from users who understand visibility. | Sharing is blocked by PII/privacy concerns. |

Never publish an actual customer invoice, report, testimonial, or saving claim without explicit permission and a check that the report cannot expose PII.

## First 30 days of learning

### Week 1: establish the problem

- Recruit 8–12 people in the target roles; prioritize people who recently reviewed a renewal or invoice.
- Record only de-identified notes using `P-001` style participant codes.
- Ask for the actual process before showing TokenGuard.
- Catalog what data is available: invoice, seat roster, contract, or usage export.

### Week 2: test trust language

- Show the verified/review-only labels and ask participants to interpret them.
- Test whether “verified” overstates evidence when it is only a team-size count check.
- Compare a conservative result against a large unqualified saving headline; measure which one users would act on and why.

### Week 3: test acquisition and activation

- Run one content/community experiment and one direct-outreach experiment.
- Measure qualified audit starts, valid audit completions, report-save attempts, and follow-up interest.
- Capture source/UTM only with a privacy-aware analytics plan.

### Week 4: decide what to build

- If data access is the blocker, prioritize CSV invoice/roster import.
- If trust is the blocker, prioritize rule evidence, price snapshots, and report reproducibility.
- If API spend dominates, do not add more subscription-plan cards; validate an API usage model first.

## Funnel definitions

| Stage | Definition | Current implementation status |
| --- | --- | --- |
| Visitor | Loads the landing page | No analytics event yet. |
| Audit start | Reaches or interacts with `/audit` | No analytics event yet. |
| Valid audit | Completes schema-valid inputs and gets a deterministic result | Local behavior exists; no event storage. |
| Report-save attempt | Submits valid email to lead-capture form | UI exists; no event ledger. |
| Saved report | Supabase insert returns an ID | Exists when correctly configured. |
| Delivered email | Provider accepts and later delivers email | Send is attempted; no webhook/delivery tracking. |
| Meaningful outcome | User confirms action/review or realized savings | Not implemented or measured. |

The current North Star should be **evidence-backed audit actions**, not page views. Until action tracking exists, use “valid audit completed” and “report saved” only as early proxy metrics.

## Packaging hypotheses

There is no billing system in the repository. These are options to test, not current offers:

| Model | Value exchanged | Best if | Risk |
| --- | --- | --- | --- |
| Free lead magnet | Audit in exchange for optional follow-up | The result reliably opens high-value advisory/partner conversations. | Collecting PII before securing storage and consent. |
| Paid workflow SaaS | Recurring audits, evidence ledger, integrations, action tracking | Teams return around budgets/renewals. | Low frequency can make subscription value weak. |
| Services/advisory | Human review of contracts, rosters, and implementation | Recommendations need expert context. | Hard to scale; must avoid conflicts of interest. |
| Partner/referral | Introduce a trusted implementation/finance partner | Customer benefits are clear and disclosed. | Misaligned incentives can make saving recommendations untrustworthy. |

## Experiment scorecard

For each experiment, record:

```text
Hypothesis:
Target segment:
Channel and message:
Sample size / period:
Observed behavior (not only opinions):
Conversion definition:
Evidence of trust or rejection:
Privacy/consent checks:
Decision made:
What would change the decision:
```

This makes GTM a learning system rather than a collection of unvalidated tactics.
