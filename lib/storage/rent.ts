import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type { OccupancyGrid, RentRecord } from "@/types";

function generateId(): string {
  return `rent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Send a notification via the server API (triggers Supabase Realtime) */
async function sendNotification(params: {
  userId: string;
  type: string;
  title: string;
  message: string;
}): Promise<void> {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
}

export function getRentRecords(): RentRecord[] {
  return getFromStorage<RentRecord[]>(STORAGE_KEYS.RENT_RECORDS, []);
}

export function getRentRecordsByListingId(
  listingId: string,
  month?: string
): RentRecord[] {
  let records = getRentRecords().filter((r) => r.listingId === listingId);
  if (month) records = records.filter((r) => r.month === month);
  return records;
}

export function markRentAsPaid(recordId: string): void {
  const records = getRentRecords();
  const recordIndex = records.findIndex((r) => r.id === recordId);

  if (recordIndex !== -1) {
    records[recordIndex].status = "Paid";
    records[recordIndex].paidDate = new Date().toISOString();
    records[recordIndex].notificationSent = false;

    saveToStorage(STORAGE_KEYS.RENT_RECORDS, records);

    // Fire-and-forget: sends notification via API → Supabase Realtime
    sendNotification({
      userId: records[recordIndex].tenantId,
      type: "rent_paid",
      title: "Rent Payment Confirmed",
      message: `Your rent payment of ₹${records[recordIndex].amount} for ${records[recordIndex].month} has been confirmed.`,
    });
  }
}

export function generateMonthlyRent(
  listingId: string,
  month: string,
  rentAmount: number,
  occupancy: OccupancyGrid
): RentRecord[] {
  const existing = getRentRecords().filter(
    (r) => r.listingId === listingId && r.month === month
  );
  if (existing.length > 0) return existing;

  const dueDate = new Date(month + "-05");
  const records: RentRecord[] = [];
  for (const room of occupancy.rooms) {
    for (const bed of room.beds) {
      if (bed.status === "Occupied" && bed.tenantName) {
        const record: RentRecord = {
          id: generateId(),
          listingId,
          tenantId: bed.tenantId || `tenant_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          tenantName: bed.tenantName,
          roomNumber: room.roomNumber,
          bedNumber: bed.bedNumber,
          amount: rentAmount,
          dueDate: dueDate.toISOString().split("T")[0],
          status: "Pending",
          month,
          notificationSent: false,
        };
        records.push(record);
      }
    }
  }
  const all = getRentRecords();
  all.push(...records);
  saveToStorage(STORAGE_KEYS.RENT_RECORDS, all);
  return records;
}

/**
 * Add a rent record for a single tenant when they are assigned a bed.
 * Skips if a record already exists for that listing + room + bed + month.
 */
export function addRentForSingleTenant(params: {
  listingId: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  bedNumber: string;
  rentAmount: number;
}): RentRecord | null {
  const month = new Date().toISOString().slice(0, 7); // current month
  const existing = getRentRecords();

  // Check if a record already exists for this bed this month
  const alreadyExists = existing.some(
    (r) =>
      r.listingId === params.listingId &&
      r.roomNumber === params.roomNumber &&
      r.bedNumber === params.bedNumber &&
      r.month === month
  );
  if (alreadyExists) return null;

  const dueDate = new Date(month + "-05");
  const record: RentRecord = {
    id: generateId(),
    listingId: params.listingId,
    tenantId: params.tenantId,
    tenantName: params.tenantName,
    roomNumber: params.roomNumber,
    bedNumber: params.bedNumber,
    amount: params.rentAmount,
    dueDate: dueDate.toISOString().split("T")[0],
    status: "Pending",
    month,
    notificationSent: false,
  };

  existing.push(record);
  saveToStorage(STORAGE_KEYS.RENT_RECORDS, existing);
  return record;
}

/**
 * Remove all unpaid (Pending / Overdue) rent records for a specific bed
 * when a tenant is removed. Paid records are kept as historical data.
 */
export function removeRentForTenant(params: {
  listingId: string;
  roomNumber: string;
  bedNumber: string;
}): number {
  const all = getRentRecords();
  const before = all.length;
  const filtered = all.filter(
    (r) =>
      !(
        r.listingId === params.listingId &&
        r.roomNumber === params.roomNumber &&
        r.bedNumber === params.bedNumber &&
        r.status !== "Paid" // keep paid records as history
      )
  );
  saveToStorage(STORAGE_KEYS.RENT_RECORDS, filtered);
  return before - filtered.length;
}
