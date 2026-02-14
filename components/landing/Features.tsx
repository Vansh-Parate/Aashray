"use client";

import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Users, Camera, Receipt, LayoutGrid } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Safety scores", description: "Every listing has a 0-100 safety score based on CCTV, guards, and biometrics." },
  { icon: MapPin, title: "Map discovery", description: "Find places by location with filters for price, gender, and amenities." },
  { icon: Users, title: "Roommate matcher", description: "Swipe and match with roommates based on habits and preferences." },
  { icon: Camera, title: "Virtual tours", description: "Browse photo galleries and get a feel for the space before visiting." },
  { icon: Receipt, title: "Rent tracker", description: "Wardens track rent and mark payments; students get instant notifications." },
  { icon: LayoutGrid, title: "Occupancy grid", description: "Visual bed-by-bed status: empty, occupied, or reserved." },
];

export function Features() {
  return (
    <section className="py-24 bg-surface/50">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-accent text-3xl font-bold text-text-primary sm:text-4xl">Why AASHRAY?</h2>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto">We combine safety verification, discovery, and management in one platform.</p>
        </motion.div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-surface-dark bg-background p-6 shadow-soft"
            >
              <Icon className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{f.description}</p>
            </motion.div>
          );
          })}
        </div>
      </div>
    </section>
  );
}
