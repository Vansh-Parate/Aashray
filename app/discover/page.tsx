"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { generateMockListings } from "@/lib/constants/mock-data";
import { getListings } from "@/lib/storage/listings";
import { saveToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getSavedListingIds, toggleSavedListing } from "@/lib/storage/saved-listings";
import { supabase } from "@/lib/supabase/client";
import { MapView } from "@/components/student/MapView";
import { ListingCard } from "@/components/student/ListingCard";
import { FilterPanel, defaultFilters, type FilterState } from "@/components/student/FilterPanel";
import { cn } from "@/lib/utils/cn";

export default function DiscoverPage() {
  const { user } = useAuth();
  const { listings, refresh, isLoading } = useListings();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!supabase) {
      const current = getListings();
      if (current.length === 0) {
        const wardenId = user?.role === "warden" ? user.id : "warden_demo";
        saveToStorage(STORAGE_KEYS.LISTINGS, generateMockListings(wardenId, 15));
        refresh();
      }
    }
  }, [user?.id, user?.role, refresh]);

  useEffect(() => {
    if (!user?.id) return;
    setSavedIds(getSavedListingIds(user.id));
  }, [user?.id, listings]);

  const filtered = listings.filter((l) => {
    if (filters.minPrice && l.pricing.rent < filters.minPrice) return false;
    if (filters.maxPrice && l.pricing.rent > filters.maxPrice) return false;
    if (filters.gender !== "any" && l.gender !== filters.gender) return false;
    if (l.safetyScore < filters.minSafety) return false;
    if (filters.hasAvailability && l.occupancy.available <= 0) return false;
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((a) => (l.amenities as Record<string, boolean>)[a]);
      if (!hasAll) return false;
    }
    return true;
  });

  const handleToggleSave = (listingId: string) => {
    if (!user?.id) return;
    toggleSavedListing(user.id, listingId);
    setSavedIds(getSavedListingIds(user.id));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-accent text-2xl font-bold text-text-primary">Discover listings</h1>
        <FilterPanel filters={filters} onApply={setFilters} />
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-[500px] lg:sticky lg:top-24">
          <MapView listings={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <p className="text-text-muted py-8">Loading listings...</p>
          ) : filtered.length === 0 ? (
            <p className="text-text-muted py-8">No listings match your filters.</p>
          ) : (
            filtered.map((listing) => (
              <div
                key={listing.id}
                className={cn("transition-all", selectedId === listing.id && "ring-2 ring-primary rounded-3xl")}
                onClick={() => setSelectedId(listing.id)}
              >
                <ListingCard
                  listing={listing}
                  isSaved={savedIds.includes(listing.id)}
                  onToggleSave={user ? () => handleToggleSave(listing.id) : undefined}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
