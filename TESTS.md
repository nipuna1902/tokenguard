# Verification and test strategy

> **Current status:** the repository has TypeScript, lint, development, build, and production-start scripts, but it does **not** contain a test runner, `npm run test` script, or checked-in automated test files.

This document deliberately describes the verification that exists today and the test coverage needed to make the financial logic dependable. It replaces older claims about a Vitest suite that is not present in this repository.

## Current quality gates

| Command | Defined now? | What it proves | What it does not prove |
| --- | --- | --- | --- |
| `npx tsc --noEmit` | Yes | TypeScript types across the project compile. | Runtime behavior, money arithmetic, provider configuration. |
| `npm run lint` | Yes | Runs the configured project-wide ESLint command. | It did not complete or emit diagnostics within a 45-second documentation-review probe in this workspace; diagnose scope/configuration before treating it as a passing release gate. |
| `npm run build` | Yes | Next.js compiles a production build and performs framework checks. | Supabase RLS, provider keys, email delivery, pricing freshness. |
| `npm run dev` | Yes | Local interactive development server starts. | Production deployment behavior. |
| `npm run start` | Yes, after build | Production build can be served locally. | Cross-service health. |
| `npm run test` | **No** | — | There is no test script or runner to execute. |

Run the available checks before reviewing documentation or deploying:

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

If a local build uses `next/font/google`, it may need network access to download the configured Inter font. A passing build is necessary but insufficient for a release.

### Current lint caveat

`package.json` defines lint as bare `eslint`, which lets ESLint discover files from the repository root. During this documentation pass, `timeout 45s npm run lint` emitted only the npm script banner and then timed out without diagnostics. That is **not** a successful lint run. Before CI, identify the scanned scope/ignore configuration, make the command deterministic, and record a normal expected duration. The problem may be affected by the existing dirty worktree or environment, so reproduce it in a clean checkout before changing configuration.

## Deterministic audit acceptance matrix

The following cases map directly to `lib/audit-engine.ts`. They are ideal first unit tests once a runner is introduced, and they can also be exercised manually through `/audit`.

| Case | Input | Expected deterministic result | Why it matters |
| --- | --- | --- | --- |
| Excess seats | Team: 3; Cursor Pro: 5 seats; no invoice | Spend `$100.00`; annual `$1,200.00`; verified saving `$40.00`; reviewable `$0.00`. | Proves the only counted-saving formula. |
| Annual alternative | Team: 4; ChatGPT Business monthly: 4 seats | Spend `$120.00`; verified `$0.00`; reviewable `$20.00` from the `$30 → $25` annual equivalent. | Shows annual commitment is separate from verified savings. |
| Paid-account annual alternative | Team: 2; Midjourney Standard: 2 paid accounts | Spend `$60.00`; verified `$0.00`; reviewable `$12.00` from the `$30 → $24` annual equivalent. | Confirms account-priced plans use the same conservative annual-review rule. |
| Bundled AI scope | Team: 2; Notion AI Business: 2 seats | Spend `$40.00`; no plan-downgrade saving to Plus. | Prevents a trial-only Notion plan from being treated as a safe replacement for full Notion AI. |
| Invoice override | Team: 3; Cursor Pro: 3 seats; invoice `$75.00` | Spend `$75.00`, not public list `$60.00`; annual `$900.00`; invoice-above-base review with `$0.00` numeric saving. | Proves a positive invoice wins over list price. |
| Quote/API entry | Team: 5; Other AI / API invoice: 1 seat; invoice `$126.50` | Spend `$126.50`; annual `$1,518.00`; no verified/reviewable saving; usage-guardrail recommendation. | Prevents fabricated API savings. |
| Coding-tool overlap | Team: 2; Cursor Pro: 2 seats; Copilot Pro: 2 seats; use case Coding | Spend `$60.00`; verified `$0.00`; reviewable `$20.00` (smaller tool cost). | Shows a consolidation target is review-only. |
| General-assistant overlap | Team: 2; ChatGPT Plus: 2 seats; Claude Pro: 2 seats; use case Research | Spend `$80.00`; verified `$0.00`; reviewable `$40.00` (smaller tool cost). | Limits assistant-overlap rule to non-coding workflows. |
| Invalid fractional team | Team: `2.5`; otherwise valid tool input | `generateAudit` returns zero totals and one high-priority review message. | Final schema, not only UI navigation, protects arithmetic. |
| Missing quote invoice | Other AI / API invoice with no positive invoice | Tool step cannot validly advance; direct engine call returns safe invalid-input result. | Avoids treating a quote placeholder as free. |
| Zero paid-plan invoice | Paid plan with invoice `0` | Falls back to list price. | Documents an intentional current constraint that needs a regression test. |
| No safe reduction | Valid stack with seats not above team size and no rule trigger | Verified saving remains `$0.00`; a low-priority “No safe automatic reduction identified” review appears. | Guards against inflated output. |

Amounts assume the price snapshot in `lib/pricing-data.ts`. If a price is changed, update the expected amounts and [PRICING_DATA.md](PRICING_DATA.md) in the same pull request.

## Manual end-to-end acceptance checks

### Audit wizard

- [ ] Start at `/audit`; the initial page has one blank tool record.
- [ ] Enter a positive integer team size and one allowed primary use case.
- [ ] Confirm tool and plan selections must match the static catalog.
- [ ] Confirm seats reject invalid values at the final schema boundary; quote/invoice entries require a positive invoice subtotal.
- [ ] Enter a positive invoice that differs from list price and confirm the review screen uses the invoice amount.
- [ ] Refresh at each wizard step and confirm valid state restores from `tokenguard-audit-session`.
- [ ] Manually corrupt that localStorage value, refresh, and confirm the app clears it rather than crashing.
- [ ] Reset the audit and confirm the storage key/state returns to its initial form.

### Results and summary

- [ ] Verify monthly spend, annual spend, verified monthly savings, and reviewable opportunity are separate numbers.
- [ ] Verify recommendation cards expose priority, “counted saving” or “requires review,” explanation, next step, and estimate.
- [ ] Confirm tool links point to the official price sources.
- [ ] With `GEMINI_API_KEY` absent in a non-production environment, confirm a deterministic summary is shown.
- [ ] With a valid key, confirm the summary does not introduce a price or saving absent from the deterministic result.
- [ ] Simulate a summary request failure and confirm the audit numbers remain visible; record that the current UI can leave the summary blank.

### Save, share, and email

- [ ] With no public Supabase configuration, confirm saving is blocked with a clear error and report pages show a configuration message.
- [ ] With a disposable Supabase project, save a report and check every inserted column/type against [docs/operations.md](docs/operations.md).
- [ ] Open the returned `/audit/report/<id>` link in an incognito browser and confirm the rendered page omits email, company, and role.
- [ ] Inspect the actual Supabase RLS policies/API responses—not just the page—to ensure PII is not publicly selectable. The current direct-anon access design needs a server-side redesign before real production data.
- [ ] With `RESEND_API_KEY` absent, verify a saved report produces an email-delivery warning rather than a false failure of persistence.
- [ ] With a verified sender/domain, use a disposable recipient to verify the email link contains the configured canonical origin.
- [ ] Open an invalid report ID and verify expected page and HTTP behavior.

## Recommended automated test suite

The next implementation should add a test runner (for example, Vitest) and a `test` script, then make deterministic rules the highest priority. Suggested structure:

```text
tests/
  audit-engine.test.ts       Money formula, each rule, overlap behavior, rounding
  audit-validation.test.ts   Schemas, bounds, malformed local state, quote invoices
  pricing-data.test.ts       IDs, price/cadence invariants, official-source metadata
  summary-route.test.ts      400 validation, no-key fallback, provider failure, truncation
  email-route.test.ts        Body validation, missing-key 503, canonical URL construction
  report-page.test.ts        Invalid saved tools, missing config, snapshot rendering
e2e/
  audit-flow.spec.ts         Wizard → audit → save → share → email behavior
```

### Unit-test invariants

- All returned money values are finite, non-negative, and rounded to two decimals.
- A quote-only plan cannot calculate a result without a positive invoice subtotal.
- `estimatedMonthlySavings` contains only recommendations with `confidence: "verified"`.
- `reviewableMonthlySavings` is never added to `estimatedMonthlySavings`.
- An invoice takes precedence only when it is greater than zero.
- An overlap recommendation uses the smaller applicable calculated vendor cost.
- Invalid input returns the safe invalid-audit result rather than throwing.
- Pricing source URLs and plan IDs remain valid when catalog data changes.
- A plan marked `canBeDowngradeTarget: false` never becomes a plan-change recommendation target.
- Plan-change comparisons use the current billing cadence so annual and monthly commitments are not conflated.
- An explicit `annualAlternativePlanId` resolves to the matching annual version of the selected plan rather than a different plan in the same tier.

### Integration and browser tests

- Stub Gemini and Resend; never spend provider quota in a default test run.
- Test a real isolated Supabase schema/policy in CI or a disposable environment, because mocks cannot prove RLS safety.
- Exercise browser `localStorage` restore/clear behavior in an end-to-end test.
- Test public-report rendering against a saved immutable report snapshot once that feature is implemented.
- Add accessibility checks for keyboard navigation, form errors, color contrast, and external source links.

## CI and release target

Once tests exist, a minimum pull-request pipeline should be:

```text
npm ci
npx tsc --noEmit
npm run lint
npm run test
npm run build
e2e smoke test against isolated services
```

Block a deployment on test failure, a stale/unreviewed pricing snapshot, or a failed save/share/email smoke test. Schedule a periodic pricing-review task even when no code changes occur.

See [docs/audit-methodology.md](docs/audit-methodology.md) for formulas and [docs/operations.md](docs/operations.md) for operational smoke tests.
