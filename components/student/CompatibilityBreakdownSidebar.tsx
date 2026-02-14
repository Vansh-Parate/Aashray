"use client";

import { useState } from "react";
import type { RoommateProfile } from "@/types";
import { Sparkles } from "lucide-react";

interface CompatibilityBreakdownSidebarProps {
  profile: RoommateProfile | null;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CompatibilityBreakdownSidebar({
  profile,
  isOpen: controlledOpen,
  onToggle,
}: CompatibilityBreakdownSidebarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onToggle ?? (() => { })) : () => setInternalOpen((o) => !o);

  if (!profile) {
    const emptyState = (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-dark bg-surface/60 px-6 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-text-secondary">Swipe to see compatibility</p>
        <p className="mt-1 text-xs text-text-muted">Match breakdown appears here</p>
      </div>
    );
    return (
      <>
        <aside className="hidden lg:block w-full">{emptyState}</aside>
        <div className="lg:hidden w-full">{emptyState}</div>
      </>
    );
  }

  const breakdown = profile.matchBreakdown ?? {
    lifestyle: Math.min(100, (profile.matchScore ?? 70) + (Math.floor(Math.random() * 20) - 5)),
    budget: Math.min(100, (profile.matchScore ?? 70) + (Math.floor(Math.random() * 16) - 8)),
    cleanliness: Math.min(100, (profile.matchScore ?? 70) + (Math.floor(Math.random() * 18) - 6)),
    schedule: Math.min(100, (profile.matchScore ?? 70) + (Math.floor(Math.random() * 14) - 7)),
  };

  const reasons = profile.matchReasons ?? [
    "Similar sleep schedule preference",
    "Budget range overlap",
    "Compatible study style",
  ].slice(0, 3);

  const categories = [
    { label: "Lifestyle", value: breakdown.lifestyle },
    { label: "Budget", value: breakdown.budget },
    { label: "Cleanliness", value: breakdown.cleanliness },
    { label: "Schedule", value: breakdown.schedule },
  ] as const;

  const content = (
    <div className="rounded-2xl border border-surface-dark bg-background p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-accent font-semibold text-text-primary">Compatibility</h3>
      </div>

      <div className="space-y-4">
        {categories.map(({ label, value }) => (
          <div key={label}>
            <div className="flex justify-between items-center text-sm mb-1.5">
              <span className="text-text-muted">{label}</span>
              <span className="font-semibold text-text-primary tabular-nums">{value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-dark">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <h4 className="font-semibold text-text-primary mt-5 mb-2 text-sm">Why you matched</h4>
      <ul className="space-y-1.5 text-sm text-text-secondary">
        {reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-full">{content}</aside>
      <div className="lg:hidden w-full">
        <button
          type="button"
          onClick={setOpen}
          className="w-full rounded-2xl border border-surface-dark bg-background py-3 px-4 text-sm font-medium text-text-primary shadow-soft transition-colors hover:bg-surface"
        >
          {open ? "Hide compatibility" : "View compatibility breakdown"}
        </button>
        {open && <div className="mt-3">{content}</div>}
      </div>
    </>
  );
}
