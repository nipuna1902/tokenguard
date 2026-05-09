"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

interface LeadCaptureProps {
  auditResult: any;
  summary: string;
  teamSize: number;
  primaryUseCase: string;
  tools: any[];
}

export function LeadCapture({
  auditResult,
  summary,
  teamSize,
  primaryUseCase,
  tools,
}: LeadCaptureProps) {
  const [email, setEmail] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [role, setRole] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function handleSave() {
    if (!email) return;

    setLoading(true);

    const { error } =
      await supabase
        .from("audit_reports")
        .insert([
          {
            email,
            company,
            role,
            team_size: teamSize,
            primary_use_case:
              primaryUseCase,
            tools,
            monthly_spend:
              auditResult.totalMonthlySpend,
            monthly_savings:
              auditResult.estimatedMonthlySavings,
            annual_spend:
              auditResult.estimatedAnnualSpend,
            ai_summary: summary,
          },
        ]);

    setLoading(false);

    if (!error) {
      setSuccess(true);
    } else {
      console.error(error);
    }
  }

  return (
    <div className="mt-16 rounded-[2rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-10 backdrop-blur-2xl">
      <h2 className="text-3xl font-semibold text-[#F2E9E4]">
        Save your audit report
      </h2>

      <p className="mt-4 max-w-2xl text-[#B8AAA4]">
        Get a shareable audit link and receive future optimization insights as AI tooling pricing changes.
      </p>

      {success ? (
        <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-green-200">
          Your audit report was saved successfully.
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="h-14 rounded-2xl border border-white/10 bg-black/30 px-5 text-[#F2E9E4] outline-none"
          />

          <input
            type="text"
            placeholder="Company name (optional)"
            value={company}
            onChange={(e) =>
              setCompany(e.target.value)
            }
            className="h-14 rounded-2xl border border-white/10 bg-black/30 px-5 text-[#F2E9E4] outline-none"
          />

          <input
            type="text"
            placeholder="Role (optional)"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="h-14 rounded-2xl border border-white/10 bg-black/30 px-5 text-[#F2E9E4] outline-none"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-4 h-14 rounded-full bg-[#C9ADA7] text-black transition-all duration-300 hover:bg-[#dcc2bc]"
          >
            {loading
              ? "Saving..."
              : "Save Audit Report"}
          </button>
        </div>
      )}
    </div>
  );
}