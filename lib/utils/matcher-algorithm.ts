import type { RoommateProfile } from "@/types";

export function calculateMatchScore(
  userProfile: RoommateProfile,
  candidateProfile: RoommateProfile
): number {
  let score = 0;
  const weights = {
    sleepSchedule: 25,
    cleanliness: 20,
    socialPreference: 15,
    studyStyle: 15,
    lifestyle: 15,
    interests: 10,
  };

  if (userProfile.habits.sleepSchedule === candidateProfile.habits.sleepSchedule) {
    score += weights.sleepSchedule;
  } else if (
    userProfile.habits.sleepSchedule === "Flexible" ||
    candidateProfile.habits.sleepSchedule === "Flexible"
  ) {
    score += weights.sleepSchedule * 0.5;
  }

  const cleanlinessLevels = ["Relaxed", "Moderately Clean", "Very Clean"];
  const userCleanIndex = cleanlinessLevels.indexOf(
    userProfile.habits.cleanliness
  );
  const candidateCleanIndex = cleanlinessLevels.indexOf(
    candidateProfile.habits.cleanliness
  );
  const cleanDiff = Math.abs(userCleanIndex - candidateCleanIndex);
  score += weights.cleanliness * (1 - cleanDiff / 2);

  if (
    userProfile.habits.socialPreference ===
    candidateProfile.habits.socialPreference
  ) {
    score += weights.socialPreference;
  } else if (
    userProfile.habits.socialPreference === "Balanced" ||
    candidateProfile.habits.socialPreference === "Balanced"
  ) {
    score += weights.socialPreference * 0.7;
  }

  if (userProfile.habits.studyStyle === candidateProfile.habits.studyStyle) {
    score += weights.studyStyle;
  }

  const lifestyleLevels = ["Homebody", "Occasional", "Party Person"];
  const userLifeIndex = lifestyleLevels.indexOf(userProfile.habits.lifestyle);
  const candidateLifeIndex = lifestyleLevels.indexOf(
    candidateProfile.habits.lifestyle
  );
  const lifeDiff = Math.abs(userLifeIndex - candidateLifeIndex);
  score += weights.lifestyle * (1 - lifeDiff / 2);

  const commonInterests = userProfile.interests.filter((interest) =>
    candidateProfile.interests.includes(interest)
  );
  score +=
    (commonInterests.length / Math.max(userProfile.interests.length, 1)) *
    weights.interests;

  return Math.round(score);
}
