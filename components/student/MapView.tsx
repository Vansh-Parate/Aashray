"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { getSafetyColor } from "@/lib/utils/safety-calculator";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils/cn";

interface MapViewProps {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ listings, selectedId, onSelect }: MapViewProps) {
  const bounds = useMemo(() => {
    if (listings.length === 0) return { minLat: 18.5, maxLat: 18.6, minLng: 73.8, maxLng: 74 };
    const lats = listings.map((l) => l.location.coordinates.lat);
    const lngs = listings.map((l) => l.location.coordinates.lng);
    return {
      minLat: Math.min(...lats) - 0.01,
      maxLat: Math.max(...lats) + 0.01,
      minLng: Math.min(...lngs) - 0.01,
      maxLng: Math.max(...lngs) + 0.01,
    };
  }, [listings]);

  const scaleX = 100 / (bounds.maxLng - bounds.minLng);
  const scaleY = 100 / (bounds.maxLat - bounds.minLat);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl bg-surface-dark overflow-hidden">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {listings.map((listing) => {
          const x = (listing.location.coordinates.lng - bounds.minLng) * scaleX;
          const y = 100 - (listing.location.coordinates.lat - bounds.minLat) * scaleY;
          const color = getSafetyColor(listing.safetyScore);
          const isSelected = selectedId === listing.id;
          return (
            <g
              key={listing.id}
              onClick={() => onSelect(listing.id)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={x}
                cy={y}
                r={isSelected ? 4 : 3}
                fill={color}
                stroke={isSelected ? "#3E3530" : "transparent"}
                strokeWidth={1.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <title>{listing.title} · ₹{listing.pricing.rent}/mo</title>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-2 rounded-lg bg-background/90 px-3 py-2 text-xs text-text-muted">
        Click a pin to focus listing
      </div>
    </div>
  );
}
