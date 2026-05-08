"use client";

import { motion } from "framer-motion";
import { AuditResult } from "@/types/audit";

interface AuditResultsProps {
  result: AuditResult;
}

const severityStyles = {
  low: "border-yellow-500/20 bg-yellow-500/5 text-yellow-200",

  medium:
    "border-orange-500/20 bg-orange-500/5 text-orange-200",

  high: "border-red-500/20 bg-red-500/5 text-red-200",
};

export function AuditResults({
  result,
}: AuditResultsProps) {
  const efficiencyScore = Math.max(
    100 -
      result.recommendations.length *
        8,
    52
  );

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
          TokenGuard analyzed your current AI tooling stack and identified several opportunities to optimize spending and reduce operational waste.
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
            Annual projection
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
    </motion.div>
  );
}