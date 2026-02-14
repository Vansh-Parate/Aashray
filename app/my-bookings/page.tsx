"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { getBookingsByUserId } from "@/lib/storage/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { listings } = useListings();
  const [bookings, setBookings] = useState<ReturnType<typeof getBookingsByUserId>>([]);

  useEffect(() => {
    if (!user?.id) return;
    setBookings(getBookingsByUserId(user.id));
  }, [user?.id]);

  const getListingById = (id: string) => listings.find((l) => l.id === id);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Please log in to view your bookings.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-2xl font-bold text-text-primary mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="py-12 text-center">
            <p className="text-text-muted">You have no bookings yet.</p>
            <Button asChild className="mt-4">
              <Link href="/discover">Discover listings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => {
            const listing = getListingById(booking.listingId);
            return (
              <Card key={booking.id} className="rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="font-semibold">{listing?.title ?? "Listing"}</h3>
                  <Badge variant={booking.status === "Confirmed" ? "success" : "secondary"}>{booking.status}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">Room {booking.roomNumber}, Bed {booking.bedNumber}</p>
                  {listing && (
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link href={"/listing/" + listing.id}>View listing</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
