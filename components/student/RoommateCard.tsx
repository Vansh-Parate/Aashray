"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { RoommateProfile } from "@/types";

interface RoommateCardProps {
  profile: RoommateProfile;
}

export function RoommateCard({ profile }: RoommateCardProps) {
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const habits = [
    { icon: "Sleep", value: profile.habits.sleepSchedule },
    { icon: "Cleanliness", value: profile.habits.cleanliness },
    { icon: "Social", value: profile.habits.socialPreference },
    { icon: "Study", value: profile.habits.studyStyle },
    { icon: "Lifestyle", value: profile.habits.lifestyle },
  ];

  return (
    <Card className="p-8 h-full rounded-3xl">
      <CardContent className="p-0">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarFallback className="text-2xl bg-primary/20 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <h2 className="text-center text-2xl font-bold text-text-primary">{profile.name}</h2>
        <p className="text-center text-text-muted">{profile.course} · {profile.university}</p>
        <div className="mt-6 space-y-4">
          {habits.map((h) => (
            <div key={h.icon} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{h.icon}</span>
              <span className="font-medium text-text-primary">{h.value}</span>
            </div>
          ))}
        </div>
        <Separator className="my-6" />
        <div>
          <h4 className="font-semibold mb-2 text-text-primary">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="secondary">{interest}</Badge>
            ))}
          </div>
        </div>
        <p className="mt-6 text-sm text-text-muted">{profile.bio}</p>
        {profile.matchScore !== undefined && (
          <p className="mt-4 text-sm font-medium text-primary">Match: {profile.matchScore}%</p>
        )}
      </CardContent>
    </Card>
  );
}
