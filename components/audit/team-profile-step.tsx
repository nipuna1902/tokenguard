"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TeamProfileStepProps {
  teamSize: number;
  setTeamSize: (value: number) => void;

  primaryUseCase: string;
  setPrimaryUseCase: (value: string) => void;

  onNext: () => void;
}

const useCases = [
  "Coding",
  "Writing",
  "Research",
  "Data Analysis",
  "Mixed Workloads",
];

export function TeamProfileStep({
  teamSize,
  setTeamSize,
  primaryUseCase,
  setPrimaryUseCase,
  onNext,
}: TeamProfileStepProps) {
  const isFormValid =
    teamSize > 0 &&
    primaryUseCase.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mx-auto max-w-3xl"
    >
      <div className="rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-10 backdrop-blur-2xl">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#F2E9E4]">
            Tell us about your team
          </h2>

          <p className="mt-3 text-[#B8AAA4]">
            TokenGuard uses your team profile to generate more accurate AI spend recommendations.
          </p>
        </div>
        <div className="mt-10">
          <label className="mb-3 block text-sm text-[#C9ADA7]">
            Team size
          </label>

          <input
            type="number"
            value={teamSize || ""}
            onChange={(e) =>
              setTeamSize(Number(e.target.value))
            }
            placeholder="e.g. 12"
            className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-5 text-[#F2E9E4] outline-none transition-all duration-300 placeholder:text-[#6F6763] focus:border-[#C9ADA7]/40 focus:bg-black/50"
          />
        </div>
        <div className="mt-10">
          <label className="mb-4 block text-sm text-[#C9ADA7]">
            Primary use case
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((useCase) => {
              const active =
                primaryUseCase === useCase;

              return (
                <button
                  key={useCase}
                  type="button"
                  onClick={() =>
                    setPrimaryUseCase(useCase)
                  }
                  className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                    active
                      ? "border-[#C9ADA7]/40 bg-[#C9ADA7]/10 text-[#F2E9E4]"
                      : "border-white/10 bg-black/20 text-[#8D817C] hover:border-[#C9ADA7]/20 hover:bg-[#C9ADA7]/5"
                  }`}
                >
                  {useCase}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-12 flex justify-end">
          <Button
            onClick={onNext}
            disabled={!isFormValid}
            className="rounded-full bg-[#C9ADA7] px-7 py-6 text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#dcc2bc] disabled:cursor-not-allowed disabled:opacity-40"
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