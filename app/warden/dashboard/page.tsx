"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { getRentRecords } from "@/lib/storage/rent";
import { Building2, Bed, Users, IndianRupee, Plus, LayoutGrid, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WardenDashboardPage() {
  const { user } = useAuth();
  const { listings: allListings } = useListings();
  const listings = user?.role === "warden" ? allListings.filter((l) => l.warderId === user.id) : [];
  const totalBeds = listings.reduce((s, l) => s + l.occupancy.total, 0);
  const occupiedBeds = listings.reduce((s, l) => s + l.occupancy.occupied, 0);
  const records = getRentRecords();
  const collectedRent = records.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/15 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Listings</p>
                <p className="text-2xl font-bold">{listings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/15 p-3">
                <Bed className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Beds</p>
                <p className="text-2xl font-bold">{totalBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/15 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Occupied</p>
                <p className="text-2xl font-bold">{occupiedBeds} <span className="text-sm font-normal text-text-muted">({totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0}%)</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/15 p-3">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Rent Collected</p>
                <p className="text-2xl font-bold">₹{collectedRent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Button asChild variant="outline" className="h-auto py-6 rounded-3xl flex flex-col items-center gap-2">
          <Link href="/warden/add-listing">
            <Plus className="h-8 w-8" />
            Add New Listing
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6 rounded-3xl flex flex-col items-center gap-2">
          <Link href="/warden/occupancy">
            <LayoutGrid className="h-8 w-8" />
            Manage Occupancy
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6 rounded-3xl flex flex-col items-center gap-2">
          <Link href="/warden/rent-tracker">
            <Receipt className="h-8 w-8" />
            Track Rent
          </Link>
        </Button>
      </div>
    </div>
  );
}
