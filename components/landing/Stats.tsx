"use client";

import { motion } from "framer-motion";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const stats = [
  { value: "10k+", label: "Happy Students" },
  { value: "4.9", label: "Average Rating" },
  { value: "100%", label: "Verified Listings" },
];

export function Stats() {
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section ref={ref} className="py-8 sm:py-12 md:py-20 border-y border-text/5 bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-text/5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center py-3 sm:py-4"
          >
            <div className="text-4xl sm:text-5xl font-semibold text-text mb-2 tracking-tighter">
              {stat.value}
            </div>
            <div className="text-text/50 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
