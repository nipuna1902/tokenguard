import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { PlatformsSection } from "@/components/platforms-section";
import { BackgroundEffects } from "@/components/background-effects";
import { CTAFooter } from "@/components/cta-footer";

export default function Home() {
  return (
    // <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#151526] to-[#22223B] text-[#F2E9E4]">
    <main className="relative min-h-screen overflow-hidden bg-black text-[#F2E9E4]">
      <BackgroundEffects />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <PlatformsSection />
        <HowItWorks />
        <CTAFooter />
      </div>
    </main>
  );
}