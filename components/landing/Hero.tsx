"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Building2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[85vh] flex items-center py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h1 className="font-accent text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Find Your{" "}
              <span className="text-primary">Safe Haven</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl">
              Discover verified, safety-scored student housing. Match with roommates, 
              take virtual tours, and manage your stay—all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/signup?role=student">Get Started as Student</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup?role=warden">Join as Owner / Warden</Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="rounded-3xl border border-surface-dark bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">Safety-verified listings</h3>
              <p className="mt-2 text-sm text-text-muted">
                Every property is scored for CCTV, security, and amenities.
              </p>
              <Button variant="ghost" size="sm" className="mt-4" asChild>
                <Link href="/signup?role=student">Explore as Student →</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="rounded-3xl border border-surface-dark bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-success/20 text-accent-success">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">Manage with ease</h3>
              <p className="mt-2 text-sm text-text-muted">
                Occupancy grids, rent tracker, and analytics for wardens.
              </p>
              <Button variant="ghost" size="sm" className="mt-4" asChild>
                <Link href="/signup?role=warden">Join as Warden →</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="rounded-3xl border border-surface-dark bg-surface p-6 shadow-soft transition-shadow hover:shadow-soft-lg sm:col-span-2"
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Map-based discovery</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Browse listings on a map, filter by price and safety, and save your favorites.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
