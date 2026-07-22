# TokenGuard technical documentation

This folder contains detailed implementation, operations, and methodology references. Start with the repository-level [documentation guide](../DOCUMENTATION.md) for the full map.

## Read by goal

| Goal | Read |
| --- | --- |
| Understand how the audit is calculated and where precision stops | [audit-methodology.md](audit-methodology.md) |
| Set up, deploy, secure, and operate the app | [operations.md](operations.md) |
| Understand the system map and source ownership | [../ARCHITECTURE.md](../ARCHITECTURE.md) |
| Refresh the supported price catalog and maintenance process | [../PRICING_DATA.md](../PRICING_DATA.md) |
| Review the Gemini boundary and fallback behavior | [../PROMPTS.md](../PROMPTS.md) |
| Check present verification status and test roadmap | [../TESTS.md](../TESTS.md) |

## Documentation rule

Runtime behavior in `app/`, `components/`, `lib/`, and `types/` is authoritative. Price pages and third-party provider behavior must be rechecked against their official documentation before a production release. This repository’s most important honesty rule is to distinguish a deterministic audit from a true spend forecast.
