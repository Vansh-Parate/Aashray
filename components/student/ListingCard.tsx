"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSafetyLabel, getSafetyColor } from "@/lib/utils/safety-calculator";
import { AMENITY_LABELS } from "@/lib/constants/amenities";
import type { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function ListingCard(props: ListingCardProps) {
  const { listing, isSaved, onToggleSave } = props;
  const safetyLabel = getSafetyLabel(listing.safetyScore);
  const safetyColor = getSafetyColor(listing.safetyScore);
  const amenityEntries = Object.entries(listing.amenities).filter(([, v]) => v);
  const displayAmenities = amenityEntries.slice(0, 4).map(([k]) => AMENITY_LABELS[k] || k);
  const firstImage = listing.images && listing.images[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl overflow-hidden bg-surface border border-surface-dark"
    >
      <div className="relative h-48 bg-surface-dark">
        {firstImage ? (
          <img src={firstImage} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">No image</div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="text-xs bg-primary text-white">{listing.safetyScore} · {safetyLabel}</Badge>
        </div>
      </div>
      <div className="p-6">
        <div
          className="inline-flex items-center rounded-xl border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-shadow hover:border-primary/60 hover:shadow-soft"
          title="Listing verified by AASHRAY"
        >
          Safety Verified by AASHRAY
        </div>
        <h3 className="font-semibold text-lg text-text-primary line-clamp-1 mt-3">{listing.title}</h3>
        <div className="flex items-center gap-1 mt-2 text-text-muted text-sm">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{listing.location.city}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-primary">₹{listing.pricing.rent.toLocaleString()}/mo</span>
          <span className="flex items-center gap-1 text-sm text-text-muted">
            <Bed className="h-4 w-4" />
            {listing.occupancy.available} beds
          </span>
        </div>
        {displayAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {displayAmenities.map((a) => (
              <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1">
            <Link href={"/listing/" + listing.id}>View Details</Link>
          </Button>
          {onToggleSave && (
            <Button variant="outline" size="icon" onClick={onToggleSave}>{isSaved ? "♥" : "♡"}</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
