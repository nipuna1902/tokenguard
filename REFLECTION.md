# REFLECTION.md

# 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I encountered was during the Supabase integration phase while implementing audit report persistence. The frontend appeared to save successfully, but rows were either not appearing in the database or were silently failing. Initially I suspected Row Level Security (RLS) policies because Supabase often blocks inserts by default. I temporarily disabled RLS to isolate the issue, but the inserts still failed inconsistently.

I then began logging the complete Supabase response object instead of only the error message. This exposed a PostgreSQL numeric parsing error caused by empty strings being inserted into numeric columns. Some optional fields and calculated values were being passed as `""` instead of valid numbers or `null`. Because Supabase returned generic frontend behavior, the real issue was hidden until I inspected the raw response payload carefully.

To debug further, I verified the database schema column-by-column and compared it against the exact insert payload. I eventually found that the `ai_summary` column had accidentally been created as a numeric type instead of text during an earlier schema iteration. After fixing the schema and explicitly converting numeric values using `Number(...)`, inserts became stable.

This bug taught me the importance of validating database schemas carefully, logging raw backend responses instead of relying on UI behavior, and isolating one possible failure source at a time rather than changing multiple variables simultaneously.

---

# 2. A decision I reversed mid-week, and what made me reverse it

One major architectural decision I reversed was initially considering AI-generated audit recommendations instead of deterministic pricing heuristics. Early in development I experimented with letting Gemini generate optimization suggestions dynamically based on user inputs. While the summaries sounded convincing, the recommendations themselves were inconsistent and sometimes financially unrealistic.

For example, the model occasionally suggested aggressive vendor replacements without considering operational realities like team collaboration needs or enterprise compliance requirements. It also struggled to produce repeatable outputs for similar inputs, which would make financial recommendations difficult to trust.

Mid-week I decided to move all audit calculations and optimization logic into deterministic rule-based heuristics using structured pricing data. AI would only generate executive summaries and presentation-oriented language. This dramatically improved reliability, explainability, and consistency.

That reversal ended up becoming one of the strongest architectural decisions in the project because it aligned better with the assignment’s emphasis on understanding when not to use AI.

---

# 3. What I would build in week 2 if I had it

If I had another full week, I would focus primarily on making TokenGuard feel like a true operational finance platform rather than only an audit generator.

The first major improvement would be real-time pricing synchronization. Currently pricing data is manually maintained in structured configuration files. In a production system I would build scheduled ingestion pipelines that automatically track vendor pricing changes and update optimization rules dynamically.

I would also build benchmarking capabilities such as “AI spend per engineer” comparisons across company stages and use cases. That would make the product significantly more valuable because companies could evaluate themselves relative to industry norms rather than only seeing isolated savings opportunities.

Another major addition would be PDF export and executive reporting workflows. Finance and operations teams often need artifacts they can forward internally or attach to procurement discussions. Exportable branded reports would make the product more operationally useful.

Finally, I would improve collaboration capabilities by allowing teams to save historical audits, compare optimization trends over time, and invite multiple stakeholders into shared workspaces.

---

# 4. How I used AI tools

I used AI tools extensively during development, but mostly as accelerators for implementation and debugging rather than sources of truth.

ChatGPT helped me:

- reason through architecture decisions,
- debug frontend and backend issues,
- structure documentation,
- improve UI polish,
- and understand unfamiliar tooling like Supabase and Resend.

Gemini was integrated directly into the product for generating executive summaries from audit results.

However, I intentionally did not trust AI tools with financial calculations or optimization logic. All pricing recommendations, savings estimates, and audit heuristics were implemented deterministically using structured configuration data because I wanted the system to remain explainable and consistent.

One specific instance where AI was wrong occurred during the Gemini integration phase. An earlier recommendation suggested using outdated Gemini model identifiers (`gemini-1.5-flash`) that were no longer supported by the API version I was using. This caused repeated 404 errors until I manually verified current supported models and migrated to `gemini-2.5-flash`.

That experience reinforced the importance of verifying AI-generated implementation details against official documentation rather than assuming generated code is always correct.

---

# 5. Self-rating

## Discipline — 8/10

I maintained consistent daily progress across both engineering and documentation work while balancing debugging, learning unfamiliar infrastructure, and shipping a functional end-to-end product.

---

## Code Quality — 7/10

The project architecture is modular and reasonably scalable for an MVP, though there are still areas where type safety, testing depth, and abstraction quality could be improved with more time.

---

## Design Sense — 8/10

I invested significant effort into creating a polished SaaS-style visual experience with strong hierarchy, spacing, animation restraint, and modern UI consistency.

---

## Problem Solving — 8/10

The project required debugging across frontend rendering, API integrations, Supabase schemas, metadata generation, and deployment infrastructure. I became significantly better at isolating root causes methodically instead of changing multiple things at once.

---

## Entrepreneurial Thinking — 7/10

I focused not only on engineering execution but also on onboarding friction, virality through shareable reports, lead capture flows, and operational positioning. However, I would still want deeper real-world customer validation before claiming strong market confidence.
