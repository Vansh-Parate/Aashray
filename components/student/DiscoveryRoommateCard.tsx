"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RoommateProfile } from "@/types";

interface DiscoveryRoommateCardProps {
  profile: RoommateProfile;
  anonymous?: boolean;
  style?: React.CSSProperties;
  className?: string;
  isInteractive?: boolean;
}

/** Theme-aligned habit indicators: Early Riser / Night Owl / Clean / Party Person */
const HABIT_PILLS: Record<
  string,
  { label: string; icon: string; className: string }
> = {
  "Early Riser": { label: "Early Riser", icon: "☀️", className: "bg-primary/15 text-primary-dark" },
  "Night Owl": { label: "Night Owl", icon: "🌙", className: "bg-primary/10 text-primary" },
  Flexible: { label: "Flexible", icon: "⏰", className: "bg-surface-dark text-text-secondary" },
  "Very Clean": { label: "Clean", icon: "✨", className: "bg-accent-success/15 text-accent-success" },
  "Moderately Clean": { label: "Moderate", icon: "🧹", className: "bg-accent-success/10 text-accent-success" },
  Relaxed: { label: "Chill", icon: "🏠", className: "bg-surface-dark text-text-secondary" },
  "Social Butterfly": { label: "Social", icon: "🦋", className: "bg-primary/10 text-primary" },
  Balanced: { label: "Balanced", icon: "⚖️", className: "bg-surface-dark text-text-secondary" },
  "Quiet Time": { label: "Quiet", icon: "🤫", className: "bg-surface-dark text-text-secondary" },
  "Party Person": { label: "Party Person", icon: "🎉", className: "bg-accent-warning/15 text-accent-warning" },
  Occasional: { label: "Occasional", icon: "🎊", className: "bg-accent-warning/10 text-accent-warning" },
  Homebody: { label: "Homebody", icon: "🏡", className: "bg-primary/10 text-primary" },
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

  const scheduleConfig = profile.habits.sleepSchedule ? HABIT_PILLS[profile.habits.sleepSchedule] : null;
  const cleanConfig = profile.habits.cleanliness ? HABIT_PILLS[profile.habits.cleanliness] : null;
  const lifestyleConfig = profile.habits.lifestyle ? HABIT_PILLS[profile.habits.lifestyle] : null;

  const { min, max } = profile.lookingFor?.budgetRange ?? { min: 0, max: 0 };
  const budgetText = min && max ? `₹${(min / 1000).toFixed(0)}k – ₹${(max / 1000).toFixed(0)}k` : "—";
  const bio = profile.bio?.trim() || DEFAULT_BIO;
  const moveIn = profile.preferredMoveIn ?? "March 2026";
  const lease = profile.leaseMonths ?? 11;
  const responseRate = profile.responseRate ?? "High";

  const habits = [scheduleConfig, cleanConfig, lifestyleConfig].filter(Boolean);

  return (
    <article
      className={`flex flex-col rounded-2xl border border-surface-dark bg-background p-5 shadow-soft transition-all duration-200 ${
        isInteractive ? "hover:shadow-soft-lg hover:border-primary/20" : ""
      } ${className ?? ""}`}
      style={style}
    >
      {/* Anonymous avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20 border-2 border-surface-dark">
          <AvatarFallback className="text-xl font-semibold bg-primary/15 text-primary-dark">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="mt-3 font-accent text-lg font-semibold text-text-primary">{displayName}</p>
      </div>

      {/* Bio */}
      <p className="mt-3 text-center text-sm text-text-secondary line-clamp-2 leading-relaxed">
        {bio}
      </p>

      {/* Habit indicators */}
      <div className="mt-4">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Lifestyle
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {habits.map((config) => (
            <span
              key={config!.label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${config!.className}`}
            >
              <span aria-hidden>{config!.icon}</span>
              {config!.label}
            </span>
          ))}
        </div>
      </div>

      {/* Budget & details */}
      <div className="mt-4 rounded-xl border border-surface-dark/80 bg-surface/80 px-4 py-3">
        <p className="text-center text-sm text-text-muted">
          Budget <span className="font-semibold text-text-primary">{budgetText}</span>
        </p>
        <div className="mt-1 flex justify-center gap-4 text-xs text-text-muted">
          <span>Move-in: <span className="font-medium text-text-primary">{moveIn}</span></span>
          <span>Lease: <span className="font-medium text-text-primary">{lease} mo</span></span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-success/10 px-2.5 py-1 text-accent-success font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-success" aria-hidden />
          {responseRate} response
        </span>
        {profile.matchScore !== undefined && (
          <span className="font-semibold text-primary">
            {profile.matchScore}% match
          </span>
        )}
      </div>
    </article>
  );
}
