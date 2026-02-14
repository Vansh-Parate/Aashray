"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getListingsByWardenId } from "@/lib/storage/listings";
import { getRentRecords } from "@/lib/storage/rent";
import { RentTrackerTable } from "@/components/warden/RentTrackerTable";

export default function RentTrackerPage() {
  const { user } = useAuth();
  const listings = user?.role === "warden" ? getListingsByWardenId(user.id) : [];
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [key, setKey] = useState(0);
  const refresh = useCallback(() => setKey((k) => k + 1), []);
  const records = getRentRecords().filter((r) => r.month === month && listings.some((l) => l.id === r.listingId));

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
      />
    </div>
  );
}
