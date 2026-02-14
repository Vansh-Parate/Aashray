"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getRoommateProfilesExcludingUserId } from "@/lib/storage/roommates";
import { getRoommateProfiles } from "@/lib/storage/roommates";
import { saveToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { generateMockRoommateProfiles } from "@/lib/constants/mock-data";
import { RoommateSwiper } from "@/components/student/RoommateSwiper";
import { CompatibilityBreakdownSidebar } from "@/components/student/CompatibilityBreakdownSidebar";
import type { RoommateProfile } from "@/types";

function enrichProfile(p: RoommateProfile, baseScore: number): RoommateProfile {
  const v = () => Math.min(100, Math.max(0, baseScore + (Math.floor(Math.random() * 20) - 6)));
  const lifestyle = v();
  const budget = v();
  const cleanliness = v();
  const schedule = v();
  const reasons: string[] = [];
  if (lifestyle >= 75) reasons.push("Similar lifestyle preferences");
  if (budget >= 70) reasons.push("Budget range overlap");
  if (cleanliness >= 75) reasons.push("Compatible cleanliness expectations");
  if (schedule >= 70) reasons.push("Similar schedule preference");
  if (reasons.length < 2) reasons.push("Good overall fit");
  return {
    ...p,
    matchScore: baseScore,
    matchBreakdown: { lifestyle, budget, cleanliness, schedule },
    matchReasons: reasons.slice(0, 3),
    preferredMoveIn: p.preferredMoveIn ?? "March 2026",
    leaseMonths: p.leaseMonths ?? 11,
    responseRate: p.responseRate ?? "High",
  };
}

export default function RoommateMatcherPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<RoommateProfile | null>(null);

  useEffect(() => {
    let list = getRoommateProfiles();
    if (list.length === 0 && typeof window !== "undefined") {
      const mock = generateMockRoommateProfiles(20);
      saveToStorage(STORAGE_KEYS.ROOMMATE_PROFILES, mock);
      list = mock;
    }
    const excludeUserId = user?.id ?? "none";
    let filtered = getRoommateProfilesExcludingUserId(excludeUserId);
    if (filtered.length === 0) filtered = list.filter((p) => p.userId !== excludeUserId);
    const withScores = filtered.map((p) => {
      const baseScore = user ? 50 + Math.floor(Math.random() * 50) : 70;
      return enrichProfile(p, baseScore);
    });
    setProfiles(withScores);
  }, [user?.id]);

  return (
    <div className="relative container mx-auto overflow-y-auto lg:overflow-hidden flex flex-col min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)]">
      {/* Subtle background depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35]" aria-hidden>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-surface-dark/50 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative flex flex-1 flex-col min-h-0 pt-4 px-5 pb-5">
        {/* Content starts in green-box area: left column (stats, progress, card, buttons), right column (compatibility). */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-10 min-h-0 overflow-hidden">
          {/* Left: Card swiping area (~55-60%), vertically centered */}
          <div className="flex flex-col justify-center min-h-0 overflow-hidden">
            <RoommateSwiper
              profiles={profiles}
              onLike={(p) => console.log("Liked", p.name)}
              onSkip={(p) => console.log("Skipped", p.name)}
              onCurrentChange={setCurrentProfile}
            />
          </div>

          {/* Right: Compatibility box (~35-40%), align top with left content */}
          <div className="flex items-start justify-center lg:justify-end pt-0 lg:pr-1 overflow-auto">
            <div className="w-full max-w-[360px]">
              <CompatibilityBreakdownSidebar profile={currentProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
