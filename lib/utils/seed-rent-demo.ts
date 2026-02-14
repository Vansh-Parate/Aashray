import { getOrCreateOccupancyForListing, saveOccupancy } from "@/lib/storage/occupancy";
import { generateMonthlyRent } from "@/lib/storage/rent";
import type { Listing, OccupancyGrid } from "@/types";

const DEMO_TENANTS = [
    "Aarav Sharma",
    "Priya Patel",
    "Rohan Mehta",
    "Sneha Desai",
    "Vikram Singh",
    "Ananya Reddy",
    "Karthik Nair",
    "Meera Joshi",
    "Arjun Gupta",
    "Divya Iyer",
    "Rahul Kapoor",
    "Pooja Verma",
];

/**
 * Seeds demo occupancy data with tenants assigned to beds,
 * then generates rent records for the given month.
 */
export function seedDemoOccupancyAndRent(listings: Listing[], month: string) {
    let tenantIdx = 0;

    for (const listing of listings) {
        const grid = getOrCreateOccupancyForListing(listing.id, listing.occupancy.total);

        // Fill some beds with demo tenants
        const updatedGrid: OccupancyGrid = {
            ...grid,
            rooms: grid.rooms.map((room) => ({
                ...room,
                beds: room.beds.map((bed) => {
                    // Fill roughly 60-70% of beds
                    if (bed.status === "Empty" && Math.random() < 0.65) {
                        const name = DEMO_TENANTS[tenantIdx % DEMO_TENANTS.length];
                        tenantIdx++;
                        return {
                            ...bed,
                            status: "Occupied" as const,
                            tenantId: `tenant_${tenantIdx}`,
                            tenantName: name,
                        };
                    }
                    return bed;
                }),
            })),
            updatedAt: new Date().toISOString(),
        };

        saveOccupancy(updatedGrid);
        generateMonthlyRent(listing.id, month, listing.pricing.rent, updatedGrid);
    }
}
