"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getRoommateProfiles } from "@/lib/storage/roommates";
import { saveToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { generateMockRoommateProfiles } from "@/lib/constants/mock-data";
import { RoommateSwiper } from "@/components/student/RoommateSwiper";
import { CompatibilityBreakdownSidebar } from "@/components/student/CompatibilityBreakdownSidebar";
import type { RoommateProfile } from "@/types";
import { UserPlus } from "lucide-react";

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
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<RoommateProfile | null>(null);

  useEffect(() => {
    let list = getRoommateProfiles();
    if (list.length === 0 && typeof window !== "undefined") {
      const mock = generateMockRoommateProfiles(20);
      saveToStorage(STORAGE_KEYS.ROOMMATE_PROFILES, mock);
      list = mock;
    }
    const withScores = list.map((p) => {
      const baseScore = 50 + Math.floor(Math.random() * 50);
      return enrichProfile(p, baseScore);
    });
    setProfiles(withScores);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-mesh">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Page header */}
        <header className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-accent text-2xl font-bold text-text-primary">Roommate Matcher</h1>
              <p className="text-sm text-text-muted">Anonymous profiles • Swipe to find your match</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-10">
          {/* Swipe area */}
          <main className="flex flex-col min-h-[520px] lg:min-h-[600px]">
            <RoommateSwiper
              profiles={profiles}
              onLike={(p) => {
                toast.success("Connection sent!", {
                  description: "They'll be notified if it's a match.",
                });
              }}
              onSkip={(p) => {
                toast("Skipped", { description: "Moving to the next profile." });
              }}
              onMaybeLater={(p) => {
                toast.info("Saved for later", {
                  description: "You can review them again in your saved list.",
                });
              }}
              onCurrentChange={setCurrentProfile}
            />
          </main>

          {/* Compatibility sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <CompatibilityBreakdownSidebar profile={currentProfile} />
          </aside>
        </div>
      </div>
    </div>
  );
}
