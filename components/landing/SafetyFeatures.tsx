"use client";

import { motion } from "framer-motion";
import { Shield, Camera, KeyRound, Wifi } from "lucide-react";

const safetyItems = [
  { label: "CCTV Surveillance", icon: Camera, weight: "30 pts" },
  { label: "24/7 Security Guard", icon: Shield, weight: "30 pts" },
  { label: "Biometric Access", icon: KeyRound, weight: "25 pts" },
  { label: "WiFi & facilities", icon: Wifi, weight: "15 pts" },
];

export function SafetyFeatures() {
  return (
    <section className="py-24 bg-surface/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-accent text-3xl font-bold text-text-primary sm:text-4xl">
            Safety score breakdown
          </h2>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
            Listings are scored 0–100 based on verified safety amenities.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto rounded-3xl border border-surface-dark bg-background p-8 shadow-soft"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative h-32 w-32 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--surface-dark)"
                  strokeWidth="2"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--safety-high)"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                  initial={{ strokeDashoffset: 100 }}
                  whileInView={{ strokeDashoffset: 25 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">75+</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {safetyItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium text-text-primary">{item.label}</span>
                    </div>
                    <span className="text-sm text-text-muted">{item.weight}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
