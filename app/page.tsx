import { Hero } from "@/components/landing/Hero";
import { SocialProofMarquee } from "@/components/landing/SocialProofMarquee";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { CTA } from "@/components/landing/CTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProofMarquee />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <LandingFooter />
    </>
  );
}
