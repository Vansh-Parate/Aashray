import type { Listing } from "@/types";

/**
 * Single source of truth for listing safety score (0–100).
 * Weights: CCTV 30, Security guard 30, Biometrics 25, Wifi/Parking/Gym 5 each.
 */
export function calculateSafetyScore(
  amenities: Listing["amenities"]
): number {
  let score = 0;
  if (amenities.cctv) score += 30;
  if (amenities.securityGuard) score += 30;
  if (amenities.biometrics) score += 25;
  if (amenities.wifi) score += 5;
  if (amenities.parking) score += 5;
  if (amenities.gym) score += 5;
  return Math.min(score, 100);
}

export function getSafetyColor(score: number): string {
  if (score >= 75) return "var(--safety-high)";
  if (score >= 50) return "var(--safety-medium)";
  return "var(--safety-low)";
}

export function getSafetyLabel(score: number): string {
  if (score >= 75) return "Highly Safe";
  if (score >= 50) return "Moderately Safe";
  return "Basic Safety";
}
