import { Button } from "@/components/ui/button";
import { FadeIn } from "./fade-in";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28">
      <div className="absolute inset-0">
      <div className="absolute left-1/2 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#C9ADA7]/12 blur-[140px]" />

      <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-[#4A4E69]/30 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,173,167,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <FadeIn delay={0.1}>
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-[#9A8C98] backdrop-blur">
          AI spend audits for startup teams
        </div>
      </FadeIn>
        <FadeIn delay={0.2}>
        <h1 className="text-5xl font-semibold leading-tight tracking-tight text-[#F2E9E4] sm:text-7xl">
          Stop overpaying for your AI stack.
        </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#9A8C98]">
          TokenGuard analyzes your AI subscriptions, APIs, and team usage to uncover hidden savings opportunities in minutes.
        </p>
        </FadeIn>
        <FadeIn delay={0.4}>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full bg-[#C9ADA7] px-8 text-[#22223B] hover:bg-[#dcc2bc] hover:scale-[1.02] transition-all duration-300"
          >
            Run Free Audit
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-white/10 bg-transparent px-8 text-[#F2E9E4] hover:bg-white/10"
          >
            View Example Report
          </Button>
        </div>
        </FadeIn>
        <FadeIn delay={0.5}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4 text-sm text-[#9A8C98]">
          <span>Cursor</span>
          <span>•</span>
          <span>ChatGPT</span>
          <span>•</span>
          <span>Claude</span>
          <span>•</span>
          <span>Copilot</span>
          <span>•</span>
          <span>Gemini</span>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}