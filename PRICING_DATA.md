# PRICING_DATA.md

## Overview

TokenGuard’s audit engine uses deterministic pricing heuristics and publicly available vendor pricing data to evaluate AI tooling efficiency, plan fit, and potential optimization opportunities.

Pricing references were collected during the current submission week directly from official vendor pricing pages. The audit engine intentionally uses rule-based reasoning instead of LLM-generated financial recommendations to ensure transparent, explainable, and defensible optimization logic.

The system evaluates:

- Plan-to-team-size fit
- Oversized enterprise subscriptions
- Seat allocation inefficiencies
- Tooling overlap
- Potential vendor consolidation
- Opportunities to shift toward API-based consumption models

---

# Pricing Sources

## Cursor

Official pricing page:
https://cursor.com/pricing

| Plan       | Monthly Price | Intended Use Case                                           |
| ---------- | ------------- | ----------------------------------------------------------- |
| Hobby      | $0            | Casual individual experimentation                           |
| Pro        | $20           | Solo developers and freelancers                             |
| Business   | $40           | Small engineering teams                                     |
| Enterprise | $60           | Large organizations requiring compliance and admin controls |

---

## GitHub Copilot

Official pricing page:
https://github.com/features/copilot

| Plan       | Monthly Price | Intended Use Case                                       |
| ---------- | ------------- | ------------------------------------------------------- |
| Individual | $10           | Solo developers                                         |
| Business   | $19           | Growing engineering teams                               |
| Enterprise | $39           | Large organizations requiring governance and compliance |

---

## Claude

Official pricing page:
https://www.anthropic.com/pricing

| Plan       | Monthly Price          | Intended Use Case                                        |
| ---------- | ---------------------- | -------------------------------------------------------- |
| Free       | $0                     | Light individual use                                     |
| Pro        | $20                    | Professional individual users                            |
| Team       | $30                    | Collaborative startup teams                              |
| Enterprise | $60                    | Organizations requiring compliance and advanced controls |
| API Direct | Variable / usage-based | Production AI workloads                                  |

---

## ChatGPT

Official pricing page:
https://openai.com/chatgpt/pricing

| Plan       | Monthly Price             | Intended Use Case                            |
| ---------- | ------------------------- | -------------------------------------------- |
| Plus       | $20                       | Individual power users                       |
| Team       | $30                       | Collaborative startup teams                  |
| Enterprise | Custom enterprise pricing | Large organizations with advanced governance |
| API Direct | Variable / usage-based    | Production AI integrations                   |

---

## Gemini

Official pricing page:
https://one.google.com/about/plans

| Plan       | Monthly Price          | Intended Use Case                        |
| ---------- | ---------------------- | ---------------------------------------- |
| Pro        | $20                    | General AI productivity                  |
| Ultra      | $40                    | Heavy AI users requiring advanced models |
| API Direct | Variable / usage-based | Production AI workloads                  |

---

## Windsurf

Official pricing page:
https://windsurf.com/pricing

| Plan | Monthly Price | Intended Use Case               |
| ---- | ------------- | ------------------------------- |
| Pro  | $15           | AI-assisted coding workflows    |
| Team | $30           | Collaborative development teams |

---

# Audit Logic & Optimization Heuristics

TokenGuard intentionally uses deterministic business rules instead of AI-generated financial calculations for pricing optimization.

This ensures recommendations remain:

- Explainable
- Predictable
- Auditable
- Financially defensible

The audit engine currently evaluates the following optimization scenarios:

---

## 1. Oversized Enterprise Plans

Enterprise subscriptions are flagged when team size appears significantly below the intended operational scale for enterprise governance tooling.

Example:

- A 3-person startup paying for enterprise-tier subscriptions may be over-provisioned relative to operational needs.

---

## 2. Seat Allocation Inefficiencies

The engine compares purchased seats against declared team size.

If purchased seats significantly exceed active team members:

- unused licenses are flagged,
- estimated savings are calculated from excess seat reduction.

---

## 3. Tooling Overlap

Multiple tools serving highly similar workflows may indicate stack redundancy.

Example:

- Simultaneously paying for multiple premium conversational AI assistants for similar workloads.

In these cases the engine may recommend:

- consolidation,
- plan downgrades,
- vendor reduction.

---

## 4. Plan-to-Team Fit

Plans are evaluated against intended operational scale.

Examples:

- Team plans used by solo users
- Enterprise plans used by very small teams
- API-heavy pricing used for lightweight experimentation

---

## 5. API vs Retail Subscription Tradeoffs

In some cases organizations paying for multiple premium seats may benefit from:

- centralized API-based consumption,
- shared infrastructure usage,
- reduced per-user licensing.

---

# AI Usage Philosophy

AI is intentionally NOT used for:

- pricing calculations,
- optimization math,
- financial reasoning.

Instead:

- deterministic business heuristics drive audit recommendations,
- LLMs are only used for generating concise executive summaries.

This approach improves:

- reliability,
- transparency,
- audit consistency,
- financial defensibility.
