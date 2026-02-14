"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function CTA() {
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 -z-10" />
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-accent text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-text">
          Ready to find your
          <br />
          perfect home?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/signup"
            className="px-8 py-4 bg-primary text-white rounded-full font-medium text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 w-full sm:w-auto flex items-center justify-center"
          >
            Get Started Free
          </Link>
          <Link
            href="#"
            className="px-8 py-4 bg-white text-text border border-text/10 rounded-full font-medium text-lg hover:bg-surface transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Play className="h-6 w-6" />
            Watch Demo
          </Link>
        </div>
        <p className="text-sm text-text/40">No credit card required • Free forever for students</p>
      </div>
    </motion.section>
  );
}
