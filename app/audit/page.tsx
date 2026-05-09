"use client";

import { useEffect, useState } from "react";

import { StepIndicator } from "@/components/audit/step-indicator";
import { TeamProfileStep } from "@/components/audit/team-profile-step";
import { ToolSelectionStep } from "@/components/audit/tool-selection-step";
import { ReviewStep } from "@/components/audit/review-step";
import { AuditResults } from "@/components/audit/audit-results";

import { generateAudit } from "@/lib/audit-engine";

const STORAGE_KEY =
  "tokenguard-audit-session";

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
  const [aiSummary, setAiSummary] =
  useState("");
  useEffect(() => {
    const savedSession =
      localStorage.getItem(STORAGE_KEY);

    if (!savedSession) return;

    const parsed =
      JSON.parse(savedSession);

    setCurrentStep(
      parsed.currentStep || 1
    );

    setTeamSize(
      parsed.teamSize || 0
    );

    setPrimaryUseCase(
      parsed.primaryUseCase || ""
    );

    setTools(
      parsed.tools || [
        {
          toolId: "",
          planId: "",
          monthlySpend: 0,
          seats: 1,
        },
      ]
    );

    setAuditResult(
      parsed.auditResult || null
    );
  }, []);
  useEffect(() => {
    const sessionData = {
      currentStep,
      teamSize,
      primaryUseCase,
      tools,
      auditResult,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sessionData)
    );
  }, [
    currentStep,
    teamSize,
    primaryUseCase,
    tools,
    auditResult,
  ]);
  const resetSession = () => {
    localStorage.removeItem(
      STORAGE_KEY
    );

    setCurrentStep(1);

    setTeamSize(0);

    setPrimaryUseCase("");

    setTools([
      {
        toolId: "",
        planId: "",
        monthlySpend: 0,
        seats: 1,
      },
    ]);

    setAuditResult(null);
  };

  return (
    <main className="min-h-screen bg-black text-[#F2E9E4]">
      <div className="mx-auto max-w-5xl px-6 py-32">
        {!auditResult && (
          <>
            <StepIndicator
              currentStep={currentStep}
            />

            {currentStep === 1 && (
              <TeamProfileStep
                teamSize={teamSize}
                setTeamSize={setTeamSize}
                primaryUseCase={
                  primaryUseCase
                }
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
                onNext={() =>
                  setCurrentStep(3)
                }
                onBack={() =>
                  setCurrentStep(1)
                }
              />
            )}

            {currentStep === 3 && (
              <ReviewStep
                teamSize={teamSize}
                primaryUseCase={
                  primaryUseCase
                }
                tools={tools}
                onBack={() =>
                  setCurrentStep(2)
                }
                onGenerate={async () => {
                const result = generateAudit({
                  teamSize,
                  primaryUseCase:
                    primaryUseCase as any,
                  tools,
                });

                setAuditResult(result);

                try {
                  const response = await fetch(
                    "/api/generate-summary",
                    {
                      method: "POST",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body: JSON.stringify({
                        teamSize,
                        primaryUseCase,
                        auditResult: result,
                      }),
                    }
                  );

                  const data =
                    await response.json();

                  setAiSummary(data.summary);
                } catch (error) {
                  console.error(error);
                }
              }}
              />
            )}
          </>
        )}

        {auditResult && (
          <AuditResults
            result={auditResult}
            summary={aiSummary}
            onReset={resetSession}
          />
        )}
      </div>
    </main>
  );
}