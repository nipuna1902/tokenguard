"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed left-0 top-0 z-50 w-full"
    >
      <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between px-6">
        <div className="flex w-full items-center justify-between rounded-full border border-[#C9ADA7]/10 bg-black/30 px-6 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#C9ADA7]" />

            <span className="text-lg font-semibold tracking-tight text-[#F2E9E4]">
              TokenGuard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button className="rounded-full bg-[#C9ADA7] px-5 text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#dcc2bc] hover:shadow-lg hover:shadow-[#C9ADA7]/10">
              Start Free Audit
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}