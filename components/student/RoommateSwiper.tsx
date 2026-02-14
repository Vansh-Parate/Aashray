"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DiscoveryRoommateCard } from "@/components/student/DiscoveryRoommateCard";
import type { RoommateProfile } from "@/types";

interface RoommateSwiperProps {
  profiles: RoommateProfile[];
  onLike?: (profile: RoommateProfile) => void;
  onSkip?: (profile: RoommateProfile) => void;
  onMaybeLater?: (profile: RoommateProfile) => void;
  onCurrentChange?: (profile: RoommateProfile | null) => void;
}

const SWIPE_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 500;

const NEW_MATCHES_TODAY = 5;
const PROFILE_VIEWS = 23;

export function RoommateSwiper({
  profiles,
  onLike,
  onSkip,
  onMaybeLater,
  onCurrentChange,
}: RoommateSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const current = profiles[currentIndex];
  const nextTwo = [profiles[currentIndex + 1], profiles[currentIndex + 2]].filter(Boolean);

  useEffect(() => {
    onCurrentChange?.(current ?? null);
  }, [current?.id, current, onCurrentChange]);

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (!current) return;
      if (dir === "right") onLike?.(current);
      else onSkip?.(current);
      setExitDirection(dir);
      requestAnimationFrame(() => {
        setCurrentIndex((i) => Math.min(i + 1, profiles.length));
      });
    },
    [current, onLike, onSkip, profiles.length]
  );

  const handleMaybeLater = useCallback(() => {
    if (!current) return;
    onMaybeLater?.(current);
    setExitDirection(null);
    setCurrentIndex((i) => Math.min(i + 1, profiles.length));
  }, [current, onMaybeLater]);

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

  const progressPct = profiles.length ? ((currentIndex + 1) / profiles.length) * 100 : 0;

  return (
    <div className="relative w-full h-full min-h-0 flex flex-col">
      {/* Stats banner - compact single line, 8-10px vertical */}
      <div className="mb-2 flex items-center justify-center gap-3 rounded-2xl border border-surface-dark bg-surface/80 px-3 py-2 text-[13px] text-text-muted shrink-0">
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>✨</span>
          New matches today: <span className="font-medium text-text-primary">{NEW_MATCHES_TODAY}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>👁</span>
          Profile views: <span className="font-medium text-text-primary">{PROFILE_VIEWS}</span>
        </span>
      </div>

      {/* Progress - 8-10px below stats; 24-32px above card */}
      <div className="mb-6 shrink-0">
        <p className="text-center text-[13px] text-text-muted">
          Viewing <span className="font-medium text-text-primary">{currentIndex + 1}</span> of{" "}
          <span className="font-medium text-text-primary">{profiles.length}</span> matches
        </p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-dark">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Card stack + main card - flex-1 to fill viewport */}
      <div className="relative flex-1 min-h-[200px] w-full max-w-[420px] mx-auto flex items-center justify-center">
        {nextTwo.map((profile, i) => (
          <motion.div
            key={profile.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={false}
            animate={{
              scale: 1 - (i + 1) * 0.05,
              y: (i + 1) * 10,
              opacity: 0.92 - i * 0.08,
            }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 2 - i }}
          >
            <div className="w-full h-full max-h-[320px] px-2 flex items-center justify-center">
              <div className="rounded-3xl overflow-hidden shadow-soft w-full max-w-[380px] aspect-[4/5] max-h-[320px]">
                <DiscoveryRoommateCard profile={profile} anonymous className="w-full h-full" />
              </div>
            </div>
          </motion.div>
        ))}
        <div className="relative z-10 w-full h-full flex items-center justify-center min-h-[280px]">
          <AnimatePresence mode="wait" initial={false}>
            <SwipeableCard
              key={current.id}
              profile={current}
              onSwipe={handleSwipe}
              exitDirection={exitDirection}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons - 24-32px below card; page has 20-24px bottom padding */}
      <div className="mt-6 flex items-center justify-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="lg"
          className="rounded-2xl min-w-[80px] min-h-[40px] py-2 px-4 text-sm"
          onClick={() => handleSwipe("left")}
          aria-label="Skip"
        >
          <span className="mr-1" aria-hidden>✕</span>
          Skip
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="rounded-2xl min-w-[88px] min-h-[40px] py-2 px-4 text-sm bg-surface-dark text-text-secondary hover:bg-surface-dark/90"
          onClick={handleMaybeLater}
        >
          Maybe Later
        </Button>
        <Button
          size="lg"
          className="rounded-2xl min-w-[80px] min-h-[40px] py-2 px-4 text-sm shadow-soft"
          onClick={() => handleSwipe("right")}
          aria-label="Connect"
        >
          <span className="mr-1" aria-hidden>✓</span>
          Connect
        </Button>
      </div>
    </div>
  );
}

interface SwipeableCardProps {
  profile: RoommateProfile;
  onSwipe: (dir: "left" | "right") => void;
  exitDirection: "left" | "right" | null;
}

function SwipeableCard({ profile, onSwipe, exitDirection }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-200, -50, 0, 50, 200], [0.96, 0.98, 1, 0.98, 0.96]);
  const rotate = useTransform(x, [-200, 200], [-4, 4]);
  const overlayGreen = useTransform(x, [0, 150], [0, 0.15]);
  const overlayRed = useTransform(x, [-150, 0], [0.15, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > DRAG_VELOCITY_THRESHOLD) {
      onSwipe(offset > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center touch-none"
      style={{ x, scale, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.35}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
      exit={{
        x: exitDirection === "right" ? 400 : -400,
        opacity: 0,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
        style={{ opacity: overlayGreen }}
      >
        <div className="absolute inset-0 bg-accent-success/30" />
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
        style={{ opacity: overlayRed }}
      >
        <div className="absolute inset-0 bg-accent-danger/25" />
      </motion.div>

      {/* Floating thumb indicators */}
      <motion.span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-20 text-4xl opacity-0"
        style={{ opacity: useTransform(x, (v) => (v < -40 ? 0.85 : 0)) }}
        aria-hidden
      >
        👎
      </motion.span>
      <motion.span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 z-20 text-4xl opacity-0"
        style={{ opacity: useTransform(x, (v) => (v > 40 ? 0.85 : 0)) }}
        aria-hidden
      >
        👍
      </motion.span>

      <div className="w-full h-full max-h-[340px] flex items-center justify-center px-2">
        <div className="w-full max-w-[380px] max-h-[340px] overflow-hidden flex items-center justify-center rounded-3xl transition-transform duration-200 hover:rotate-[3deg] origin-center">
          <DiscoveryRoommateCard
            profile={profile}
            anonymous
            className="w-full max-w-[380px] h-full"
            isInteractive
          />
        </div>
      </div>
    </motion.div>
  );
}
