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
