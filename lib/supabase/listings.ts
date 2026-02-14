import { supabase } from "./client";
import type { Listing } from "@/types";

interface SupabaseListingRow {
  id: string;
  warder_id: string;
  title: string;
  type: string;
  location: Record<string, unknown>;
  pricing: Record<string, unknown>;
  amenities: Record<string, boolean>;
  safety_score: number;
  images: string[];
  occupancy: { total: number; occupied: number; available?: number };
  gender: string;
  rules: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

function mapRowToListing(row: SupabaseListingRow): Listing {
  const occ = row.occupancy;
  return {
    id: row.id,
    warderId: row.warder_id,
    title: row.title,
    type: row.type as Listing["type"],
    location: row.location as Listing["location"],
    pricing: row.pricing as Listing["pricing"],
    amenities: row.amenities as Listing["amenities"],
    safetyScore: row.safety_score,
    images: row.images ?? [],
    occupancy: {
      total: occ?.total ?? 0,
      occupied: occ?.occupied ?? 0,
      available: occ?.available ?? (occ?.total ?? 0) - (occ?.occupied ?? 0),
    },
    gender: row.gender as Listing["gender"],
    rules: row.rules ?? [],
    description: row.description ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchListingsFromSupabase(): Promise<Listing[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapRowToListing);
}

export async function fetchListingsByWardenFromSupabase(wardenId: string): Promise<Listing[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("warder_id", wardenId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapRowToListing);
}
