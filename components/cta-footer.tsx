"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTAFooter() {
  return (
    <section className="relative overflow-hidden py-40">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9ADA7]/6 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 mx-auto max-w-6xl px-6"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#C9ADA7]/10 bg-[#C9ADA7]/5 p-16 text-center backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,173,167,0.08),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "url('https://grainy-gradients.vercel.app/noise.svg')",
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center rounded-full border border-[#C9ADA7]/15 bg-[#C9ADA7]/5 px-5 py-2 text-sm text-[#C9ADA7] backdrop-blur-xl">
              Optimize your AI spend intelligently
            </div>

            <h2 className="mx-auto max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-[#F2E9E4] sm:text-6xl">
              Your AI stack shouldn’t silently drain your runway.
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#B8AAA4]">
              TokenGuard helps modern startup teams uncover unnecessary AI expenses, optimize subscriptions, and identify smarter infrastructure decisions before costs spiral.
            </p>

            <div className="mt-12">
              <Link href="/audit">
                <Button className="rounded-full bg-[#C9ADA7] px-9 py-7 text-base font-medium text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#dcc2bc] hover:shadow-2xl hover:shadow-[#C9ADA7]/10">
                  Start Your Free Audit
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-[#8D817C]">
              No login required • Results in under 2 minutes
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}