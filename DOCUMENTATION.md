# TokenGuard documentation guide

This is the map for maintainers and anyone exploring the project. Documentation is intentionally split between **current implementation references** and **product artifacts** so an older strategy note is never mistaken for runtime behavior.

## Recommended reading order

### Five-minute technical tour

1. [README.md](README.md) — product boundaries and the core design decision.
2. [ARCHITECTURE.md](ARCHITECTURE.md) — request/data flow and component ownership.
3. [PRICING_DATA.md](PRICING_DATA.md) — what the engine can safely calculate.
4. [PROMPTS.md](PROMPTS.md) — why Gemini narrates rather than calculates.

### Before deploying or operating the app

1. [docs/operations.md](docs/operations.md) — environment variables, Supabase, Resend, deployment, and incidents.
2. [TESTS.md](TESTS.md) — current verification reality and acceptance checks.
3. [PRICING_DATA.md](PRICING_DATA.md) — refresh the price snapshot before any pricing-sensitive release.

## Current implementation references

| Document | Source-of-truth topic | Best audience |
| --- | --- | --- |
| [README.md](README.md) | Product scope, setup, quick architecture, limits | Everyone |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Runtime topology, data flow, trust boundaries, scaling | Engineers and maintainers |
| [PRICING_DATA.md](PRICING_DATA.md) | Catalog, formulas, deterministic rules, source links | Product, finance, engineers |
| [PROMPTS.md](PROMPTS.md) | Gemini route contract, prompt rules, fallback behavior | Engineers/reviewers |
| [TESTS.md](TESTS.md) | What is and is not automated; acceptance matrix | Engineers/release owners |
| [docs/audit-methodology.md](docs/audit-methodology.md) | Precision model, examples, limitations, roadmap | Product, finance, and engineering |
| [docs/operations.md](docs/operations.md) | Environment, database, email, deployment, security | Operators |
| [docs/README.md](docs/README.md) | Folder-level entry point for technical documentation | Everyone |

## Product strategy references

These files describe product thinking or the original development journey. They are useful context, but runtime behavior always wins if a statement conflicts with the source code or the documents above.

| Document | Purpose | How to use it |
| --- | --- | --- |
| [GTM.md](GTM.md) | Early adopter and distribution hypotheses | Discuss as a hypothesis, not validated market research. |
| [ECONOMICS.md](ECONOMICS.md) | Illustrative lead-generation economics | Treat numbers as scenario assumptions. |
| [METRICS.md](METRICS.md) | Product measurement ideas | Use to explain how you would learn from the funnel. |
| [LANDING_COPY.md](LANDING_COPY.md) | Marketing-copy inventory | Keep aligned with the supported catalog before publishing. |

## Source-of-truth hierarchy

When documents disagree, use this order:

1. Runtime source in `app/`, `components/`, `lib/`, and `types/`.
2. `package.json` for scripts and dependency versions.
3. Current official vendor pages for external pricing or service behavior.
4. Current implementation documents above.
5. Historical product artifacts.

## Documentation maintenance checklist

Update the relevant Markdown in the same pull request when changing any of the following:

| Change | Documentation to update |
| --- | --- |
| New tool, plan, price, cadence, or source | `PRICING_DATA.md`, `README.md`, methodology, tests |
| New recommendation or savings formula | methodology, `PRICING_DATA.md`, architecture, tests |
| API request/response change | `PROMPTS.md` or `docs/operations.md`, architecture |
| New environment variable | `README.md`, `docs/operations.md` |
| New table field or RLS policy | `docs/operations.md`, architecture |
| New user-visible product claim | `README.md`, `LANDING_COPY.md`, methodology |

## Scope rule

Describe TokenGuard as a **deterministic audit assistant**. Do not claim that it has live vendor integrations, automatic savings realization, token-level forecasting, authenticated multi-tenancy, or production-grade PII isolation unless those capabilities are implemented and documented.
