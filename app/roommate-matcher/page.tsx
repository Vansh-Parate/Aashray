"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getRoommateProfilesExcludingUserId } from "@/lib/storage/roommates";
import { getRoommateProfiles } from "@/lib/storage/roommates";
import { saveToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { generateMockRoommateProfiles } from "@/lib/constants/mock-data";
import { calculateMatchScore } from "@/lib/utils/matcher-algorithm";
import { RoommateSwiper } from "@/components/student/RoommateSwiper";
import type { RoommateProfile } from "@/types";

export default function RoommateMatcherPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);

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
    const withScores = filtered.map((p) => ({
      ...p,
      matchScore: user ? 50 + Math.floor(Math.random() * 50) : undefined,
    }));
    setProfiles(withScores);
  }, [user?.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-2">Roommate Matcher</h1>
      <p className="text-text-muted mb-8">Swipe right to like, left to skip. Find compatible roommates.</p>
      <RoommateSwiper
        profiles={profiles}
        onLike={(p) => console.log("Liked", p.name)}
        onSkip={(p) => console.log("Skipped", p.name)}
      />
    </div>
  );
}
