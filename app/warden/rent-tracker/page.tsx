"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { getRentRecords } from "@/lib/storage/rent";
import { RentTrackerTable } from "@/components/warden/RentTrackerTable";

export default function RentTrackerPage() {
  const { user } = useAuth();
  const { listings: allListings } = useListings();
  const listings = user?.role === "warden" ? allListings.filter((l) => l.warderId === user.id) : [];
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [key, setKey] = useState(0);
  const refresh = useCallback(() => setKey((k) => k + 1), []);
  const records = getRentRecords().filter((r) => r.month === month && listings.some((l) => l.id === r.listingId));

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">Rent Tracker</h1>
      <RentTrackerTable
        key={key}
        listings={listings}
        records={records}
        selectedMonth={month}
        onMonthChange={setMonth}
        onRefresh={handleRefresh}
        onMarkPaid={() => toast.success("Marked as paid", { description: "Tenant will be notified." })}
        onGenerateRent={() => toast.success("Rent records generated", { description: "Records are in sync for this month." })}
      />
    </div>
  );
}
