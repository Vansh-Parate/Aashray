"use client";

import { motion } from "framer-motion";
import { Search, Users, ShieldCheck, Key } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const steps = [
  {
    icon: Search,
    title: "Browse Listings",
    desc: "Explore verified student accommodations.",
    num: "01",
    accent: "primary",
  },
  {
    icon: Users,
    title: "Match Roommates",
    desc: "Find compatible people to share space.",
    num: "02",
    accent: "primary",
  },
  {
    icon: ShieldCheck,
    title: "Verify Safety",
    desc: "Check safety scores and amenities.",
    num: "03",
    accent: "sage",
  },
  {
    icon: Key,
    title: "Move In",
    desc: "Seamless paperwork and process.",
    num: "04",
    accent: "primary",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section id="how-it-works" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="font-accent text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text">
            Get started in minutes
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="hidden md:block absolute top-16 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 rounded-full bg-surface mb-6 flex items-center justify-center relative z-10 group cursor-default">
                  <div className="absolute inset-0 rounded-full border border-primary/20 scale-100 group-hover:scale-110 transition-transform duration-500" />
                  <Icon
                    className={`h-10 w-10 group-hover:scale-110 transition-transform ${
                      step.accent === "sage" ? "text-sage" : "text-primary"
                    }`}
                  />
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-4 border-background ${
                      step.accent === "sage" ? "bg-sage text-white" : "bg-primary text-white"
                    }`}
                  >
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text">{step.title}</h3>
                <p className="text-text/60 text-sm">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
