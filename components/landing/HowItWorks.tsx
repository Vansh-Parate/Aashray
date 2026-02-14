"use client";

import { motion } from "framer-motion";
import { Search, FileCheck, Home, BarChart3 } from "lucide-react";

const studentSteps = [
  { icon: Search, title: "Sign up and set preferences", desc: "Create an account and tell us your budget and location." },
  { icon: Home, title: "Discover and compare", desc: "Browse safety-scored listings on the map and save favorites." },
  { icon: FileCheck, title: "Book and move in", desc: "Confirm your bed and get rent reminders in the app." },
];

const wardenSteps = [
  { icon: FileCheck, title: "Add your property", desc: "List your PG or hostel with photos, pricing, and amenities." },
  { icon: BarChart3, title: "Manage occupancy", desc: "Update bed status and track rent in one dashboard." },
  { icon: Home, title: "Stay full", desc: "Students discover you and book; you get notified." },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-accent text-3xl font-bold text-text-primary sm:text-4xl">How it works</h2>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto">Two simple flows: one for students, one for wardens.</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl border border-surface-dark bg-surface p-8">
            <h3 className="text-xl font-semibold text-primary">For Students</h3>
            <ul className="mt-6 space-y-6">
              {studentSteps.map((s) => (
                <li key={s.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{s.title}</p>
                    <p className="text-sm text-text-muted">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl border border-surface-dark bg-surface p-8">
            <h3 className="text-xl font-semibold text-primary">For Wardens</h3>
            <ul className="mt-6 space-y-6">
              {wardenSteps.map((s) => (
                <li key={s.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{s.title}</p>
                    <p className="text-sm text-text-muted">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
