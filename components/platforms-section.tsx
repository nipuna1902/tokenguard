"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const platforms = [
  "Cursor",
  "ChatGPT",
  "Claude",
  "Copilot",
  "Gemini",
  "Notion AI",
  "Midjourney",
  "Perplexity",
];

export function PlatformsSection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-[#9A8C98] backdrop-blur">
            Supported platforms
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-[#F2E9E4] sm:text-5xl">
            Built for the modern AI tooling stack.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#9A8C98]">
            TokenGuard audits public-plan subscriptions, paid accounts, and invoice-backed AI spend across the tools startup teams rely on every day.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
                scale: 1.02,
              }}
            >
              <Card className="flex h-28 items-center justify-center border border-[#C9ADA7]/20 bg-[#C9ADA7]/20 text-lg font-medium text-[#F2E9E4] backdrop-blur-2xl transition-all duration-300 hover:border-[#C9ADA7]/40 hover:bg-[#C9ADA7]/15 hover:shadow-lg hover:shadow-[#C9ADA7]/10">
                {platform}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
