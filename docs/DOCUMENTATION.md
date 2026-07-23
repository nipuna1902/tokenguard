# TokenGuard documentation guide

This folder contains the current implementation and product references. Runtime source in `app/`, `components/`, `lib/`, and `types/` is authoritative when it conflicts with a document.

## Recommended reading order

1. [Repository README](../README.md) — product scope, local setup, and project map.
2. [Architecture](ARCHITECTURE.md) — request and data flow, component ownership, and trust boundaries.
3. [Pricing data](PRICING_DATA.md) — supported catalog, formulas, and maintenance process.
4. [Audit methodology](audit-methodology.md) — precision model, examples, limitations, and roadmap.
5. [Operations](operations.md) — environment variables, Supabase, email, deployment, and incidents.

## Product references

| Document | Purpose |
| --- | --- |
| [GTM.md](GTM.md) | Early-adopter and distribution hypotheses. |
| [LANDING_COPY.md](LANDING_COPY.md) | Marketing-copy inventory. |

Treat product references as hypotheses; current implementation and official vendor documentation take precedence.

## Maintenance checklist

Update the relevant Markdown in the same pull request when changing a supported tool, plan, price, formula, API contract, environment variable, database contract, or user-visible claim. Recheck official vendor pages before a pricing-sensitive release.

## Verification status

`npm run lint` is the available lint gate. The repository does not currently define an automated test script or checked-in test suite.
