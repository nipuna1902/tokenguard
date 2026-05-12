# TokenGuard

TokenGuard is an AI infrastructure cost optimization platform that helps startups and engineering teams audit their AI tooling spend. Users can input the AI products they currently pay for, receive an instant optimization audit with savings recommendations, generate AI-powered executive summaries, and share public audit reports through unique URLs.

The platform is designed for founders, engineering teams, and operations leaders who want better visibility into AI tooling costs, plan inefficiencies, and redundant subscriptions without requiring login or onboarding friction.

---

# Live Demo

Deployed URL:
tokenguard-xi.vercel.app

---

# Screenshots

## Landing & Team Profiling

[Add Screenshot Here]

## AI Spend Audit Results

[Add Screenshot Here]

## Public Shareable Report

[Add Screenshot Here]

Optional screen recording:
[Add Loom or YouTube Link Here]

---

# Features

- Multi-step AI tooling audit onboarding
- Dynamic AI spend optimization engine
- Per-tool savings recommendations
- Monthly and annual savings projections
- AI-generated executive summaries using Gemini
- Public shareable audit reports
- Dynamic SEO metadata and Open Graph previews
- Transactional email delivery using Resend
- Persistent onboarding state with localStorage
- Adaptive SaaS UX with conditional CTAs
- Honeypot-based abuse protection
- Supabase backend persistence
- Responsive modern UI built with Next.js and Tailwind CSS

---

# Product Workflow

```txt
Visitor lands on TokenGuard
↓
Inputs AI tooling stack and spend
↓
Audit engine evaluates pricing inefficiencies
↓
AI-generated executive summary is created
↓
User saves report
↓
Supabase stores audit
↓
Public shareable URL generated
↓
Transactional email sent through Resend
```

---

# Tech Stack

## Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend

- Next.js API Routes
- Supabase (PostgreSQL)

## AI

- Google Gemini API
- gemini-2.5-flash

## Infrastructure

- Resend (transactional email)
- Vercel (deployment)

---

# AI Usage Philosophy

TokenGuard intentionally avoids using AI for financial calculations or pricing optimization logic.

The audit engine uses deterministic business heuristics for:

- pricing recommendations,
- savings estimation,
- plan-fit analysis,
- seat optimization,
- tooling overlap detection.

LLMs are used only for generating concise executive summaries in order to:

- improve readability,
- preserve deterministic audit behavior,
- reduce hallucination risk,
- maintain financial defensibility.

---

# Quick Start

## 1. Clone Repository

```bash
git clone <your-repository-url>
cd tokenguard
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GEMINI_API_KEY=your_gemini_api_key

RESEND_API_KEY=your_resend_api_key
```

---

## 4. Run Locally

```bash
npm run dev
```

Application runs on:

```txt
http://localhost:3000
```

---

# Deployment

The application is designed for deployment on Vercel.

## Deploy

```bash
vercel
```

or connect the GitHub repository directly through the Vercel dashboard.

---

# Database Schema

Main table:

```txt
audit_reports
```

Stores:

- audit inputs
- AI summaries
- optimization results
- public report IDs
- lead capture metadata

---

# Abuse Protection

TokenGuard uses a lightweight honeypot anti-spam technique to block automated bot submissions without impacting user experience.

A hidden input field is added to the form:

- real users never interact with it,
- bots often auto-fill hidden fields,
- submissions are blocked if the hidden field contains a value.

---

# Decisions & Trade-Offs

## 1. Deterministic Audit Engine Instead of AI-Based Financial Recommendations

I intentionally avoided using LLMs for pricing calculations or optimization logic. Deterministic heuristics provide more explainable, predictable, and financially defensible recommendations while avoiding hallucination risks.

---

## 2. Supabase Instead of Custom Express Backend

Supabase significantly accelerated backend development by providing hosted PostgreSQL, instant APIs, authentication-ready infrastructure, and simpler deployment compared to managing a custom Node.js backend.

---

## 3. Gemini Instead of OpenAI API

Gemini was selected because it provided accessible free-tier experimentation during development while still supporting high-quality summary generation for audit reports.

---

## 4. Honeypot Instead of CAPTCHA

A honeypot anti-spam approach was chosen to minimize friction and preserve conversion rates. CAPTCHA systems add unnecessary UX friction for a lightweight MVP.

---

## 5. Public Shareable Reports Without Authentication

The product intentionally removes login requirements to maximize virality, reduce onboarding friction, and encourage easy sharing of audit reports across social platforms and communities.

---

# Future Improvements

- PDF export for audit reports
- Benchmark mode for spend-per-developer comparisons
- Referral system for viral growth
- Calendly integration for Credex consultations
- Real-time vendor pricing synchronization
- Advanced analytics dashboards
- Team collaboration support

---

# Engineering Notes

- Form state persists across browser refreshes using localStorage.
- Dynamic Open Graph metadata is generated per report using Next.js `generateMetadata()`.
- Transactional emails are triggered server-side through Next.js API routes.
- Public reports intentionally strip sensitive identifying information such as email and company name.

---

# Pricing & Prompt Documentation

Additional engineering documentation:

- `PRICING_DATA.md`
- `PROMPTS.md`

---

# License

MIT License
