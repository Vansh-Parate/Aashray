import { calculateSafetyScore } from "@/lib/utils/safety-calculator";
import type { Listing, RoommateProfile } from "@/types";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
];

export function generateMockListings(wardenId: string, count = 12): Listing[] {
  const types: Listing["type"][] = ["PG", "Hostel", "Apartment"];
  const cities = ["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad"];
  const titles = [
    "Comfort Zone PG",
    "Student Haven Hostel",
    "Green Valley PG",
    "Metro Apartments",
    "Campus Nest",
    "Safe Stay Residency",
    "Study Hub PG",
    "City Center Hostel",
    "Peaceful Living PG",
    "Youth Hostel",
    "Smart Stay PG",
    "University Heights",
  ];
  return Array.from({ length: count }, (_, i) => {
    const amenities = {
      cctv: i % 3 !== 2,
      securityGuard: i % 2 === 0,
      biometrics: i % 4 === 0,
      wifi: true,
      meals: i % 3 === 0,
      laundry: i % 2 === 1,
      parking: i % 3 !== 1,
      gym: i % 4 === 1,
    };
    const total = 10 + (i % 5) * 8;
    const occupied = Math.floor(total * (0.3 + (i % 7) * 0.1));
    const listing: Listing = {
      id: `listing_${i + 1}`,
      warderId:wardenId,
      title: titles[i % titles.length] + (i > 11 ? ` ${i}` : ""),
      type: types[i % 3],
      location: {
        address: `${100 + i} Main Street, Block ${i % 5}`,
        city: cities[i % cities.length],
        coordinates: { lat: 18.5 + i * 0.02, lng: 73.8 + i * 0.01 },
      },
      pricing: {
        rent: 6000 + (i % 10) * 1500,
        deposit: 15000 + (i % 5) * 5000,
        currency: "INR",
      },
      amenities,
      safetyScore: calculateSafetyScore(amenities),
      images: PLACEHOLDER_IMAGES,
      occupancy: { total, occupied, available: total - occupied },
      gender: (["Male", "Female", "Co-ed"] as const)[i % 3],
      rules: [
        "No smoking",
        "No loud music after 10 PM",
        "Visitors allowed till 9 PM",
        "Keep common areas clean",
      ],
      description: `Safe and comfortable student accommodation near universities. ${amenities.cctv ? "CCTV surveillance." : ""} ${amenities.wifi ? "High-speed WiFi." : ""} Ideal for students.`,
      createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return listing;
  });
}

export function generateMockRoommateProfiles(count = 20): RoommateProfile[] {
  const courses = [
    "Computer Science",
    "Mechanical Engineering",
    "Business Administration",
    "Psychology",
    "Medicine",
    "Architecture",
  ];
  const universities = ["Pune University", "COEP", "VIT", "Symbiosis", "MIT"];
  const sleep = ["Early Riser", "Night Owl", "Flexible"] as const;
  const clean = ["Very Clean", "Moderately Clean", "Relaxed"] as const;
  const social = ["Social Butterfly", "Balanced", "Quiet Time"] as const;
  const study = ["Library Goer", "Room Studier", "Group Studier"] as const;
  const lifestyle = ["Party Person", "Occasional", "Homebody"] as const;
  const interestsPool = [
    "Reading",
    "Coding",
    "Gaming",
    "Sports",
    "Music",
    "Movies",
    "Cooking",
    "Travel",
    "Photography",
    "Art",
    "Fitness",
  ];
  const names = [
    "Rahul", "Priya", "Arjun", "Ananya", "Vikram", "Sneha", "Karan", "Isha",
    "Aditya", "Neha", "Rohan", "Kavya", "Siddharth", "Diya", "Aarav", "Meera",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `roommate_${i + 1}`,
    userId: `user_rm_${i + 1}`,
    name: names[i % names.length] + (i >= 16 ? ` ${i}` : ""),
    age: 19 + (i % 6),
    course: courses[i % courses.length],
    university: universities[i % universities.length],
    habits: {
      sleepSchedule: sleep[i % 3],
      cleanliness: clean[i % 3],
      socialPreference: social[i % 3],
      studyStyle: study[i % 3],
      lifestyle: lifestyle[i % 3],
    },
    interests: interestsPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + (i % 4)),
    bio: "Looking for a peaceful place to study and stay. Clean and respectful.",
    lookingFor: {
      genderPreference: (["Same Gender", "Any"] as const)[i % 2],
      budgetRange: { min: 5000 + i * 200, max: 15000 + i * 500 },
      preferredLocations: ["Pune", "Mumbai", "Bangalore"].slice(0, 1 + (i % 3)),
    },
    createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  }));
}
