import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type { Booking } from "@/types";

export function getBookings(): Booking[] {
  return getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
}

export function getBookingsByUserId(userId: string): Booking[] {
  return getBookings().filter((b) => b.userId === userId);
}

export function createBooking(
  userId: string,
  listingId: string,
  roomNumber: string,
  bedNumber: string
): Booking {
  const bookings = getBookings();
  const booking: Booking = {
    id: `book_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId,
    listingId,
    roomNumber,
    bedNumber,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  return booking;
}
