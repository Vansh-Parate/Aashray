"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { generateDemoRoommateProfileForUser } from "@/lib/constants/mock-data";
import { getRoommateProfileByUserId, saveRoommateProfile } from "@/lib/storage/roommates";
import { Button } from "@/components/ui/button";
import { YourProfileCard } from "@/components/student/YourProfileCard";
import type { RoommateProfile } from "@/types";

export default function RoommateProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RoommateProfile | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userId = user?.id;
    if (!userId) {
      setProfile(null);
      return;
    }
    let p = getRoommateProfileByUserId(userId);
    if (!p) {
      const demo = generateDemoRoommateProfileForUser(userId, user?.displayName);
      saveRoommateProfile(demo);
      p = demo;
    }
    setProfile(p);
  }, [user?.id, user?.displayName]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="text-text-muted -ml-2">
            <Link href="/roommate-matcher">← Back to Roommate Matcher</Link>
          </Button>
        </div>
        <h1 className="font-accent text-2xl font-bold text-text-primary mb-2">Your Profile</h1>
        <p className="text-text-muted mb-6">View and manage your roommate preferences.</p>
        <YourProfileCard profile={profile} />
      </div>
    </div>
  );
}
