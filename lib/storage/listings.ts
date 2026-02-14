import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import { calculateSafetyScore } from "@/lib/utils/safety-calculator";
import type { Listing } from "@/types";

export function getListings(): Listing[] {
  return getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, []);
}

export function getListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

export function getListingsByWardenId(wardenId: string): Listing[] {
  return getListings().filter((l) => l.warderId === wardenId);
}

export function saveListing(listing: Listing): void {
  const listings = getListings();
  const index = listings.findIndex((l) => l.id === listing.id);
  const now = new Date().toISOString();
  const withScore = {
    ...listing,
    safetyScore: calculateSafetyScore(listing.amenities),
    updatedAt: now,
  };
  if (index >= 0) {
    listings[index] = withScore;
  } else {
    listings.push(withScore);
  }
  saveToStorage(STORAGE_KEYS.LISTINGS, listings);
}

export function createListing(
  data: Omit<Listing, "id" | "createdAt" | "updatedAt" | "safetyScore"> & {
    occupancy: { total: number; occupied?: number; available?: number };
  }
): Listing {
  const now = new Date().toISOString();
  const id = `listing_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const occupied = data.occupancy.occupied ?? 0;
  const occupancy = {
    total: data.occupancy.total,
    occupied,
    available: data.occupancy.total - occupied,
  };
  const listing: Listing = {
    ...data,
    id,
    occupancy,
    safetyScore: calculateSafetyScore(data.amenities),
    createdAt: now,
    updatedAt: now,
  };
  saveListing(listing);
  return listing;
}

export function deleteListing(id: string): void {
  const listings = getListings().filter((l) => l.id !== id);
  saveToStorage(STORAGE_KEYS.LISTINGS, listings);
}
