"use client";

import { motion } from "framer-motion";
import { pricingData } from "@/lib/pricing-data";
import { monthlyCost } from "@/lib/audit-engine";
import { Button } from "@/components/ui/button";

interface ReviewStepProps {
  teamSize: number;
  primaryUseCase: string;

  tools: {
    toolId: string;
    planId: string;
    monthlySpend?: number;
    seats: number;
  }[];

  onBack: () => void;
  onGenerate: () => void;
}

export function ReviewStep({
  teamSize,
  primaryUseCase,
  tools,
  onBack,
  onGenerate,
}: ReviewStepProps) {
  const totalMonthlySpend = tools.reduce(
    (acc, tool) =>
      acc + monthlyCost(tool),
    0
  );

  const annualSpend =
    totalMonthlySpend * 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mx-auto max-w-5xl"
    >
      <div className="rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-10 backdrop-blur-2xl">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#F2E9E4]">
            Review your AI stack
          </h2>

          <p className="mt-3 text-[#B8AAA4]">
            TokenGuard is ready to analyze your current AI spending and identify optimization opportunities.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="text-sm text-[#8D817C]">
              Team size
            </div>

            <div className="mt-3 text-3xl font-semibold text-[#F2E9E4]">
              {teamSize}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="text-sm text-[#8D817C]">
              Primary use case
            </div>

            <div className="mt-3 text-2xl font-semibold text-[#F2E9E4]">
              {primaryUseCase}
            </div>
          </div>

          <div className="rounded-2xl border border-[#C9ADA7]/20 bg-[#C9ADA7]/10 p-6">
            <div className="text-sm text-[#8D817C]">
              Monthly AI spend
            </div>

            <div className="mt-3 text-3xl font-semibold text-[#F2E9E4]">
              ${totalMonthlySpend.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-[#F2E9E4]">
            Selected tools
          </h3>

          <div className="mt-6 space-y-4">
            {tools.map((tool, index) => {
              const selectedTool =
                pricingData[
                  tool.toolId as keyof typeof pricingData
                ];

              const selectedPlan =
                selectedTool?.plans.find(
                  (plan) =>
                    plan.id === tool.planId
                );

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-6 md:flex-row md:items-center"
                >
                  <div>
                    <div className="text-lg font-semibold text-[#F2E9E4]">
                      {selectedTool?.name}
                    </div>

                    <div className="mt-1 text-sm text-[#8D817C]">
                      {selectedPlan?.name} • {tool.seats} seats
                    </div>
                  </div>

                  <div className="text-2xl font-semibold text-[#C9ADA7]">
                    ${monthlyCost(tool).toFixed(2)}/mo
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 rounded-2xl border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-8 text-center">
          <div className="text-sm text-[#8D817C]">
            Estimated annual AI spend
          </div>

          <div className="mt-4 text-5xl font-semibold tracking-tight text-[#F2E9E4]">
            ${annualSpend.toFixed(2)}
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-full border-white/10 bg-transparent text-[#F2E9E4] hover:bg-white/10"
          >
            Back
          </Button>

          <Button
            onClick={onGenerate}
            className="rounded-full bg-[#C9ADA7] px-8 py-6 text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#dcc2bc]"
          >
            Generate Audit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
