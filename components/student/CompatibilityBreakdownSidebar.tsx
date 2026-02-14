"use client";

import { useState } from "react";
import type { RoommateProfile } from "@/types";

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

  if (!profile) return null;

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
    <div className="rounded-3xl border border-surface-dark bg-surface p-4 text-text-primary shadow-soft">
      <h3 className="font-semibold text-text-primary mb-2 text-[13px]">Compatibility breakdown</h3>
      <div className="space-y-2.5">
        {categories.map(({ label, value }) => (
          <div key={label}>
            <div className="flex justify-between items-center text-[13px] mb-0.5">
              <span className="text-text-muted text-left">{label}</span>
              <span className="font-medium text-text-primary text-[14px] tabular-nums">{value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-dark">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <h4 className="font-semibold text-text-primary mt-2.5 mb-1 text-[13px]">Why you matched</h4>
      <ul className="space-y-0.5 text-[13px] text-text-muted">
        {reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="text-primary mt-0.5 shrink-0">•</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <aside className="hidden lg:block w-full">
        {content}
      </aside>
      {/* Mobile: expandable */}
      <div className="lg:hidden w-full">
        <button
          type="button"
          onClick={setOpen}
          className="w-full rounded-2xl border border-surface-dark bg-surface py-2.5 px-4 text-sm font-medium text-text-primary shadow-soft transition-colors hover:bg-surface-dark/50"
        >
          {open ? "Hide compatibility" : "View compatibility breakdown"}
        </button>
        {open && <div className="mt-3">{content}</div>}
      </div>
    </>
  );
}
