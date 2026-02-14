import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type { RoommateProfile } from "@/types";

export function getRoommateProfiles(): RoommateProfile[] {
  return getFromStorage<RoommateProfile[]>(STORAGE_KEYS.ROOMMATE_PROFILES, []);
}

export function getRoommateProfileById(id: string): RoommateProfile | undefined {
  return getRoommateProfiles().find((p) => p.id === id);
}

export function getRoommateProfileByUserId(userId: string): RoommateProfile | undefined {
  return getRoommateProfiles().find((p) => p.userId === userId);
}

export function getRoommateProfilesExcludingUserId(
  userId: string
): RoommateProfile[] {
  return getRoommateProfiles().filter((p) => p.userId !== userId);
}

export function saveRoommateProfile(profile: RoommateProfile): void {
  const profiles = getRoommateProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveToStorage(STORAGE_KEYS.ROOMMATE_PROFILES, profiles);
}
