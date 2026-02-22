"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { generateMockListings } from "@/lib/constants/mock-data";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getListingsByWardenId } from "@/lib/storage/listings";
import { getRentRecords } from "@/lib/storage/rent";
import { getOccupancyData } from "@/lib/storage/occupancy";
import { saveToStorage } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import {
  Building2,
  Bed,
  Users,
  IndianRupee,
  Plus,
  LayoutGrid,
  Receipt,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function WardenDashboardPage() {
  const { user } = useAuth();
  const { listings: allListings, refresh } = useListings();
  const listings = (!supabase || user?.role !== "warden")
    ? allListings
    : allListings.filter((l) => l.warderId === user.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seed demo listings for warden when they have none (localStorage used when API empty)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const warden = user?.role === "warden" ? user : null;
    if (!warden?.id) return;
    const myListings = getListingsByWardenId(warden.id);
    if (myListings.length === 0) {
      const mock = generateMockListings(warden.id, 15);
      saveToStorage(STORAGE_KEYS.LISTINGS, mock);
      refresh();
    }
  }, [user?.id, user?.role, refresh]);

  const totalBeds = listings.reduce((s, l) => s + l.occupancy.total, 0);
  const occupiedBeds = listings.reduce((s, l) => s + l.occupancy.occupied, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const listingIds = new Set(listings.map((l) => l.id));

  const rentData = useMemo(() => {
    if (!mounted) return { collected: 0, pending: 0, paid: 0, unpaid: 0, records: [] as ReturnType<typeof getRentRecords> };
    const records = getRentRecords().filter((r) => listingIds.has(r.listingId));
    const collected = records.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
    const pending = records.filter((r) => r.status !== "Paid").reduce((s, r) => s + r.amount, 0);
    const paid = records.filter((r) => r.status === "Paid").length;
    const unpaid = records.filter((r) => r.status !== "Paid").length;
    return { collected, pending, paid, unpaid, records };
  }, [mounted, listingIds]);

  // Get real occupancy counts from occupancy data
  const realOccupancy = useMemo(() => {
    if (!mounted) return { occupied: 0, empty: 0, reserved: 0 };
    const allOcc = getOccupancyData().filter((o) => listingIds.has(o.listingId));
    let occupied = 0, empty = 0, reserved = 0;
    for (const occ of allOcc) {
      for (const room of occ.rooms) {
        for (const bed of room.beds) {
          if (bed.status === "Occupied") occupied++;
          else if (bed.status === "Reserved") reserved++;
          else empty++;
        }
      }
    }
    return { occupied, empty, reserved };
  }, [mounted, listingIds]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 17 ? "Good Afternoon" : "Good Evening";

  // Recent activity from rent records
  const recentActivity = useMemo(() => {
    return rentData.records
      .filter((r) => r.paidDate)
      .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
      .slice(0, 5);
  }, [rentData.records]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <div className="h-3 w-32 bg-surface-dark rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-surface-dark/50 p-6 md:p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <p className="text-xs text-text-muted font-medium tracking-widest uppercase mb-3">Warden Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
              {greeting}, {user?.displayName || "Warden"} 👋
            </h1>
            <p className="text-text-muted">
              {listings.length === 0
                ? "Get started by adding your first listing"
                : `Managing ${listings.length} ${listings.length === 1 ? "property" : "properties"} with ${totalBeds} beds`
              }
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Listings */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-surface-dark/50 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/8 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5 text-primary-dark" />
              </div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Properties</p>
              <p className="text-3xl font-bold text-text-primary mt-1" suppressHydrationWarning>{listings.length}</p>
              <p className="text-xs text-text-muted mt-1">
                {listings.filter(l => l.type === "PG").length} PG · {listings.filter(l => l.type === "Hostel").length} Hostel
              </p>
            </div>
          </div>

          {/* Total Beds */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-surface-dark/50 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/8 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Total Beds</p>
              <p className="text-3xl font-bold text-text-primary mt-1">{totalBeds}</p>
              <p className="text-xs text-text-muted mt-1">
                {realOccupancy.empty} available · {realOccupancy.reserved} reserved
              </p>
            </div>
          </div>

          {/* Occupancy */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-surface-dark/50 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-safety-high/8 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-safety-high/20 to-safety-high/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-safety-high" />
              </div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Occupancy</p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {realOccupancy.occupied}
                <span className="text-lg font-medium text-text-muted ml-1">/ {totalBeds}</span>
              </p>
              <div className="mt-2 w-full bg-surface-dark/60 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-safety-high to-safety-high/70 rounded-full h-1.5 transition-all duration-700"
                  style={{ width: `${totalBeds > 0 ? Math.round((realOccupancy.occupied / totalBeds) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-surface-dark/50 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent-warning/8 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-warning/20 to-accent-warning/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-5 h-5 text-accent-warning" />
              </div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Collected</p>
              <p className="text-3xl font-bold text-text-primary mt-1" suppressHydrationWarning>
                ₹{rentData.collected.toLocaleString()}
              </p>
              <p className="text-xs mt-1">
                {rentData.pending > 0 ? (
                  <span className="text-accent-danger font-medium">₹{rentData.pending.toLocaleString()} pending</span>
                ) : (
                  <span className="text-safety-high font-medium">All collected ✓</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions + Listings Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/warden/add-listing"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15 hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-primary-dark" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary text-sm">Add New Listing</p>
                  <p className="text-xs text-text-muted">Create a new PG, hostel, or apartment</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/warden/occupancy"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-safety-high/5 to-safety-high/10 border border-safety-high/15 hover:border-safety-high/30 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-safety-high/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6 text-safety-high" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary text-sm">Manage Occupancy</p>
                  <p className="text-xs text-text-muted">Add or update tenants across your rooms</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/warden/rent-tracker"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-accent-warning/5 to-accent-warning/10 border border-accent-warning/15 hover:border-accent-warning/30 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-warning/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6 text-accent-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary text-sm">Track Rent</p>
                  <p className="text-xs text-text-muted">Generate rent and download receipts</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Listings Overview */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Your Properties
            </h2>
            {listings.length === 0 ? (
              <Card className="rounded-2xl border-dashed border-2 border-surface-dark">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-text-muted" />
                  </div>
                  <p className="font-medium text-text-primary">No properties yet</p>
                  <p className="text-sm text-text-muted mt-1 mb-4">Add your first listing to get started</p>
                  <Link
                    href="/warden/add-listing"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-dark text-white font-medium text-sm hover:bg-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Listing
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {listings.slice(0, 4).map((listing, i) => (
                  <div
                    key={listing.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-surface-dark/50 hover:border-primary/20 hover:shadow-soft transition-all duration-300"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-dark shrink-0">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm truncate">{listing.title}</p>
                      <p className="text-xs text-text-muted truncate">{listing.location.city} · {listing.type} · {listing.gender}</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-text-muted">Beds</p>
                        <p className="text-sm font-bold text-text-primary">{listing.occupancy.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-text-muted">Rent</p>
                        <p className="text-sm font-bold text-primary-dark" suppressHydrationWarning>₹{listing.pricing.rent.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-safety-high" />
                        <span className="text-sm font-bold text-safety-high">{(listing.safetyScore / 20).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {listings.length > 4 && (
                  <p className="text-center text-sm text-text-muted pt-1">
                    +{listings.length - 4} more {listings.length - 4 === 1 ? "property" : "properties"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity & Rent Summary */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card className="rounded-2xl border-surface-dark/50 shadow-soft">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Recent Payments
              </h2>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="py-8 text-center">
                  <TrendingUp className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No payments recorded yet</p>
                  <p className="text-xs text-text-muted mt-1">Payments will appear here when tenants pay rent</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((record) => (
                    <div key={record.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                      <div className="w-9 h-9 rounded-lg bg-safety-high/15 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-safety-high" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{record.tenantName}</p>
                        <p className="text-xs text-text-muted">
                          Room {record.roomNumber} · {record.paidDate ? new Date(record.paidDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-safety-high shrink-0" suppressHydrationWarning>
                        +₹{record.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rent Summary */}
          <Card className="rounded-2xl border-surface-dark/50 shadow-soft">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Rent Overview
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Visual bar */}
                <div>
                  <div className="flex justify-between text-xs text-text-muted mb-2">
                    <span>Collection Progress</span>
                    <span suppressHydrationWarning>
                      {rentData.collected + rentData.pending > 0
                        ? Math.round((rentData.collected / (rentData.collected + rentData.pending)) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-dark/60 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-dark to-primary rounded-full h-3 transition-all duration-700 relative"
                      style={{ width: `${rentData.collected + rentData.pending > 0 ? (rentData.collected / (rentData.collected + rentData.pending)) * 100 : 0}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Stats rows */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-safety-high/8 border border-safety-high/15">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-safety-high" />
                      <span className="text-xs font-medium text-safety-high uppercase tracking-wider">Paid</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary" suppressHydrationWarning>₹{rentData.collected.toLocaleString()}</p>
                    <p className="text-xs text-text-muted mt-0.5">{rentData.paid} {rentData.paid === 1 ? "tenant" : "tenants"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent-danger/8 border border-accent-danger/15">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-accent-danger" />
                      <span className="text-xs font-medium text-accent-danger uppercase tracking-wider">Pending</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary" suppressHydrationWarning>₹{rentData.pending.toLocaleString()}</p>
                    <p className="text-xs text-text-muted mt-0.5">{rentData.unpaid} {rentData.unpaid === 1 ? "tenant" : "tenants"}</p>
                  </div>
                </div>

                {rentData.records.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-text-muted">No rent data yet</p>
                    <Link href="/warden/rent-tracker" className="text-xs text-primary-dark font-medium hover:underline mt-1 inline-block">
                      Go to Rent Tracker →
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
