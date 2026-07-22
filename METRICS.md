# Product metrics and learning plan

> **Status:** no analytics events, dashboard, CRM, email webhooks, or realized-savings tracking are implemented in the current code. This document defines a measurement plan; it does not report actual TokenGuard metrics.

## Measurement principle

TokenGuard should optimize for **trusted action**, not a flashy saving estimate or a daily-active-user number. A one-off audit product can have low daily frequency and still be valuable if it helps an accountable owner make a correct renewal, entitlement, or consolidation decision.

## Proposed North Star

> **Evidence-backed optimization actions per month**

An action counts only when a user records a recommendation, attaches or references validating evidence (for example, an invoice or seat roster), assigns an owner, and reports an outcome or reason for rejection.

This metric is not available today. Until an action ledger exists, use two clearly labeled proxy metrics:

1. **Valid audit completions** — user reaches a Zod-valid deterministic result.
2. **Saved reports** — Supabase insert succeeds after lead capture.

Neither proxy proves actual savings, trust, or revenue.

## Funnel metrics

| Stage | Event / definition | Formula | Why it matters | Current status |
| --- | --- | --- | --- | --- |
| Qualified visit | Landing view from intended segment/channel | Count | Separates useful traffic from vanity traffic. | Not instrumented |
| Audit start | First meaningful interaction on `/audit` | `starts / qualified visits` | Tests problem/message relevance. | Not instrumented |
| Valid audit | `generateAudit` receives a valid form | `valid audits / starts` | Tests onboarding and data availability. | Not instrumented |
| Summary response | Summary endpoint returns provider/fallback response | `summary responses / valid audits` | Detects route/provider health. | Not instrumented |
| Report-save attempt | Valid email submission attempt | `save attempts / valid audits` | Tests willingness to preserve/share result. | Not instrumented |
| Report saved | Supabase insert returns an ID | `saved reports / save attempts` | Detects RLS/schema/config failures. | Partially observable in Supabase logs |
| Email accepted | Resend send call returns success | `accepted emails / saved reports` | Detects route/sender failure. | Partially observable in Resend |
| Public report view | A report URL renders | `report views / saved reports` | Measures sharing/return behavior. | Not instrumented |
| Evidence-backed action | Recommendation has evidence and an outcome | `actions / valid audits` | Measures real value. | Not implemented |
| Realized saving | Invoice/contract confirms change | `realized savings / candidate savings` | Calibrates recommendation quality. | Not implemented |

## Trust and precision metrics

Financial recommendation quality needs its own scorecard; conversion alone can reward exaggeration.

| Metric | Definition | Desired interpretation |
| --- | --- | --- |
| Verified recommendation confirmation rate | `verified recommendations confirmed by roster / verified recommendations reviewed` | Tests whether the team-size proxy is sufficiently conservative. |
| Review recommendation action rate | `review items acted on / review items shown` | Finds useful investigation prompts. |
| Review false-positive rate | `review items rejected as unsuitable / review items reviewed` | Shows where feature/contract/context rules are too broad. |
| Gross-to-realized ratio | `realized savings / gross reviewable estimate` | Makes non-additive review totals visible; should not be used as a promise. |
| Forecast error | Error between forecast and actual spend over time | Not meaningful until time-series forecasting exists. |
| Price freshness | Days since each catalog source was reviewed | Protects public-price credibility. |
| Report reproducibility rate | Saved reports that can be recreated from stored price/rule snapshot | Requires snapshot storage; currently not measurable. |

## Event design

Instrument events through a privacy-aware server or analytics layer. Do not send raw email addresses, invoice subtotals, full report payloads, or secret keys to an analytics vendor by default.

| Event | Minimal properties | Never include by default |
| --- | --- | --- |
| `audit_started` | anonymous session ID, entry source, app version | Email, company, invoice amount |
| `audit_validated` | number of tools, use case, catalog version, validation outcome | Tool-level spend, full form data |
| `audit_generated` | verified/review counts, zero/non-zero buckets, rule version | Exact financial values unless consented/aggregated |
| `summary_completed` | provider/fallback flag, status class, duration bucket | Prompt/payload, API key |
| `report_save_attempted` | anonymous session ID, outcome/error category | Email address, raw Supabase response |
| `report_saved` | report ID hash, catalog/rule version | PII or full audit payload |
| `email_requested` | success/error category, sender configuration flag | Recipient email, email HTML |
| `public_report_viewed` | report ID hash, referrer class | Full URL query data or PII |
| `recommendation_outcome` | rule ID, accepted/rejected/deferred, evidence type | Sensitive invoice/contract contents |

Use a random first-party session identifier, document consent, and define data retention before enabling analytics. The current public report/RLS risk must be resolved before treating analytics as a substitute for privacy controls.

## Dashboard views to build

### Product health

- Visitor → start → valid audit → save funnel by channel and device.
- Form validation failure categories and abandon step.
- Summary fallback/error rate and route latency.
- Supabase insert failure rate by error category.
- Email acceptance, delivery, bounce, and complaint rate.

### Recommendation quality

- Distribution of verified vs review-only outputs.
- Zero-safe-saving rate by segment/use case.
- Recommendation confirmation, rejection, and action rate by rule.
- Gross reviewable amount versus confirmed realized amount.
- Price catalog version/review age used by audits.

### Commercial learning

- Qualified lead rate and reason for qualification.
- Follow-up request rate after saved report.
- Time from audit to action/renewal decision.
- Cohorts that return around a renewal or budget event.
- Support time and data-collection friction per useful audit.

## Alert conditions

Start with simple operational alerts, then calibrate thresholds using baseline data:

| Signal | Possible meaning | First response |
| --- | --- | --- |
| Sudden rise in audit validation failures | Price catalog/UI mismatch or malformed traffic | Inspect recent catalog/form changes and error categories. |
| Summary fallback spike | Gemini key/quota/provider outage | Verify provider dashboard; preserve deterministic audit path. |
| Save failure spike | Supabase/RLS/schema/config regression | Stop collecting leads until data path is verified. |
| Email failure/bounce spike | Sender/domain/provider or bad data | Pause sends, check Resend and validation. |
| High report saves but low action confirmation | Curiosity without trust/actionability | Collect direct user feedback; improve evidence capture rather than headline copy. |
| High review false-positive rate | Rules too broad or missing governance context | Tighten rules, collect evidence, avoid inflating gross totals. |
| Stale pricing snapshot | Price credibility risk | Review sources and release a catalog update. |

## Experiment design rules

- State one hypothesis, one audience, one primary metric, and one guardrail metric.
- Measure behavior (completed audit, evidence supplied, action), not only clicks or stated intent.
- Keep a control/baseline when changing saving language or confidence labels.
- Segment results by data availability and buyer role; an average can hide a broken workflow.
- Do not optimize report-save conversion by obscuring privacy or overstating savings.
- Log catalog/rule version with each aggregate event so a pricing change cannot masquerade as a product improvement.

## Initial instrumentation sequence

1. Add a privacy-reviewed first-party event layer for audit start, validation, result generation, save success/failure, and summary fallback.
2. Add server-side report creation with a correlation ID, then record only safe operational metadata.
3. Capture email delivery webhooks and a report-revocation/deletion event.
4. Add an action ledger with evidence type, owner, status, and realized outcome.
5. Add pricing/rule snapshots and quality dashboards before attempting forecast metrics.
