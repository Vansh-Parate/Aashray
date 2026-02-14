"use client";

import { useCallback, useState, useEffect } from "react";
import {
  getOccupancyByListingId,
  getOrCreateOccupancyForListing,
  saveOccupancy,
} from "@/lib/storage/occupancy";
import { useListings } from "@/hooks/useListings";
import type { OccupancyGrid } from "@/types";

export function useOccupancy(listingId: string | null) {
  const { listings } = useListings();
  const [data, setData] = useState<OccupancyGrid | null>(null);

  const refresh = useCallback(() => {
    if (!listingId) {
      setData(null);
      return;
    }
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) {
      setData(null);
      return;
    }
    const grid = getOrCreateOccupancyForListing(
      listingId,
      listing.occupancy.total
    );
    setData(grid);
  }, [listingId, listings]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateOccupancy = useCallback(
    (updated: OccupancyGrid) => {
      saveOccupancy(updated);
      setData(updated);
    },
    []
  );

  return { data, refresh, updateOccupancy };
}

export function useOccupancyData(listingId: string | null) {
  const [data, setData] = useState<OccupancyGrid | null>(null);
  useEffect(() => {
    if (!listingId) {
      setData(null);
      return;
    }
    setData(getOccupancyByListingId(listingId) ?? null);
  }, [listingId]);
  return data;
}
