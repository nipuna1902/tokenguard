interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  "Team Profile",
  "AI Tools",
  "Review",
];

export function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="mb-14 flex items-center justify-center gap-4">
      {steps.map((step, index) => {
        const active = currentStep === index + 1;

        return (
          <div
            key={step}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300 ${
                  active
                    ? "border-[#C9ADA7] bg-[#C9ADA7] text-black"
                    : "border-white/10 bg-white/5 text-[#8D817C]"
                }`}
              >
                {index + 1}
              </div>

              <span
                className={`hidden text-sm sm:block ${
                  active
                    ? "text-[#F2E9E4]"
                    : "text-[#8D817C]"
                }`}
              >
                {step}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div className="h-px w-10 bg-white/10" />
            )}
          </div>
        );
      })}
    </div>
  );
}