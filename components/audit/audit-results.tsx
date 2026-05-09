"use client";

import { motion } from "framer-motion";
import { AuditResult } from "@/types/audit";

interface AuditResultsProps {
  result: AuditResult;

  summary: string;

  onReset: () => void;
}

const severityStyles = {
  low: "border-yellow-500/20 bg-yellow-500/5 text-yellow-200",

  medium:
    "border-orange-500/20 bg-orange-500/5 text-orange-200",

  high: "border-red-500/20 bg-red-500/5 text-red-200",
};

export function AuditResults({
  result,
  summary,
  onReset,
}: AuditResultsProps) {
  const efficiencyScore = Math.max(
    100 -
      result.recommendations.length *
        8,
    52
  );

  const annualSavings =
    result.estimatedMonthlySavings *
    12;

  const highSavings =
    result.estimatedMonthlySavings >=
    500;

  const lowSavings =
    result.estimatedMonthlySavings <
    100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="mx-auto max-w-6xl"
    >
      <div className="text-center">
        <div className="inline-flex rounded-full border border-[#C9ADA7]/15 bg-[#C9ADA7]/5 px-5 py-2 text-sm text-[#C9ADA7]">
          Audit complete
        </div>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-[#F2E9E4] sm:text-6xl">
          Your AI spend analysis
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#B8AAA4]">
          TokenGuard analyzed your AI tooling stack and identified optimization opportunities based on pricing efficiency, seat allocation, and workflow overlap.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-[#C9ADA7]/5 p-8 backdrop-blur-2xl">
          <div className="text-sm text-[#8D817C]">
            Monthly spend
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#F2E9E4]">
            ${result.totalMonthlySpend}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#C9ADA7]/5 p-8 backdrop-blur-2xl">
          <div className="text-sm text-[#8D817C]">
            Annual spend
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#F2E9E4]">
            ${result.estimatedAnnualSpend}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#C9ADA7]/20 bg-[#C9ADA7]/10 p-8 backdrop-blur-2xl">
          <div className="text-sm text-[#8D817C]">
            Potential monthly savings
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#C9ADA7]">
            ${result.estimatedMonthlySavings}
          </div>

          <div className="mt-3 text-sm text-[#B8AAA4]">
            ≈ ${annualSavings}/year
          </div>
        </div>
      </div>
      <div className="mt-10 rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-10 text-center backdrop-blur-2xl">
        <div className="text-sm text-[#8D817C]">
          Stack efficiency score
        </div>

        <div className="mt-5 text-7xl font-semibold tracking-tight text-[#F2E9E4]">
          {efficiencyScore}%
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-[#B8AAA4]">
          Your AI tooling stack appears moderately optimized, though several cost-reduction opportunities were identified.
        </p>
      </div>
      <div className="mt-10 rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-10 backdrop-blur-2xl">
        <div className="text-sm text-[#8D817C]">
          AI-generated executive summary
        </div>

        <p className="mt-5 text-lg leading-8 text-[#F2E9E4]">
          {summary}
        </p>
      </div>
      {highSavings && (
        <div className="mt-10 rounded-[2rem] border border-[#C9ADA7]/20 bg-[#C9ADA7]/10 p-10 text-center backdrop-blur-2xl">
          <div className="text-sm uppercase tracking-wide text-[#C9ADA7]">
            High-impact optimization opportunity
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-[#F2E9E4]">
            Your team could potentially save over $
            {result.estimatedMonthlySavings}
            /month
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#B8AAA4]">
            Teams with high AI infrastructure spend often uncover additional savings through centralized procurement, credit optimization, and vendor consolidation strategies.
          </p>

          <button className="mt-8 rounded-full bg-[#C9ADA7] px-8 py-4 text-black transition-all duration-300 hover:scale-[1.02] hover:bg-[#dcc2bc]">
            Book Credex Consultation
          </button>
        </div>
      )}
      {lowSavings && (
        <div className="mt-10 rounded-[2rem] border border-green-500/20 bg-green-500/5 p-10 text-center backdrop-blur-2xl">
          <div className="text-sm uppercase tracking-wide text-green-300">
            Efficient stack detected
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-[#F2E9E4]">
            Your AI spend already appears relatively optimized
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#B8AAA4]">
            TokenGuard identified limited immediate savings opportunities based on your current tooling allocation and pricing structure.
          </p>

          <button className="mt-8 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-[#F2E9E4] transition-all duration-300 hover:bg-white/10">
            Notify Me About Future Optimizations
          </button>
        </div>
      )}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold tracking-tight text-[#F2E9E4]">
          Optimization recommendations
        </h2>

        <div className="mt-8 space-y-5">
          {result.recommendations.map(
            (recommendation, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className={`rounded-[2rem] border p-7 backdrop-blur-2xl ${
                  severityStyles[
                    recommendation.severity
                  ]
                }`}
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div>
                    <div className="text-sm uppercase tracking-wide opacity-70">
                      {recommendation.severity} priority
                    </div>

                    <h3 className="mt-3 text-2xl font-semibold">
                      {recommendation.title}
                    </h3>

                    <p className="mt-4 max-w-3xl leading-8 opacity-80">
                      {
                        recommendation.description
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-center">
                    <div className="text-xs uppercase tracking-wide text-[#8D817C]">
                      Estimated savings
                    </div>

                    <div className="mt-2 text-3xl font-semibold text-[#F2E9E4]">
                      $
                      {
                        recommendation.estimatedSavings
                      }
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <button
          onClick={onReset}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-[#F2E9E4] transition-all duration-300 hover:bg-white/10"
        >
          Start New Audit
        </button>
      </div>
    </motion.div>
  );
}