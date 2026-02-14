"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-24"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-surface-dark bg-surface p-12 shadow-soft">
          <h2 className="font-accent text-3xl font-bold text-text-primary sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-text-secondary">
            Join as a student to find safe housing, or as a warden to manage your property.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup?role=student">Sign up as Student</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup?role=warden">Sign up as Warden</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
