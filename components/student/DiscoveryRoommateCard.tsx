"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RoommateProfile } from "@/types";

interface DiscoveryRoommateCardProps {
  profile: RoommateProfile;
  anonymous?: boolean;
  style?: React.CSSProperties;
  className?: string;
  /** For hover tilt; applied by parent */
  isInteractive?: boolean;
}

type HabitKey = "sleepSchedule" | "cleanliness" | "socialPreference" | "studyStyle" | "lifestyle";

const HABIT_CONFIG: Record<
  string,
  { label: string; icon: string; category: "schedule" | "cleanliness" | "social" | "lifestyle" }
> = {
  "Early Riser": { label: "Early Riser", icon: "☀️", category: "schedule" },
  "Night Owl": { label: "Night Owl", icon: "🌙", category: "schedule" },
  Flexible: { label: "Flexible", icon: "⏰", category: "schedule" },
  "Very Clean": { label: "Clean", icon: "✨", category: "cleanliness" },
  "Moderately Clean": { label: "Moderate", icon: "⚖️", category: "cleanliness" },
  Relaxed: { label: "Chill", icon: "🏠", category: "cleanliness" },
  "Social Butterfly": { label: "Social", icon: "🦋", category: "social" },
  Balanced: { label: "Balanced", icon: "⚖️", category: "social" },
  "Quiet Time": { label: "Quiet", icon: "🤫", category: "social" },
  "Library Goer": { label: "Library", icon: "📚", category: "lifestyle" },
  "Room Studier": { label: "Room", icon: "🏠", category: "lifestyle" },
  "Group Studier": { label: "Group", icon: "👥", category: "lifestyle" },
  "Party Person": { label: "Party Person", icon: "🎉", category: "lifestyle" },
  Occasional: { label: "Occasional", icon: "🎉", category: "lifestyle" },
  Homebody: { label: "Homebody", icon: "🏠", category: "lifestyle" },
};

const TAG_BORDER_CLASS: Record<string, string> = {
  schedule: "border-primary/30 bg-primary/5 hover:border-primary/50",
  cleanliness: "border-accent-success/30 bg-accent-success/5 hover:border-accent-success/50",
  social: "border-primary/25 bg-primary/5 hover:border-primary/40",
  lifestyle: "border-primary/30 bg-primary/5 hover:border-primary/50",
};

const DEFAULT_BIO = "Looking for a quiet, study-focused roommate. Prefers weekday study sessions and a clean space.";

export function DiscoveryRoommateCard({
  profile,
  anonymous = false,
  style,
  className,
  isInteractive = false,
}: DiscoveryRoommateCardProps) {
  const firstInitial = profile.name.trim().charAt(0).toUpperCase() || "?";
  const displayName = anonymous ? firstInitial : profile.name;
  const initials = anonymous ? firstInitial : profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const habitKeys: HabitKey[] = ["sleepSchedule", "cleanliness", "socialPreference", "studyStyle", "lifestyle"];
  const habitEntries = habitKeys.map((key) => {
    const value = profile.habits[key];
    const config = value ? HABIT_CONFIG[value] : null;
    return config ? { ...config, value } : null;
  }).filter(Boolean) as { label: string; icon: string; category: "schedule" | "cleanliness" | "social" | "lifestyle" }[];

  const { min, max } = profile.lookingFor?.budgetRange ?? { min: 0, max: 0 };
  const budgetText = min && max ? `₹${(min / 1000).toFixed(0)}k – ₹${(max / 1000).toFixed(0)}k` : "—";

  const bio = profile.bio?.trim() || DEFAULT_BIO;
  const moveIn = profile.preferredMoveIn ?? "March 2026";
  const lease = profile.leaseMonths ?? 11;
  const responseRate = profile.responseRate ?? "High";

  return (
    <Card
      className={`p-4 h-full rounded-3xl border border-surface-dark bg-surface text-text-primary shadow-soft transition-all duration-200 ${isInteractive ? "hover:shadow-soft-lg" : ""} ${className ?? ""}`}
      style={style}
    >
      <CardContent className="p-0">
        <Avatar className="mx-auto mb-2 h-20 w-20">
          <AvatarFallback className="text-xl bg-primary/20 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-center text-lg font-bold text-text-primary">{displayName}</h2>

        <p className="mt-2 text-center text-sm text-text-muted line-clamp-2 px-0.5 leading-snug">
          {bio}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {habitEntries.map(({ label, icon, category }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-medium transition-colors duration-200 ${TAG_BORDER_CLASS[category] ?? "border-surface-dark bg-surface-dark/50"}`}
            >
              <span className="text-[10px] leading-none opacity-80">{icon}</span>
              {label}
            </span>
          ))}
        </div>

        <p className="mt-2 text-center text-sm text-text-muted">
          Budget: <span className="font-medium text-text-primary">{budgetText}</span>
        </p>
        <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0 text-sm text-text-muted">
          <span>Move-in: <span className="font-medium text-text-primary">{moveIn}</span></span>
          <span>Lease: <span className="font-medium text-text-primary">{lease} months</span></span>
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-1 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-success/10 px-2 py-0.5 text-accent-success text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-success" aria-hidden />
            Response Rate: {responseRate}
          </span>
        </div>

        {profile.matchScore !== undefined && (
          <p className="mt-1 text-center text-sm font-semibold text-primary">
            Compatibility: {profile.matchScore}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}
