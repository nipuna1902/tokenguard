Day 1 — 07-05-2026

Hours worked: Around 4 hours

What I did:  
Initialized the TokenGuard project using Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui. Designed the initial product direction and created a premium SaaS-style landing page with a cinematic black-and-beige visual identity. Built reusable UI sections including a floating glassmorphism navbar, animated hero section, supported platforms grid, “How It Works” section, and a polished CTA footer. Added Framer Motion-based animations and established a scalable project structure for future audit engine and backend integrations.

What I learned:  
Learned more about how shadcn/ui generates customizable component code directly inside the project instead of acting as a traditional component library. Also explored how subtle gradients, transparency, spacing, and restrained motion significantly improve perceived product quality in modern SaaS interfaces.

Blockers / what I'm stuck on:  
Encountered a React rendering warning caused by missing unique keys inside animated list rendering while using Framer Motion components. Investigated how React reconciliation works and resolved it using stable keys derived from structured data instead of array indexes. Still evaluating the best architecture for the audit recommendation engine and pricing logic system.

Day 2 - 08-05-2026

Hours worked: 2

What I did:  
Built the core multi-step onboarding flow for TokenGuard’s AI spend audit experience. Implemented dynamic team profiling, AI tool selection, validation handling, review flow, and the initial audit recommendation engine. Added scalable pricing configuration architecture, centralized audit logic, and typed TypeScript models for tools, recommendations, and audit results. Also created the first version of the audit analytics dashboard with spend summaries, optimization insights, and estimated savings calculations.

What I learned:
Learned how to structure dynamic multi-step onboarding flows in Next.js using reusable state-driven components. Explored how deterministic recommendation systems can be designed using heuristic-based business rules instead of relying entirely on LLM outputs. Also gained a better understanding of hydration mismatch debugging in SSR applications and how browser extensions can interfere with React hydration.

Blockers / what I'm stuck on:
Spent time refining the audit savings logic because fixed-value optimization recommendations felt unrealistic for higher spending teams. Currently evaluating better proportional recommendation heuristics and considering more intelligent pricing-aware optimization models for future iterations.

Day 3 - 09-05-2026

Hours worked: 5

What I did:
Integrated Supabase as the backend database for TokenGuard and implemented persistent audit report storage. Built the complete lead capture workflow including email, company, and role collection after audit generation. Added AI-generated personalized summaries using the Gemini API with graceful fallback handling for API failures and quota issues. Implemented dynamic public shareable audit report pages using Next.js dynamic routing (`/audit/report/[id]`) and connected them to Supabase using UUID-based retrieval. Added browser-side audit session persistence using localStorage so form progress and audit state survive page refreshes. Also refined the overall SaaS workflow by connecting audit generation, report saving, and public sharing into a single seamless flow.

What I learned:
Learned how full-stack persistence workflows function using Supabase and PostgreSQL, including insert operations, UUID generation, schema typing, and debugging database-related errors. Explored dynamic routing in the Next.js App Router and understood how URL parameters can be used to render public shareable pages from backend data. Also gained hands-on experience integrating LLM APIs into production-style workflows while handling quota limits, API failures, and fallback responses gracefully. Improved my understanding of browser persistence using localStorage and how SaaS products preserve onboarding progress across sessions.

Blockers / what I'm stuck on:
Spent significant time debugging Supabase Row Level Security (RLS) permissions, schema mismatches, and numeric type conversion issues caused by incorrect database column types. Also faced challenges with Gemini API model compatibility and quota limitations before successfully migrating to a supported model configuration. Still need to implement production-focused polish features such as Open Graph previews, transactional emails, and Credex-specific conditional CTAs.

Day 4 - 10-05-2026

Hours worked: 3-4

What I did:
Focused on production-grade UX and backend workflow improvements for TokenGuard. Implemented dynamic SEO metadata generation using Next.js `generateMetadata()` for public audit report pages, enabling unique browser titles and proper Open Graph/Twitter preview support for each shared report URL. Added adaptive audit result states based on savings thresholds, including high-savings Credex consultation CTAs and honest low-savings optimization messaging. Completed persistent onboarding and audit state storage using localStorage so users can refresh or revisit the app without losing progress. Integrated transactional email delivery using Resend, allowing users to automatically receive their audit report links and savings summaries after saving reports. Connected the full workflow from frontend audit generation → Supabase persistence → public shareable reports → email delivery into a seamless end-to-end SaaS flow.

What I learned:
Learned how dynamic SEO and metadata generation work in the Next.js App Router using server-side `generateMetadata()` functions. Improved my understanding of how Open Graph and Twitter metadata power social sharing previews across platforms like LinkedIn and Twitter. Also explored transactional email architecture using Resend and understood how frontend actions securely communicate with backend API routes to trigger asynchronous workflows like email delivery. Gained deeper insight into adaptive SaaS UX patterns where business logic dynamically changes conversion flows and user messaging based on savings thresholds and user value.

Blockers / what I'm stuck on:
Spent time understanding how metadata generation works separately from visible UI rendering and how social platforms consume metadata from server-rendered HTML. Also had to debug transactional email setup issues related to environment variables and local development email restrictions. The remaining work is now mostly focused on final production polish, documentation files (`README.md`, `PRICING_DATA.md`, `PROMPTS.md`), abuse protection mechanisms, deployment preparation, and optional bonus features like PDF export and benchmark mode.

Day 5 - 11-05-2026

Hours worked: 3

What I did:
Focused on final production-readiness and evaluator-facing documentation for TokenGuard. Implemented lightweight honeypot-based abuse protection to prevent automated spam submissions without introducing user friction through CAPTCHA systems. Created comprehensive engineering documentation including `PRICING_DATA.md`, which documents official vendor pricing sources, audit heuristics, and optimization assumptions used by the recommendation engine. Also completed `PROMPTS.md`, documenting the Gemini integration strategy, prompt engineering decisions, fallback handling logic, and the rationale behind limiting AI usage to executive summary generation instead of financial calculations. Refined overall project structure and finalized major SaaS workflow features before deployment preparation.

What I learned:
Learned how lightweight anti-spam techniques like honeypots work in production SaaS products and why many modern startups prefer them over intrusive CAPTCHA flows. Also gained a better understanding of how important engineering documentation is in communicating architecture decisions, product thinking, and AI usage philosophy to evaluators and collaborators. Explored how deterministic systems and LLM-generated outputs can be combined responsibly by separating critical business logic from presentation-oriented AI features.

Blockers / what I'm stuck on:
The core application is now largely complete, with remaining work focused mostly on deployment, automated testing, CI workflows, architecture documentation, and entrepreneurial evaluation files such as GTM, economics, metrics, and reflection documents. Still need to conduct real user interviews and implement automated audit-engine test coverage before final submission.

Day 6 - 12-05-2026

Hours worked: 5

What I did:
Completed the final production deployment of TokenGuard on Vercel and verified the full end-to-end SaaS workflow in a live environment, including AI audit generation, Supabase persistence, transactional email delivery through Resend, and public shareable report pages. Added dynamic SEO metadata and Open Graph support for audit report sharing. Finalized major evaluator-facing documentation including `ARCHITECTURE.md`, `README.md`, `REFLECTION.md`, `GTM.md`, `ECONOMICS.md`, `LANDING_COPY.md`, and `METRICS.md`. Also documented the system architecture using Mermaid diagrams, detailed the product’s operational reasoning, and clarified the deterministic audit-engine philosophy across all engineering files. Refined landing-page messaging and product positioning to better communicate the infrastructure-finance angle of AI tooling optimization.

What I learned:
Learned how deployment environments differ from local development, especially around environment variables, API integrations, and metadata generation. Improved my understanding of how engineering documentation influences product credibility and evaluator perception beyond just raw implementation quality. Also explored how SaaS positioning, onboarding psychology, and distribution strategy connect tightly with technical product design. Writing GTM and economics documents helped me think more deeply about TokenGuard not only as a software project, but as a lead-generation and operational finance product.

Blockers / what I'm stuck on:
The core platform and documentation are now largely complete. The primary remaining tasks are implementing fully runnable automated audit-engine tests, verifying GitHub Actions CI checks, and conducting real user interviews for the final entrepreneurial evaluation requirements. Additional future improvements would include more sophisticated API usage modeling, benchmarking capabilities, and historical audit tracking for teams with larger AI infrastructure footprints.
