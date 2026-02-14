"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { DiscoveryRoommateCard } from "@/components/student/DiscoveryRoommateCard";
import type { RoommateProfile } from "@/types";
import { X, Check, Clock } from "lucide-react";

interface RoommateSwiperProps {
  profiles: RoommateProfile[];
  onLike?: (profile: RoommateProfile) => void;
  onSkip?: (profile: RoommateProfile) => void;
  onMaybeLater?: (profile: RoommateProfile) => void;
  onCurrentChange?: (profile: RoommateProfile | null) => void;
}

const SWIPE_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 500;

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
      const nextIndex = Math.min(currentIndex + 1, profiles.length);
      const nextProfile = profiles[nextIndex] ?? null;
      onCurrentChange?.(nextProfile);
      requestAnimationFrame(() => setCurrentIndex(nextIndex));
    },
    [current, currentIndex, onLike, onSkip, onCurrentChange, profiles]
  );

  const handleMaybeLater = useCallback(() => {
    if (!current) return;
    onMaybeLater?.(current);
    setExitDirection(null);
    const nextIndex = Math.min(currentIndex + 1, profiles.length);
    onCurrentChange?.(profiles[nextIndex] ?? null);
    setCurrentIndex(nextIndex);
  }, [current, currentIndex, onMaybeLater, onCurrentChange, profiles]);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-surface-dark bg-surface/50 py-24 text-center">
        <p className="font-medium text-text-secondary">No more profiles to show.</p>
        <p className="mt-1 text-sm text-text-muted">Check back later for new matches.</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-surface-dark bg-surface/50 py-24 text-center px-6">
        <p className="font-medium text-text-secondary">You&apos;ve seen all profiles.</p>
        <p className="mt-2 text-sm text-text-muted">Update your preferences to get better matches, or check back later.</p>
      </div>
    );
  }

  const progressPct = profiles.length ? ((currentIndex + 1) / profiles.length) * 100 : 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* Progress */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-sm text-text-muted tabular-nums">
          <span className="font-semibold text-text-primary">{currentIndex + 1}</span>
          <span className="text-text-muted"> / {profiles.length}</span>
        </span>
        <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-dark">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative flex-1 min-h-[380px] max-w-[400px] mx-auto w-full">
        {nextTwo.map((profile, i) => (
          <motion.div
            key={profile.id}
            className="absolute inset-x-0 top-0 flex justify-center pointer-events-none"
            initial={false}
            animate={{
              scale: 1 - (i + 1) * 0.04,
              y: (i + 1) * 8,
              opacity: 0.9 - i * 0.1,
            }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 2 - i }}
          >
            <div className="w-full max-w-[340px]">
              <DiscoveryRoommateCard profile={profile} anonymous className="w-full" />
            </div>
          </motion.div>
        ))}

        <div className="relative z-10 flex justify-center min-h-[380px]">
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

      {/* Actions */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => handleSwipe("left")}
          aria-label="Skip"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-surface-dark bg-background text-text-secondary shadow-soft transition-all hover:border-accent-danger/40 hover:bg-accent-danger/5 hover:text-accent-danger active:scale-95"
        >
          <X className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={handleMaybeLater}
          aria-label="Maybe later"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark text-text-secondary transition-all hover:bg-primary/15 hover:text-primary active:scale-95"
        >
          <Clock className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => handleSwipe("right")}
          aria-label="Connect"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-soft transition-all hover:bg-primary-dark active:scale-95"
        >
          <Check className="h-6 w-6" strokeWidth={3} />
        </button>
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
  const rotate = useTransform(x, [-200, 200], [-6, 6]);
  const overlayConnect = useTransform(x, [0, 120], [0, 0.18]);
  const overlaySkip = useTransform(x, [-120, 0], [0.18, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > DRAG_VELOCITY_THRESHOLD) {
      onSwipe(offset > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      className="absolute inset-x-0 top-0 flex justify-center touch-none"
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
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <div className="relative w-full max-w-[340px]">
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          style={{ opacity: overlayConnect }}
        >
          <div className="absolute inset-0 bg-accent-success/25 rounded-2xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          style={{ opacity: overlaySkip }}
        >
          <div className="absolute inset-0 bg-accent-danger/20 rounded-2xl" />
        </motion.div>

        <motion.span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-20"
          style={{ opacity: useTransform(x, (v) => (v < -50 ? 0.9 : 0)) }}
          aria-hidden
        >
          <span className="text-3xl font-medium text-accent-danger">Skip</span>
        </motion.span>
        <motion.span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 z-20"
          style={{ opacity: useTransform(x, (v) => (v > 50 ? 0.9 : 0)) }}
          aria-hidden
        >
          <span className="text-3xl font-medium text-accent-success">Connect</span>
        </motion.span>

        <DiscoveryRoommateCard
          profile={profile}
          anonymous
          className="w-full"
          isInteractive
        />
      </div>
    </motion.div>
  );
}
