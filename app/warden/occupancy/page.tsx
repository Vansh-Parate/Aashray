"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getListingsByWardenId } from "@/lib/storage/listings";
import { useOccupancy } from "@/hooks/useOccupancy";
import { saveOccupancy } from "@/lib/storage/occupancy";
import { OccupancyGrid } from "@/components/warden/OccupancyGrid";

export default function OccupancyPage() {
  const { user } = useAuth();
  const listings = user?.role === "warden" ? getListingsByWardenId(user.id) : [];
  const [selectedId, setSelectedId] = useState<string | null>(listings[0]?.id ?? null);
  const { data: occupancy, updateOccupancy } = useOccupancy(selectedId);

  const handleUpdate = (grid: Parameters<typeof saveOccupancy>[0]) => {
    saveOccupancy(grid);
    updateOccupancy(grid);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">Occupancy</h1>
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
