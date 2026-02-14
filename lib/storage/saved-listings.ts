import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";

export function getSavedListingIds(userId: string): string[] {
  const key = `${STORAGE_KEYS.SAVED_LISTINGS}_${userId}`;
  return getFromStorage<string[]>(key, []);
}

export function toggleSavedListing(userId: string, listingId: string): boolean {
  const key = `${STORAGE_KEYS.SAVED_LISTINGS}_${userId}`;
  const ids = getSavedListingIds(userId);
  const index = ids.indexOf(listingId);
  if (index >= 0) {
    ids.splice(index, 1);
    saveToStorage(key, ids);
    return false;
  } else {
    ids.push(listingId);
    saveToStorage(key, ids);
    return true;
  }
}

export function isListingSaved(userId: string, listingId: string): boolean {
  return getSavedListingIds(userId).includes(listingId);
}
