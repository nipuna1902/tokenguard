"use client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Connect Your AI Stack",
    description:
      "Enter the tools, plans, API usage, and team size your company currently pays for. We securely calculate your current AI spending patterns.",
    number: "01",
  },
  {
    title: "Get an Instant Audit",
    description:
      "TokenGuard analyzes your subscriptions and identifies unnecessary spend, downgrade opportunities, and cheaper alternatives.",
    number: "02",
  },
  {
    title: "Reduce Monthly Burn",
    description:
      "Receive actionable recommendations with projected monthly and annual savings tailored to your team's workflow.",
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-[#9A8C98] backdrop-blur">
            How it works
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-[#F2E9E4] sm:text-5xl">
            Optimize AI spending without the guesswork.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#9A8C98]">
            TokenGuard helps startup teams uncover hidden inefficiencies across AI subscriptions, seats, and API usage in just a few minutes.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {steps.map((step,index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
              }}
            >
            <Card
              key={step.number}
              className="border border-[#C9ADA7]/15 bg-[#C9ADA7]/5 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-[#C9ADA7]/30 hover:bg-[#C9ADA7]/10 hover:shadow-xl hover:shadow-[#C9ADA7]/5"
            >
              <div className="text-sm font-medium text-[#C9ADA7]">
                {step.number}
              </div>

              <h3 className="mt-4 text-2xl font-semibold text-[#F2E9E4]">
                {step.title}
              </h3>

              <p className="mt-4 leading-7 text-[#9A8C98]">
                {step.description}
              </p>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}