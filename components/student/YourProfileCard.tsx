"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { RoommateProfile } from "@/types";

const HABIT_LABELS: Record<string, string> = {
  "Early Riser": "Early Riser",
  "Night Owl": "Night Owl",
  Flexible: "Flexible",
  "Very Clean": "Clean",
  "Moderately Clean": "Moderate",
  Relaxed: "Chill",
  "Social Butterfly": "Social",
  Balanced: "Balanced",
  "Quiet Time": "Quiet",
  "Library Goer": "Library",
  "Room Studier": "Room",
  "Group Studier": "Group",
  "Party Person": "Party Person",
  Occasional: "Occasional",
  Homebody: "Homebody",
};

interface YourProfileCardProps {
  profile: RoommateProfile | null;
}

export function YourProfileCard({ profile }: YourProfileCardProps) {

  const habitEntries = profile
    ? [
        profile.habits.sleepSchedule,
        profile.habits.cleanliness,
        profile.habits.socialPreference,
        profile.habits.studyStyle,
        profile.habits.lifestyle,
      ].map((v) => HABIT_LABELS[v] ?? v)
    : [];

  const budgetText = profile?.lookingFor?.budgetRange
    ? `₹${(profile.lookingFor.budgetRange.min / 1000).toFixed(0)}k – ₹${(profile.lookingFor.budgetRange.max / 1000).toFixed(0)}k`
    : "—";

  const preferredLocations =
    (profile?.lookingFor?.preferredLocations?.length ?? 0) > 0
      ? profile?.lookingFor?.preferredLocations?.join(", ") ?? "—"
      : "—";

  const genderPref = profile?.lookingFor?.genderPreference ?? "—";

  const completionPercent = profile
    ? Math.min(
        100,
        Math.round(
          ([
            habitEntries.length === 5,
            !!profile.lookingFor?.budgetRange?.min && !!profile.lookingFor?.budgetRange?.max,
            (profile.lookingFor?.preferredLocations?.length ?? 0) > 0,
            !!profile.lookingFor?.genderPreference,
            !!(profile.bio?.trim?.()?.length),
          ].filter(Boolean).length /
            5) *
            100
        )
      )
    : 0;

  const circumference = 2 * Math.PI * 15.5;

  return (
    <Card className="p-6 rounded-3xl border border-surface-dark bg-surface text-text-primary shadow-soft">
      <CardContent className="p-0">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
          Your Profile
        </p>
        <Avatar className="mx-auto mb-3 h-20 w-20">
          <AvatarFallback className="text-xl bg-primary/20 text-primary">
            Y
          </AvatarFallback>
        </Avatar>
        <h2 className="text-center text-xl font-bold text-text-primary">You</h2>
        {habitEntries.length > 0 ? (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {habitEntries.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="text-xs font-medium rounded-xl"
              >
                {label}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-surface-dark bg-surface-dark/30 p-4 text-center">
            <p className="text-sm font-medium text-text-primary">Complete your profile to unlock matches</p>
            <div className="mt-3 flex flex-col items-center gap-2">
              <div className="relative h-14 w-14">
                <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-dark"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                  />
                  <path
                    className="text-primary transition-all duration-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(completionPercent / 100) * circumference} ${circumference}`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary">
                  {completionPercent}%
                </span>
              </div>
              <p className="text-xs text-text-muted">Profile complete</p>
            </div>
          </div>
        )}
        <p className="mt-3 text-center text-sm text-text-muted">
          Budget: <span className="font-medium text-text-primary">{budgetText}</span>
        </p>
        <p className="mt-1 text-center text-sm text-text-muted">
          Room type: <span className="font-medium text-text-primary">Shared</span>
        </p>
        <p className="mt-1 text-center text-sm text-text-muted">
          Preferred: <span className="font-medium text-text-primary">{preferredLocations}</span>
        </p>
        <p className="mt-1 text-center text-sm text-text-muted">
          Compatibility: <span className="font-medium text-text-primary">{genderPref}</span>
        </p>
      </CardContent>
    </Card>
  );
}
