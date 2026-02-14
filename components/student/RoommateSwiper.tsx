"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RoommateCard } from "@/components/student/RoommateCard";
import type { RoommateProfile } from "@/types";

interface RoommateSwiperProps {
  profiles: RoommateProfile[];
  onLike?: (profile: RoommateProfile) => void;
  onSkip?: (profile: RoommateProfile) => void;
}

export function RoommateSwiper({ profiles, onLike, onSkip }: RoommateSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const current = profiles[currentIndex];
  const visible = profiles.slice(currentIndex, currentIndex + 3);

  const handleSwipe = (dir: "left" | "right") => {
    if (!current) return;
    if (dir === "right") onLike?.(current);
    else onSkip?.(current);
    setDirection(dir);
    setCurrentIndex((i) => Math.min(i + 1, profiles.length));
  };

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-text-muted text-lg">No more profiles to show.</p>
        <p className="text-text-muted text-sm mt-2">Check back later for new matches.</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-text-muted text-lg">You have seen all profiles.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {visible.map((profile, i) => (
          <motion.div
            key={profile.id}
            initial={{ scale: 1 - i * 0.05, y: i * 20, opacity: 1 }}
            animate={{ scale: 1 - i * 0.05, y: i * 20 }}
            exit={{
              x: direction === "right" ? 300 : -300,
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 3 - i }}
          >
            <div className="w-full max-h-full overflow-auto">
              <RoommateCard profile={profile} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => handleSwipe("left")}
        >
          ✗
        </Button>
        <Button
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => handleSwipe("right")}
        >
          ♥
        </Button>
      </div>
    </div>
  );
}
