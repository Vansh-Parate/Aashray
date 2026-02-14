"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSafetyColor, getSafetyLabel } from "@/lib/utils/safety-calculator";
import type { Listing } from "@/types";

const safetyFeatures = [
  { key: "cctv", label: "CCTV Surveillance" },
  { key: "securityGuard", label: "24/7 Security Guard" },
  { key: "biometrics", label: "Biometric Access" },
  { key: "wifi", label: "WiFi" },
  { key: "parking", label: "Parking" },
  { key: "gym", label: "Gym" },
] as const;

interface SafetyScorecardProps {
  score: number;
  amenities: Listing["amenities"];
}

export function SafetyScorecard({ score, amenities }: SafetyScorecardProps) {
  const circumference = 2 * Math.PI * 24;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getSafetyColor(score);
  const label = getSafetyLabel(score);

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <h3 className="font-semibold text-lg">Safety Score</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="24"
                fill="none"
                stroke="var(--surface-dark)"
                strokeWidth="6"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="24"
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-text-primary">{score}</span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium" style={{ color }}>{label}</p>
        </div>
        <div className="space-y-3">
          {safetyFeatures.map((f) => {
            const active = amenities[f.key as keyof typeof amenities];
            return (
              <div key={f.key} className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">{f.label}</span>
                <Badge variant={active ? "success" : "secondary"}>
                  {active ? "✓" : "—"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
