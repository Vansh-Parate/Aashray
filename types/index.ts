export type UserRole = "student" | "warden";

export interface Listing {
  id: string;
  warderId: string;
  title: string;
  type: "PG" | "Hostel" | "Apartment";
  location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  pricing: {
    rent: number;
    deposit: number;
    currency: "INR";
  };
  amenities: {
    cctv: boolean;
    securityGuard: boolean;
    biometrics: boolean;
    wifi: boolean;
    meals: boolean;
    laundry: boolean;
    parking: boolean;
    gym: boolean;
  };
  safetyScore: number;
  images: string[];
  occupancy: {
    total: number;
    occupied: number;
    available: number;
  };
  gender: "Male" | "Female" | "Co-ed";
  rules: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoommateProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  course: string;
  university: string;
  habits: {
    sleepSchedule: "Early Riser" | "Night Owl" | "Flexible";
    cleanliness: "Very Clean" | "Moderately Clean" | "Relaxed";
    socialPreference: "Social Butterfly" | "Balanced" | "Quiet Time";
    studyStyle: "Library Goer" | "Room Studier" | "Group Studier";
    lifestyle: "Party Person" | "Occasional" | "Homebody";
  };
  interests: string[];
  bio: string;
  lookingFor: {
    genderPreference: "Same Gender" | "Any" | "Female" | "Male";
    budgetRange: { min: number; max: number };
    preferredLocations: string[];
  };
  matchScore?: number;
  /** Optional compatibility breakdown for UI (derived or from backend) */
  matchBreakdown?: { lifestyle: number; budget: number; cleanliness: number; schedule: number };
  matchReasons?: string[];
  preferredMoveIn?: string;
  leaseMonths?: number;
  responseRate?: "High" | "Medium" | "Low";
  createdAt: string;
}

export interface OccupancyGrid {
  listingId: string;
  rooms: {
    roomNumber: string;
    beds: {
      bedNumber: string;
      status: "Empty" | "Occupied" | "Reserved";
      tenantId?: string;
      tenantName?: string;
    }[];
  }[];
  updatedAt: string;
}

export interface RentRecord {
  id: string;
  listingId: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  bedNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "Pending" | "Paid" | "Overdue";
  month: string;
  notificationSent: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  listingId: string;
  roomNumber: string;
  bedNumber: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: string;
}
