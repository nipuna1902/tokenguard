"use client";

import { motion } from "framer-motion";
import { pricingData } from "@/lib/pricing-data";
import { Button } from "@/components/ui/button";

interface ToolSelectionStepProps {
  tools: {
    toolId: string;
    planId: string;
    monthlySpend: number;
    seats: number;
  }[];

  setTools: React.Dispatch<
    React.SetStateAction<
      {
        toolId: string;
        planId: string;
        monthlySpend: number;
        seats: number;
      }[]
    >
  >;

  onNext: () => void;
  onBack: () => void;
}

export function ToolSelectionStep({
  tools,
  setTools,
  onNext,
  onBack,
}: ToolSelectionStepProps) {
  const addTool = () => {
    setTools([
      ...tools,
      {
        toolId: "",
        planId: "",
        monthlySpend: 0,
        seats: 1,
      },
    ]);
  };

  const removeTool = (index: number) => {
    setTools(
      tools.filter((_, i) => i !== index)
    );
  };

  const updateTool = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTools = [...tools];

    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value,
    };

    setTools(updatedTools);
  };

  const isFormValid = tools.every(
    (tool) =>
      tool.toolId &&
      tool.planId &&
      tool.monthlySpend > 0 &&
      tool.seats > 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mx-auto max-w-4xl"
    >
      <div className="rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-10 backdrop-blur-2xl">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#F2E9E4]">
            Add your AI tools
          </h2>

          <p className="mt-3 text-[#B8AAA4]">
            Select the tools your team currently uses and estimate your monthly spending.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {tools.map((tool, index) => {
            const selectedTool =
              pricingData[
                tool.toolId as keyof typeof pricingData
              ];

            return (
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
                className="rounded-2xl border border-white/10 bg-black/20 p-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[#C9ADA7]">
                      Tool
                    </label>

                    <select
                      value={tool.toolId}
                      onChange={(e) =>
                        updateTool(
                          index,
                          "toolId",
                          e.target.value
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-[#F2E9E4] outline-none transition-all duration-300 focus:border-[#C9ADA7]/40"
                    >
                      <option value="">
                        Select tool
                      </option>

                      {Object.entries(
                        pricingData
                      ).map(([key, value]) => (
                        <option
                          key={key}
                          value={key}
                        >
                          {value.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#C9ADA7]">
                      Plan
                    </label>

                    <select
                      value={tool.planId}
                      onChange={(e) =>
                        updateTool(
                          index,
                          "planId",
                          e.target.value
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-[#F2E9E4] outline-none transition-all duration-300 focus:border-[#C9ADA7]/40"
                    >
                      <option value="">
                        Select plan
                      </option>

                      {selectedTool?.plans.map(
                        (plan) => (
                          <option
                            key={plan.id}
                            value={plan.id}
                          >
                            {plan.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#C9ADA7]">
                      Monthly spend ($)
                    </label>

                    <input
                      type="number"
                      value={
                        tool.monthlySpend || ""
                      }
                      onChange={(e) =>
                        updateTool(
                          index,
                          "monthlySpend",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-[#F2E9E4] outline-none transition-all duration-300 focus:border-[#C9ADA7]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#C9ADA7]">
                      Seats
                    </label>

                    <input
                      type="number"
                      value={tool.seats}
                      onChange={(e) =>
                        updateTool(
                          index,
                          "seats",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-[#F2E9E4] outline-none transition-all duration-300 focus:border-[#C9ADA7]/40"
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeTool(index)
                  }
                  className="mt-5 text-sm text-[#B8AAA4] transition-colors hover:text-red-400"
                >
                  Remove tool
                </button>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8">
          <Button
            onClick={addTool}
            variant="outline"
            className="rounded-full border-white/10 bg-transparent text-[#F2E9E4] hover:bg-white/10"
          >
            Add Tool
          </Button>
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
            onClick={onNext}
            disabled={!isFormValid}
            className="rounded-full bg-[#C9ADA7] px-7 py-6 text-black transition-all duration-300 hover:bg-[#dcc2bc] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </Button>
        </div>

        {!isFormValid && (
          <p className="mt-5 text-sm text-[#8D817C]">
            Please complete all fields before continuing.
          </p>
        )}
      </div>
    </motion.div>
  );
}