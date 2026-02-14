import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type { OccupancyGrid } from "@/types";

export function getOccupancyData(): OccupancyGrid[] {
  return getFromStorage<OccupancyGrid[]>(STORAGE_KEYS.OCCUPANCY_DATA, []);
}

export function getOccupancyByListingId(
  listingId: string
): OccupancyGrid | undefined {
  return getOccupancyData().find((o) => o.listingId === listingId);
}

export function saveOccupancy(grid: OccupancyGrid): void {
  const data = getOccupancyData();
  const index = data.findIndex((o) => o.listingId === grid.listingId);
  const updated = {
    ...grid,
    updatedAt: new Date().toISOString(),
  };
  if (index >= 0) {
    data[index] = updated;
  } else {
    data.push(updated);
  }
  saveToStorage(STORAGE_KEYS.OCCUPANCY_DATA, data);
}

export function getOrCreateOccupancyForListing(
  listingId: string,
  totalBeds: number
): OccupancyGrid {
  let grid = getOccupancyByListingId(listingId);
  if (!grid) {
    const roomsCount = Math.ceil(totalBeds / 4);
    const rooms = Array.from({ length: roomsCount }, (_, i) => ({
      roomNumber: String(i + 1),
      beds: Array.from(
        { length: i === roomsCount - 1 ? (totalBeds % 4) || 4 : 4 },
        (__, j) => ({
          bedNumber: String(i * 4 + j + 1),
          status: "Empty" as const,
        })
      ),
    }));
    grid = {
      listingId,
      rooms,
      updatedAt: new Date().toISOString(),
    };
    saveOccupancy(grid);
  }
  return grid;
}
