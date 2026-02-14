"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { getRentRecords } from "@/lib/storage/rent";
import { supabase } from "@/lib/supabase/client";
import { RentTrackerTable } from "@/components/warden/RentTrackerTable";

export default function RentTrackerPage() {
  const { user } = useAuth();
  const { listings: allListings } = useListings();
  const listings = (!supabase || user?.role !== "warden")
    ? allListings
    : allListings.filter((l) => l.warderId === user.id);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const refresh = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    // One-time cleanup: remove old auto-seeded demo data
    const cleaned = localStorage.getItem("rent_cleanup_v1");
    if (!cleaned) {
      localStorage.removeItem("rent_demo_seeded");
      localStorage.removeItem("aashray_rent_records");
      localStorage.removeItem("aashray_occupancy");
      localStorage.setItem("rent_cleanup_v1", "done");
    }
    setMounted(true);
  }, []);

  // Only compute records after mount to avoid hydration mismatch
  const records = mounted
    ? getRentRecords().filter(
      (r) => r.month === month && listings.some((l) => l.id === r.listingId)
    )
    : [];

  const listingMap = Object.fromEntries(listings.map((l) => [l.id, l]));

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">Rent Tracker</h1>
        <div className="text-text-muted py-12 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">Rent Tracker</h1>
      <RentTrackerTable
        key={key}
        listings={listings}
        records={records}
        selectedMonth={month}
        onMonthChange={setMonth}
        onRefresh={refresh}
        listingMap={listingMap}
      />
    </div>
  );
}
