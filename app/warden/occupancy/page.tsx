"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { useOccupancy } from "@/hooks/useOccupancy";
import { saveOccupancy } from "@/lib/storage/occupancy";
import { supabase } from "@/lib/supabase/client";
import { OccupancyGrid } from "@/components/warden/OccupancyGrid";

export default function OccupancyPage() {
  const { user } = useAuth();
  const { listings: allListings } = useListings();
  const listings = (!supabase || user?.role !== "warden")
    ? allListings
    : allListings.filter((l) => l.warderId === user.id);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (listings.length > 0 && (!selectedId || !listings.some((l) => l.id === selectedId))) {
      setSelectedId(listings[0].id);
    }
  }, [listings, selectedId]);

  const { data: occupancy, updateOccupancy } = useOccupancy(selectedId);

  const handleUpdate = (grid: Parameters<typeof saveOccupancy>[0]) => {
    saveOccupancy(grid);
    updateOccupancy(grid);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="font-accent text-xl sm:text-2xl font-bold text-text-primary mb-6 sm:mb-8">Occupancy</h1>
      <OccupancyGrid
        listings={listings}
        selectedListingId={selectedId}
        onSelectListing={setSelectedId}
        occupancy={occupancy}
        onUpdateOccupancy={handleUpdate}
      />
    </div>
  );
}
