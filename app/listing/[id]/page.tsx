"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { isListingSaved, toggleSavedListing } from "@/lib/storage/saved-listings";
import { createBooking } from "@/lib/storage/bookings";
import { Button } from "@/components/ui/button";
import { VirtualTourSlider } from "@/components/student/VirtualTourSlider";
import { SafetyScorecard } from "@/components/student/SafetyScorecard";
import { AMENITY_LABELS } from "@/lib/constants/amenities";
import { useState } from "react";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { listings } = useListings();
  const id = params?.id as string;
  const listing = id ? listings.find((l) => l.id === id) ?? null : null;
  const [saved, setSaved] = useState(user ? isListingSaved(user.id, id) : false);

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Listing not found.</p>
        <Button asChild className="mt-4">
          <Link href="/discover">Back to Discover</Link>
        </Button>
      </div>
    );
  }

  function handleSave() {
    if (!user || !listing) return;
    toggleSavedListing(user.id, listing.id);
    setSaved(!saved);
  }

  function handleBook() {
    if (!user || !listing) {
      if (!user) router.push("/login");
      return;
    }
    createBooking(user.id, listing.id, "1", "1");
    router.push("/my-bookings");
  }

  const amenityList = Object.entries(listing.amenities).filter(([, v]) => v);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <VirtualTourSlider images={listing.images} alt={listing.title} />
          <div className="rounded-2xl sm:rounded-3xl border border-surface-dark bg-surface p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{listing.title}</h1>
            <p className="text-text-muted mt-2">{listing.location.address}, {listing.location.city}</p>
            <p className="mt-4 text-text-secondary">{listing.description}</p>
            <h3 className="font-semibold mt-6">Amenities</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {amenityList.map(([k]: [string, boolean]) => (
                <span key={k} className="rounded-lg bg-surface-dark px-3 py-1 text-sm">{AMENITY_LABELS[k] || k}</span>
              ))}
            </div>
            {listing.rules && listing.rules.length > 0 && (
              <>
                <h3 className="font-semibold mt-6">House rules</h3>
                <ul className="list-disc list-inside text-text-muted mt-2">
                  {listing.rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <SafetyScorecard score={listing.safetyScore} amenities={listing.amenities} />
          <div className="rounded-2xl sm:rounded-3xl border border-surface-dark bg-surface p-4 sm:p-6">
            <p className="text-2xl font-bold text-primary" suppressHydrationWarning>₹{listing.pricing.rent.toLocaleString()}<span className="text-base font-normal text-text-muted">/month</span></p>
            <p className="text-sm text-text-muted mt-1" suppressHydrationWarning>Deposit: ₹{listing.pricing.deposit.toLocaleString()}</p>
            <p className="text-sm text-text-muted mt-2">{listing.occupancy.available} beds available · {listing.gender}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleBook} className="flex-1 min-w-0">Book now</Button>
              {user && (
                <Button variant="outline" size="icon" onClick={handleSave} className="shrink-0">{saved ? "♥" : "♡"}</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
