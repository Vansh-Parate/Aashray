"use client";

import { useCallback, useState, useEffect } from "react";
import {
  getOccupancyByListingId,
  getOrCreateOccupancyForListing,
  saveOccupancy,
} from "@/lib/storage/occupancy";
import { getListingById } from "@/lib/storage/listings";
import type { OccupancyGrid } from "@/types";

export function useOccupancy(listingId: string | null) {
  const [data, setData] = useState<OccupancyGrid | null>(null);

  const refresh = useCallback(() => {
    if (!listingId) {
      setData(null);
      return;
    }
    const listing = getListingById(listingId);
    if (!listing) {
      setData(null);
      return;
    }
    const grid = getOrCreateOccupancyForListing(
      listingId,
      listing.occupancy.total
    );
    setData(grid);
  }, [listingId]);

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
