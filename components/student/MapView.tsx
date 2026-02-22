"use client";

import { useMemo, useState } from "react";
import { Home, Star, MapPin, Bed } from "lucide-react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapControls,
} from "@/components/ui/map";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils/cn";

interface MapViewProps {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ listings, selectedId, onSelect }: MapViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Calculate map center from listings
  const center = useMemo<[number, number]>(() => {
    if (listings.length === 0) return [72.8697, 19.1136]; // Andheri default
    const avgLng =
      listings.reduce((s, l) => s + l.location.coordinates.lng, 0) /
      listings.length;
    const avgLat =
      listings.reduce((s, l) => s + l.location.coordinates.lat, 0) /
      listings.length;
    return [avgLng, avgLat];
  }, [listings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
      <h2 className="font-accent text-lg font-semibold text-text-primary mb-4">
        Explore on map
      </h2>
      <div className="h-[300px] sm:h-[380px] md:h-[450px] rounded-2xl overflow-hidden border border-surface-dark shadow-soft">
        <Map center={center} zoom={15} theme="light">
          <MapControls position="bottom-right" showZoom showLocate />
          {listings.map((listing) => {
            const isSelected = selectedId === listing.id;
            const safetyDisplay = (listing.safetyScore / 20).toFixed(1);
            const firstImage = listing.images?.[0];

            return (
              <MapMarker
                key={listing.id}
                longitude={listing.location.coordinates.lng}
                latitude={listing.location.coordinates.lat}
                onClick={() => onSelect(listing.id)}
                onMouseEnter={() => setHoveredId(listing.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <MarkerContent>
                  <div
                    className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary-dark text-white scale-115 shadow-xl ring-2 ring-primary-light"
                        : "bg-white text-primary-dark border-2 border-primary/30 hover:scale-110 hover:shadow-xl hover:border-primary"
                    )}
                  >
                    <Home className="w-5 h-5 stroke-[2]" />
                  </div>
                </MarkerContent>
                <MarkerTooltip>
                  <div className="w-60 bg-white rounded-xl shadow-soft-lg overflow-hidden border border-surface-dark">
                    {firstImage && (
                      <img
                        src={firstImage}
                        alt={listing.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-text-primary line-clamp-1">
                          {listing.title}
                        </h4>
                        <div className="flex items-center gap-0.5 text-xs text-primary-dark shrink-0 ml-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span>{safetyDisplay}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                        <MapPin className="w-3 h-3" />
                        <span>{listing.location.city}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-primary-dark">
                          ₹{listing.pricing.rent.toLocaleString()}/mo
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Bed className="w-3 h-3" />
                          {listing.occupancy.available} beds
                        </span>
                      </div>
                    </div>
                  </div>
                </MarkerTooltip>
              </MapMarker>
            );
          })}
        </Map>
      </div>
    </div>
  );
}
