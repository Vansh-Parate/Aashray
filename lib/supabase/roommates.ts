import { supabase } from "./client";
import type { RoommateProfile } from "@/types";

interface SupabaseRoommateRow {
  id: string;
  user_id: string;
  name: string;
  age: number;
  course: string;
  university: string;
  habits: Record<string, string>;
  interests: string[];
  bio: string;
  looking_for: {
    genderPreference: string;
    budgetRange: { min: number; max: number };
    preferredLocations: string[];
  };
  created_at: string;
}

function mapRowToProfile(row: SupabaseRoommateRow): RoommateProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    age: row.age,
    course: row.course,
    university: row.university,
    habits: row.habits as RoommateProfile["habits"],
    interests: row.interests ?? [],
    bio: row.bio ?? "",
    lookingFor: {
      genderPreference: row.looking_for?.genderPreference as RoommateProfile["lookingFor"]["genderPreference"],
      budgetRange: row.looking_for?.budgetRange ?? { min: 0, max: 0 },
      preferredLocations: row.looking_for?.preferredLocations ?? [],
    },
    createdAt: row.created_at,
  };
}

export async function fetchRoommateProfilesFromSupabase(): Promise<RoommateProfile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("roommate_profiles").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapRowToProfile);
}
