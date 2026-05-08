"use client";

import { useState } from "react";

import { StepIndicator } from "@/components/audit/step-indicator";
import { TeamProfileStep } from "@/components/audit/team-profile-step";
import { ToolSelectionStep } from "@/components/audit/tool-selection-step";
import { ReviewStep } from "@/components/audit/review-step";
import { generateAudit } from "@/lib/audit-engine";
import { AuditResults } from "@/components/audit/audit-results";

export default function AuditPage() {
  const [currentStep, setCurrentStep] =
    useState(1);

  const [teamSize, setTeamSize] =
    useState(0);

  const [primaryUseCase, setPrimaryUseCase] =
    useState("");
  const [tools, setTools] = useState([
    {
      toolId: "",
      planId: "",
      monthlySpend: 0,
      seats: 1,
    },
  ]);
  const [auditResult, setAuditResult] =
  useState<any>(null);

  return (
    <main className="min-h-screen bg-black text-[#F2E9E4]">
      <div className="mx-auto max-w-5xl px-6 py-32">
        <StepIndicator
          currentStep={currentStep}
        />

        {currentStep === 1 && (
          <TeamProfileStep
            teamSize={teamSize}
            setTeamSize={setTeamSize}
            primaryUseCase={primaryUseCase}
            setPrimaryUseCase={
              setPrimaryUseCase
            }
            onNext={() =>
              setCurrentStep(2)
            }
          />
        )}
        {currentStep === 2 && (
          <ToolSelectionStep
            tools={tools}
            setTools={setTools}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <ReviewStep
            teamSize={teamSize}
            primaryUseCase={primaryUseCase}
            tools={tools}
            onBack={() => setCurrentStep(2)}
            onGenerate={() => {
            const result = generateAudit({
              teamSize,
              primaryUseCase:
                primaryUseCase as any,
              tools,
            });

            setAuditResult(result);

            console.log(result);
          }}
          />
        )}
        {auditResult && (
        <AuditResults result={auditResult} />
      )}
      </div>
    </main>
  );
}