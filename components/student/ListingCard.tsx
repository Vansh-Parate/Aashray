"use client";

import React from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { getSafetyLabel } from "@/lib/utils/safety-calculator";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils/cn";

interface ListingCardProps {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const ListingCard = React.memo(function ListingCard(props: ListingCardProps) {
  const { listing, isSaved, onToggleSave } = props;
  const safetyLabel = getSafetyLabel(listing.safetyScore);
  const firstImage = listing.images && listing.images[0];
  const safetyDisplay = (listing.safetyScore / 20).toFixed(1);

  return (
    <Link href={`/listing/${listing.id}`} className="group cursor-pointer block">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-dark mb-3">
        {firstImage ? (
          <img
            src={firstImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            No image
          </div>
        )}
        {/* Save/Heart Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave();
            }}
            className={cn(
              "absolute top-3 right-3 hover:scale-110 transition-all drop-shadow-md",
              isSaved ? "text-accent-danger" : "text-white/80 hover:text-white"
            )}
          >
            <Heart
              className={cn("w-5 h-5 stroke-[2]", isSaved && "fill-accent-danger")}
            />
          </button>
        )}
        {/* Safety Badge */}
        {listing.safetyScore >= 70 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase text-text-primary shadow-sm">
            {safetyLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-text-primary text-sm line-clamp-1">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-primary-dark shrink-0 ml-2">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="font-medium">{safetyDisplay}</span>
        </div>
      </div>
      <p className="text-sm text-text-muted mt-0.5">
        {listing.location.city} · {listing.type}
      </p>
      <p className="text-sm text-text-muted mt-0.5">
        {listing.occupancy.available} beds available · {listing.gender}
      </p>
      <div className="flex items-baseline gap-1 mt-1.5">
        <span className="font-bold text-primary-dark text-sm">
          ₹{listing.pricing.rent.toLocaleString()}
        </span>
        <span className="text-text-secondary text-sm">/ month</span>
      </div>
    </Link>
  );
});
