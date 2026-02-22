"use client";

import { useState, useEffect, useMemo } from "react";
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
import { CategoryBar, type CategoryKey } from "@/components/student/CategoryBar";
import { FilterPanel, defaultFilters, type FilterState } from "@/components/student/FilterPanel";
import { Footer } from "@/components/shared/Footer";

const ITEMS_PER_PAGE = 8;
const MOCK_DATA_VERSION = "v5-three-images";

function applyCategoryFilter(listings: import("@/types").Listing[], category: CategoryKey) {
  switch (category) {
    case "safe":
      return listings.filter((l) => l.safetyScore >= 70);
    case "sharing":
      return listings.filter((l) => l.gender === "Co-ed" || l.occupancy.total >= 15);
    case "budget":
      return listings.filter((l) => l.pricing.rent <= 10000);
    case "nearby":
      return [...listings].sort((a, b) => {
        const distA = Math.abs(a.location.coordinates.lat - 18.52) + Math.abs(a.location.coordinates.lng - 73.85);
        const distB = Math.abs(b.location.coordinates.lat - 18.52) + Math.abs(b.location.coordinates.lng - 73.85);
        return distA - distB;
      });
    case "premium":
      return listings.filter((l) => {
        const amenityCount = Object.values(l.amenities).filter(Boolean).length;
        return l.safetyScore >= 60 && amenityCount >= 5;
      });
    default:
      return listings;
  }
}

export default function DiscoverPage() {
  const { user } = useAuth();
  const { listings, refresh, isLoading } = useListings();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [category, setCategory] = useState<CategoryKey>("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const current = getListings();
    const storedVersion = localStorage.getItem("mock_data_version");
    if (current.length === 0 || storedVersion !== MOCK_DATA_VERSION) {
      const wardenId = user?.role === "warden" ? user.id : "warden_demo";
      const mock = generateMockListings(wardenId, 15);
      saveToStorage(STORAGE_KEYS.LISTINGS, mock);
      localStorage.setItem("mock_data_version", MOCK_DATA_VERSION);
      refresh();
    }
  }, [user?.id, user?.role, refresh]);

  useEffect(() => {
    if (!user?.id) return;
    setSavedIds(getSavedListingIds(user.id));
  }, [user?.id, listings]);

  // Apply panel filters first
  const panelFiltered = useMemo(
    () =>
      listings.filter((l) => {
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
      }),
    [listings, filters]
  );

  // Then apply category filter
  const filtered = useMemo(
    () => applyCategoryFilter(panelFiltered, category),
    [panelFiltered, category]
  );

  // Reset visible count when category or filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [category, filters]);

  const visibleListings = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleToggleSave = (listingId: string) => {
    if (!user?.id) return;
    toggleSavedListing(user.id, listingId);
    setSavedIds(getSavedListingIds(user.id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title & Filter Row */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-accent text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Discover listings
          </h1>
          <FilterPanel filters={filters} onApply={setFilters} />
        </div>

        {/* Category Bar */}
        <CategoryBar active={category} onChange={setCategory} />

        {/* Result count */}
        <p className="text-xs text-text-muted mb-4">
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {isLoading ? (
            <p className="text-text-muted py-8 col-span-full">Loading listings...</p>
          ) : visibleListings.length === 0 ? (
            <p className="text-text-muted py-8 col-span-full">
              No listings match your filters.
            </p>
          ) : (
            visibleListings.map((listing) => (
              <div
                key={listing.id}
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

        {/* Show More Button */}
        {hasMore && (
          <div className="flex justify-center mb-16">
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="bg-primary-dark text-white hover:bg-primary transition-colors px-6 py-3 rounded-xl text-sm font-medium shadow-soft w-full sm:w-auto"
            >
              Show more listings
            </button>
          </div>
        )}
      </div>

      {/* Map Section */}
      <MapView
        listings={filtered}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
