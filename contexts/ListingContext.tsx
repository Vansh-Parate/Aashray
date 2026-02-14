"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getListings } from "@/lib/storage/listings";
import { fetchListingsFromSupabase } from "@/lib/supabase/listings";
import { supabase } from "@/lib/supabase/client";
import type { Listing } from "@/types";

interface ListingContextType {
  listings: Listing[];
  refresh: () => void;
  isLoading: boolean;
}

const ListingContext = createContext<ListingContextType | null>(null);

export function ListingProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (supabase) {
      setIsLoading(true);
      const fromSupabase = await fetchListingsFromSupabase();
      setListings(fromSupabase);
    } else {
      setListings(getListings());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ListingContext.Provider value={{ listings, refresh, isLoading }}>
      {children}
    </ListingContext.Provider>
  );
}

export function useListingContext() {
  const ctx = useContext(ListingContext);
  if (!ctx) throw new Error("useListingContext must be used within ListingProvider");
  return ctx;
}
