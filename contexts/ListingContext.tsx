"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getListings } from "@/lib/storage/listings";
import type { Listing } from "@/types";

interface ListingContextType {
  listings: Listing[];
  refresh: () => void;
}

const ListingContext = createContext<ListingContextType | null>(null);

export function ListingProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);

  const refresh = useCallback(() => {
    setListings(getListings());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ListingContext.Provider value={{ listings, refresh }}>
      {children}
    </ListingContext.Provider>
  );
}

export function useListingContext() {
  const ctx = useContext(ListingContext);
  if (!ctx) throw new Error("useListingContext must be used within ListingProvider");
  return ctx;
}
