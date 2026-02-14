"use client";

import { useListingContext } from "@/contexts/ListingContext";

export function useListings() {
  return useListingContext();
}
