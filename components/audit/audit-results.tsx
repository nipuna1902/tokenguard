"use client";

import { motion } from "framer-motion";
import { AuditResult, AuditToolInput } from "@/types/audit";
import { LeadCapture } from "./lead-capture";
import { pricingData } from "@/lib/pricing-data";

interface AuditResultsProps {
  result: AuditResult;

  summary: string;

  onReset: () => void;

  teamSize: number;

  primaryUseCase: string;

  tools: AuditToolInput[];
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
  teamSize,
  primaryUseCase,
  tools
}: AuditResultsProps) {
  const annualSavings =
    result.estimatedMonthlySavings *
    12;

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
          Recommendations are based on the plan prices shown below and the invoice totals you supplied. We only total savings that can be checked from seat counts; usage and contract changes are clearly marked for review.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-[#C9ADA7]/5 p-8 backdrop-blur-2xl">
          <div className="text-sm text-[#8D817C]">
            Monthly spend
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#F2E9E4]">
            ${result.totalMonthlySpend.toFixed(2)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#C9ADA7]/5 p-8 backdrop-blur-2xl">
          <div className="text-sm text-[#8D817C]">
            Annual spend
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#F2E9E4]">
            ${result.estimatedAnnualSpend.toFixed(2)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#C9ADA7]/20 bg-[#C9ADA7]/10 p-8 backdrop-blur-2xl">
          <div className="text-sm text-[#8D817C]">
            Verified monthly savings
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#C9ADA7]">
            ${result.estimatedMonthlySavings.toFixed(2)}
          </div>

          <div className="mt-3 text-sm text-[#B8AAA4]">
            ≈ ${annualSavings.toFixed(2)}/year
          </div>
        </div>
      </div>
      <div className="mt-10 rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-8 text-center backdrop-blur-2xl">
        <div className="text-sm text-[#8D817C]">
          Reviewable opportunity (not included above)
        </div>

        <div className="mt-4 text-5xl font-semibold tracking-tight text-[#F2E9E4]">
          ${result.reviewableMonthlySavings.toFixed(2)}/mo
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-[#B8AAA4]">
          These are plausible savings that require contract, feature, or utilization validation before action. They are never added to the verified total.
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
                      {recommendation.severity} priority · {recommendation.confidence === "verified" ? "counted saving" : "requires review"}
                    </div>

                    <h3 className="mt-3 text-2xl font-semibold">
                      {recommendation.title}
                    </h3>

                    <p className="mt-4 max-w-3xl leading-8 opacity-80">
                      {
                        recommendation.description
                      }
                    </p>
                    <p className="mt-4 max-w-3xl text-sm leading-6 opacity-90"><span className="font-semibold">Next step:</span> {recommendation.action}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-center">
                    <div className="text-xs uppercase tracking-wide text-[#8D817C]">
                      Estimated savings
                    </div>

                    <div className="mt-2 text-3xl font-semibold text-[#F2E9E4]">
                      ${recommendation.estimatedSavings.toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
      <div className="mt-12 rounded-[2rem] border border-white/10 bg-black/20 p-7 text-sm text-[#B8AAA4]">
        <p className="font-medium text-[#F2E9E4]">Price sources & scope</p>
        <p className="mt-2 leading-6">Public USD list prices last reviewed July 21, 2026. Taxes, regional pricing, credits, negotiated contracts, and API token billing are excluded unless included in your invoice subtotal.</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{Object.values(pricingData).map((tool) => <a key={tool.name} href={tool.website} target="_blank" rel="noreferrer" className="text-[#C9ADA7] underline underline-offset-4">{tool.sourceLabel} ↗</a>)}</div>
      </div>
      <LeadCapture
          auditResult={result}
          summary={summary}
          teamSize={teamSize}
          primaryUseCase={
            primaryUseCase
          }
          tools={tools}
        />
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
