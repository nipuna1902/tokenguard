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
