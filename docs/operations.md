# TokenGuard Operations Guide

This guide explains how to run, configure, deploy, observe, and safely operate the current TokenGuard codebase. It is intentionally code-oriented: it describes what the repository does today, distinguishes graceful fallbacks from production controls, and calls out gaps that matter for a real launch.

**Code snapshot:** July 21, 2026. The authoritative implementation is in `app/`, `components/`, `lib/`, and `types/`; this document does not invent services that are not present in the repository.

## 1. Operating model in one minute

| Concern | Current implementation | Operational consequence |
| --- | --- | --- |
| Audit calculation | `lib/audit-engine.ts` runs deterministic calculations in the browser. | No API key is needed to calculate an audit; the financial calculation does not depend on an LLM. |
| Browser session | `app/audit/page.tsx` stores the in-progress form and result in `localStorage` under `tokenguard-audit-session`. | A browser refresh preserves progress. Clearing site data, using another browser, or invalid saved data removes that session. |
| Pricing | `lib/pricing-data.ts` contains manually maintained public USD list prices. | Pricing must be reviewed and released deliberately; it is not fetched live at audit time. |
| Executive summary | `POST /api/generate-summary` is a Next.js Route Handler that can call Gemini. | Missing or failed Gemini produces a fallback summary; it does not block the audit. |
| Report persistence | The `LeadCapture` client component writes directly to Supabase with the public anonymous key. | Supabase schema and Row Level Security (RLS) are part of the application security boundary. |
| Public report | `/audit/report/[id]` queries Supabase on the server, using the same anonymous client configuration. | A report link is intentionally public; secure policies must not expose the base table’s PII. |
| Email | `POST /api/send-email` calls Resend after the report is saved. | Persistence and email are not one transaction: a report can save even when delivery fails. |

### Request and data flow

```text
Browser: /audit
  ├─ validate form → calculate deterministic AuditResult locally
  ├─ POST /api/generate-summary → Gemini (optional) → summary/fallback
  ├─ insert audit_reports directly through Supabase anon client
  └─ POST /api/send-email → Resend (optional)

Server: /audit/report/[id]
  └─ read audit_reports through Supabase anon client → render public report + metadata
```

The two endpoints are **Route Handlers** (`app/api/*/route.ts`), not legacy Pages Router API routes. They accept `POST` only; Route Handlers are not cached by default, and POST handlers are not cached. See the [Next.js Route Handler guide](https://nextjs.org/docs/app/getting-started/route-handlers).

## 2. Local setup and everyday commands

### Prerequisites

- Node.js `>=20.9.0` — this is the engine range declared by the installed Next.js 16.2.5 package.
- npm, a Supabase project for saved reports, and optionally Google AI Studio and Resend accounts.
- Network access during a production build: `app/layout.tsx` imports `Inter` through `next/font/google`, so the build can need to fetch the font.

The repository has a lockfile. Prefer a clean, repeatable install for CI or a new machine:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Useful commands are:

| Command | What it verifies or does |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npx tsc --noEmit` | Checks TypeScript without emitting files. |
| `npm run lint` | Runs the configured ESLint command. |
| `npm run build` | Produces a production build and performs Next.js type/build checks. |
| `npm run start` | Serves a successful production build locally. |

There is currently **no** `test` or `test:watch` script in `package.json`, and no test runner dependency.

Run `npm run lint` as the project lint gate before release. Add automated tests and CI coverage before treating lint alone as sufficient release verification.

### Local environment file

Create `.env.local` in the repository root. It is ignored by `.gitignore`; never commit it or paste its values into logs, issues, screenshots, or client code.

```env
# Required for saving and loading reports
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-or-publishable-key>

# Optional: enables Gemini-backed summaries; fallback copy is used when absent
GEMINI_API_KEY=<server-only-google-ai-key>

# Optional: enables email delivery after a report is saved
RESEND_API_KEY=<server-only-resend-key>
RESEND_FROM_EMAIL=TokenGuard <reports@updates.example.com>

# Strongly recommended outside local development; use the canonical public origin
NEXT_PUBLIC_APP_URL=https://app.example.com
```

Next.js loads `.env*` files into `process.env`. Values prefixed with `NEXT_PUBLIC_` are embedded in browser JavaScript at build time; use that prefix only for values intended to be public. The Supabase project URL and anonymous/publishable client key fall into that category, but their safety depends on RLS. `GEMINI_API_KEY` and `RESEND_API_KEY` must remain server-only. Read the [Next.js environment-variable guide](https://nextjs.org/docs/app/guides/environment-variables) for load order and build-time behavior.

### Environment-variable reference

| Variable | Required now? | Read by | Behavior when absent | Notes |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for saved reports | browser and server | `isSupabaseConfigured` is false; saving and report viewing show a configuration message | Public endpoint; set at build time for browser use. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required for saved reports | browser and server | Same as above | Public client credential, never a service-role secret. RLS must protect the data. |
| `GEMINI_API_KEY` | Optional | server Route Handler only | `/api/generate-summary` returns a deterministic fallback summary | Restrict and rotate the key; never use a `NEXT_PUBLIC_` name. |
| `RESEND_API_KEY` | Optional | server Route Handler only | `/api/send-email` returns HTTP 503; the UI still preserves a successfully saved report | Use a least-privilege key where the provider supports it. |
| `RESEND_FROM_EMAIL` | Recommended when email is enabled | server Route Handler only | Defaults to `TokenGuard <onboarding@resend.dev>` | Use an address on a Resend-verified domain in production. |
| `NEXT_PUBLIC_APP_URL` | Strongly recommended | server email Route Handler | Uses request `Origin`, then `http://localhost:3000` | Set a trusted canonical HTTPS origin in every deployed environment. It prevents malformed or attacker-controlled report links from the fallback origin path. |

`NEXT_PUBLIC_*` values are frozen in the client bundle built by `next build`. If a deployment promotes one built artifact between environments, build it with the correct public Supabase URL/key for the target environment or provide an intentional runtime configuration mechanism.

## 3. Supabase: schema, access path, and production boundary

### What the app writes

The browser component [`components/audit/lead-capture.tsx`](../components/audit/lead-capture.tsx) inserts one row into `public.audit_reports`, then requests only the generated `id` with `.select("id").single()`. The share link is `/audit/report/<id>`.

The saved payload is:

| Column | Source and meaning | Suggested type |
| --- | --- | --- |
| `id` | Generated share identifier returned after insert | `uuid` primary key, default-generated |
| `email` | Normalized lead email | `text`, required |
| `company` | Optional lead field | nullable `text` |
| `role` | Optional lead field | nullable `text` |
| `team_size` | Declared team count | `integer`, required |
| `primary_use_case` | One of the five supported use cases | `text`, required |
| `tools` | JSON array of `{ toolId, planId, seats, monthlySpend? }` | `jsonb`, required |
| `monthly_spend` | Audit total, not a payment transaction | `numeric`, required |
| `monthly_savings` | **Verified** monthly savings only | `numeric`, required |
| `annual_spend` | Audit total × 12 | `numeric`, required |
| `ai_summary` | Gemini or fallback summary; can be empty if saved before the async request completes | `text`, required/default empty |
| `created_at` | Operational audit timestamp | `timestamptz`, default `now()` |

The app does **not** persist recommendations, `reviewableMonthlySavings`, a pricing snapshot, a vendor-price version, an email-delivery status, or a report expiry/revocation state. A public report is therefore a shareable summary, not immutable financial evidence.

### Schema specification

There is no checked-in Supabase migration in this repository. The following is a compatible starting schema for a new project; put it in a reviewed migration or execute it in the Supabase SQL editor. Do not run it unreviewed against a database that already contains production data.

```sql
create table public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 320),
  company text,
  role text,
  team_size integer not null check (team_size between 1 and 100000),
  primary_use_case text not null check (
    primary_use_case in (
      'Coding',
      'Writing',
      'Research',
      'Data Analysis',
      'Mixed Workloads'
    )
  ),
  tools jsonb not null check (jsonb_typeof(tools) = 'array'),
  monthly_spend numeric(14, 2) not null check (monthly_spend >= 0),
  monthly_savings numeric(14, 2) not null check (monthly_savings >= 0),
  annual_spend numeric(14, 2) not null check (annual_spend >= 0),
  ai_summary text not null default '',
  created_at timestamptz not null default now()
);

create index audit_reports_created_at_idx
  on public.audit_reports (created_at desc);
```

`id` is already indexed by the primary key, so the public report lookup needs no separate `id` index. If `gen_random_uuid()` is not available in a particular PostgreSQL deployment, enable the appropriate UUID support before creating the table.

### Current access pattern and the RLS problem to solve

This is the most important operational/security fact about the current implementation:

1. The client-side save flow uses the public Supabase anonymous key.
2. The server-side report page also uses that same anonymous client, not a service-role client.
3. The report page calls `.select("*")`, while rows contain `email`, `company`, and `role`.

Consequently, a broad anonymous `SELECT` policy on `audit_reports` would make the full row readable through Supabase’s public REST API, even though the React report page chooses not to render the PII. An unguessable UUID is useful for sharing but is **not** authorization. Do not treat the present direct-client pattern as production-safe for personal or commercially sensitive data.

RLS must be enabled on tables in Supabase’s exposed `public` schema. Supabase’s [RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) explains why the anonymous key is safe only when policies enforce the intended access.

#### Safe production direction

Before launching with real leads, change the data-access design so no anonymous browser policy can read the base PII table:

1. Send the save request to a server Route Handler and validate it again with Zod.
2. Keep a Supabase service-role key server-only and use it only in that server data-access layer.
3. Make anonymous/public report reads return a whitelist of non-PII fields by a server Route Handler or a carefully designed database function/view.
4. Keep RLS enabled; deny anonymous reads of the base `audit_reports` table and allow only the narrowly required operations.
5. Add report expiration/revocation and a deletion workflow before collecting sensitive spend data.

Until that change is made, use a non-production Supabase project or collect only data you are comfortable making public to anyone with API access. Also test an insert and a report read with the exact anonymous role after every policy change: `.insert(...).select("id")` and `.select("*").eq("id", id)` have different RLS implications.

### Practical Supabase checks

After configuring a project:

1. Confirm the table and column names match the insert payload exactly. In particular, `ai_summary` must be `text`, not a numeric column.
2. Confirm the UUID default returns an `id` on insert.
3. Enable RLS and inspect policies before adding real data.
4. Save a test audit, open its generated share URL in an incognito window, and verify only intended fields are rendered.
5. Inspect Supabase API/database logs for permission, schema, or numeric-conversion errors.
6. Delete test rows when finished; there is no in-product delete or revoke UI.

To revoke a current public link, an operator must remove or otherwise hide the corresponding row at the database layer. The current page then renders a “Report not found” screen; it does not call Next.js `notFound()`, so do not assume the HTTP status is a true 404 without checking it.

## 4. Gemini executive-summary route

[`app/api/generate-summary/route.ts`](../app/api/generate-summary/route.ts) accepts a validated JSON body:

```ts
{
  teamSize: number,
  primaryUseCase: "Coding" | "Writing" | "Research" | "Data Analysis" | "Mixed Workloads",
  auditResult: AuditResult
}
```

The route validates bounds and recommendation fields with Zod. It sends Gemini only the team size, use case, aggregate spend/savings, and recommendation text/metadata. It does **not** send the lead’s email, company, or role.

| Condition | HTTP/result behavior |
| --- | --- |
| Valid request and no `GEMINI_API_KEY` | HTTP 200 with a deterministic, input-specific fallback summary. |
| Valid request and Gemini succeeds | HTTP 200 with trimmed model text, capped to 1,200 characters. |
| Invalid Zod-shaped request | HTTP 400 with `Invalid audit summary request.` |
| Provider/quota/network/parse failure | HTTP 200 with a generic fallback summary. |

The configured code model is `gemini-2.5-flash`. Check the [Gemini model page](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash) and [API-key guidance](https://ai.google.dev/gemini-api/docs/api-key) before changing model names, quotas, auth, or SDKs.

Operationally, the route is intentionally non-critical: the deterministic audit appears before the asynchronous summary request completes. The route has no authentication, rate limit, timeout, cost ceiling, request ID, or provider retry policy. Add those controls before exposing it widely, otherwise abusive traffic can consume Gemini quota while failures are silently represented as fallback copy.

## 5. Resend email route

[`app/api/send-email/route.ts`](../app/api/send-email/route.ts) validates `email`, a non-negative `monthlySavings`, and a UUID-like `reportId` before calling Resend. The body contains a report link and the verified monthly-savings amount.

| Condition | HTTP/result behavior |
| --- | --- |
| Invalid request body | HTTP 400, `Invalid email request.` |
| Missing `RESEND_API_KEY` | HTTP 503, `Email delivery is not configured.` |
| Provider failure | HTTP 500, `Email delivery failed.` |
| Provider success | HTTP 200 with the Resend response data |

The save flow runs email only **after** Supabase insert succeeds. If Resend fails, the UI shows a delivery warning and retains the newly saved report. It does not retry, queue, record delivery state, deduplicate sends, or process delivery/bounce webhooks.

Use `RESEND_FROM_EMAIL` with a verified domain, such as `TokenGuard <reports@updates.example.com>`. The code fallback uses `onboarding@resend.dev`, which Resend restricts to test delivery to the account owner; it cannot deliver production mail to arbitrary recipients. See Resend’s [sender setup](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend) and [resend.dev restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) guidance.

Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS deployment URL. Without it, the route builds report URLs from the incoming `Origin` header and ultimately `http://localhost:3000`; this is fragile for proxies, previews, direct API calls, and hostile origins.

## 6. Deployment runbook

### Supported deployment shape

Deploy this as a Node-capable Next.js application (for example, Vercel or a Node server). Static export is not suitable because the app needs server Route Handlers for Gemini and Resend and server-rendered report data. Next.js supports Node and Docker deployments with `npm run build` followed by `npm run start`; see the [Next.js deployment guide](https://nextjs.org/docs/app/getting-started/deploying).

### Vercel-oriented release steps

1. Connect the repository and let Vercel use the existing `npm ci`/`npm run build` conventions, or configure equivalent install/build commands.
2. Create separate Supabase projects (or at least clearly isolated data) for preview/staging and production. Do not point preview builds at the production lead database.
3. Set every needed environment variable separately for Preview and Production. At a minimum, the public Supabase URL/key must match that environment.
4. In production, set all provider secrets, a verified `RESEND_FROM_EMAIL`, and the exact canonical `NEXT_PUBLIC_APP_URL`.
5. Deploy a preview, run the smoke test below, then promote/merge to the production branch.
6. After deployment, save a real test report and verify the share URL and mail link use the production origin rather than a preview URL.

Vercel lets variables be scoped to Development, Preview, Production, and custom environments. Review its [environment-variable documentation](https://vercel.com/docs/environment-variables) and use preview deployments for every change before production.

### Production smoke test

Run this after every release, preferably with a disposable test email and a non-sensitive test audit:

1. Load `/` and `/audit` over HTTPS.
2. Complete the three-step audit with a known input; verify total monthly spend is list price × seats when invoice is empty, or the positive entered invoice subtotal when one is supplied.
3. Verify that verified savings and review-only opportunities are displayed separately.
4. With Gemini configured, verify a concise summary returns; temporarily test the missing-key fallback in a non-production environment.
5. Save the report and confirm a row appears with the expected numeric values and JSON `tools` array.
6. Open `/audit/report/<id>` in an incognito window and verify the public page does not visibly render email, company, or role.
7. Confirm the email arrives from the verified sender and its link opens the same report.
8. Open a random report ID and confirm the desired not-found behavior, including the actual HTTP status if SEO/cache behavior matters.
9. Review Vercel, Supabase, Gemini, and Resend dashboards for errors or unexpected cost.

## 7. Observability, testing, and release gates

### What exists today

The code provides user-facing errors and HTTP status responses, but it does **not** implement structured logs, error tracking, analytics, distributed tracing, health endpoints, webhooks, background jobs, or automated tests. Provider dashboards and hosting logs are currently the operational sources of truth.

Useful places to inspect are:

| System | What to inspect |
| --- | --- |
| Vercel/host | Route Handler errors, duration, build logs, deployment URL, and environment scope. |
| Supabase | API logs, database logs, RLS policy failures, table growth, and SQL errors. |
| Gemini/Google AI | Key restrictions, quota, model availability, request failures, and billing. |
| Resend | Send API errors, delivered/bounced/complained events, domain status, and suppression behavior. |

### Minimum telemetry to add before scale

Do not log raw emails, full report bodies, API keys, or invoice details. Instead, record privacy-safe counters and a request/correlation ID:

| Signal | Why it matters |
| --- | --- |
| Audit starts, completions, validation failures | Detect broken onboarding and malformed traffic. |
| Summary request count, fallback count, latency, provider errors | Distinguish healthy usage from Gemini quota/outage behavior. |
| Report insert success/failure by error class | Detect schema/RLS regressions immediately. |
| Email request success/failure and provider webhook outcomes | A 200 send response is not proof of inbox delivery. |
| Public report views and not-found rate | Detect bad links, deleted rows, or enumeration/abuse. |
| Vendor price-data version/review date | Make a past audit explainable when prices change. |

### Release gate

A practical release gate is:

```text
npm ci
npx tsc --noEmit
npm run lint
npm run build
npm run start
manual smoke test of audit → save → share → email
```

Run the production server against a non-production Supabase project whenever possible. A build success proves TypeScript and route compilation; it does not prove RLS policies, provider credentials, verified sending domains, or cross-service delivery.

The lint command is currently a blocked part of this gate in the reviewed workspace; resolve the documented lint caveat before relying on this sequence in CI.

## 8. Failure modes and operator response

| Symptom | Likely cause | Current behavior | Operator response |
| --- | --- | --- | --- |
| “Report storage is not configured” | Either public Supabase variable is absent | Save is blocked; public report page shows a configuration screen | Add both public Supabase variables to the correct environment and redeploy/rebuild for browser values. |
| “Could not save the report” | Missing table, wrong column type, RLS policy, invalid key, or network failure | Generic UI error | Inspect browser network response and Supabase logs; verify schema, `ai_summary text`, and RLS. |
| Audit works but summary sounds generic | `GEMINI_API_KEY` absent, invalid, quota-limited, or provider failed | Fallback summary is returned | Verify key restrictions, quota, model availability, and route logs. |
| “Report saved, but the email could not be sent” | Missing Resend key, unverified sender, provider outage, invalid recipient, or bad app URL | Report exists; email warning is shown | Check `/api/send-email` status and Resend dashboard; fix sender/domain and resend manually if appropriate. |
| Resend 403 using `onboarding@resend.dev` | Default test sender used for an external recipient | Email fails | Verify a domain and set `RESEND_FROM_EMAIL`. |
| Email link points to localhost/incorrect host | `NEXT_PUBLIC_APP_URL` missing or wrong | Route falls back to request origin/localhost | Set the canonical HTTPS origin and redeploy. |
| Public report totals disagree with its tool cards later | Pricing data changed after the report was saved | Totals are saved; tool card cost is recomputed from current pricing data | Store a pricing snapshot/audit version and render it for historical reports. |
| Public report omits recommendations/review-only savings | Those fields are never persisted | Current report renders summary, totals, and tool stack only | Persist a validated report snapshot if public reports must be complete audit records. |
| Duplicate/spam reports or provider cost spike | Direct anonymous writes and unauthenticated Route Handlers have no rate limit | Honeypot only stops unsophisticated browser bots | Move writes server-side, add server-side validation, rate limiting, abuse controls, and monitoring. |
| Share link needs revocation | No expiry/delete UI exists | Link remains readable while its row is readable | Delete/hide the row through controlled admin access; add expiration and revocation features. |
| `npm run build` cannot download the Inter font | Build environment cannot reach Google Fonts | Build fails | Restore network access or move to a self-hosted/local font strategy. |

## 9. Security and privacy checklist

### Data classification

| Category | Data in the current flow | Where it goes |
| --- | --- | --- |
| Personal/lead data | Email, optional company, optional role | Supabase; email address also goes to Resend. |
| Business/financial data | Team size, tool/plan names, seats, invoice subtotal, spend and savings totals | Browser localStorage, Supabase, public report rendering, and summary context. |
| Generated content | Executive summary | Browser, Supabase, public report; summary context is generated through Gemini. |
| Secrets | Gemini and Resend API keys | Server environment only. They must never enter browser code or source control. |

The public report UI intentionally does not render email, company, or role. That is a presentation choice, not sufficient database protection; see the RLS section above.

### Controls already present

- Zod validates audit payloads before financial calculations and validates Route Handler request bodies.
- Browser `localStorage` restoration validates its saved shape and removes invalid JSON/state.
- A hidden `website` honeypot rejects basic automated lead-form submissions.
- The Gemini and Resend secrets are read only in server Route Handlers.
- Email report IDs are regex-validated and URL-encoded before use.

### Controls that are absent and should be planned

- Server-side persistence validation and server-owned Supabase data access.
- A production-safe RLS policy/data model that prevents anonymous access to base-table PII.
- Authentication/authorization for administration and deletion.
- Rate limiting, bot detection, request-size limits, and a queue/retry mechanism for external calls.
- Content Security Policy, security headers, security event logging, error tracking, and alerting.
- Consent/privacy notice, retention schedule, data-subject deletion workflow, and report expiry.
- Email delivery/bounce/complaint webhook handling.
- Immutable pricing/audit snapshots and a documented price-review cadence.

### Secrets and access hygiene

1. Rotate provider keys after any suspected exposure and remove old keys from every environment.
2. Never expose a Supabase service-role key, Resend key, or Gemini key through a `NEXT_PUBLIC_` variable.
3. Use separate projects/keys for local, preview, and production. Restrict Google keys to the Gemini API where applicable.
4. Grant humans only the dashboard/database access they need; keep destructive SQL access tightly controlled.
5. Do not include raw reports, emails, invoice subtotals, or provider responses in support tickets or telemetry by default.

## 10. Reference links

- [Current pricing configuration](../lib/pricing-data.ts)
- [Deterministic audit engine](../lib/audit-engine.ts)
- [Validation schemas](../lib/audit-validation.ts)
- [Supabase client configuration](../lib/supabase.ts)
- [Gemini summary Route Handler](../app/api/generate-summary/route.ts)
- [Resend email Route Handler](../app/api/send-email/route.ts)
- [Public report route](../app/audit/report/[id]/page.tsx)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Resend sender/domain setup](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend)
- [Gemini API keys](https://ai.google.dev/gemini-api/docs/api-key)
