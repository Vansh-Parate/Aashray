import { calculateSafetyScore } from "@/lib/utils/safety-calculator";
import type { Listing, RoommateProfile } from "@/types";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1588012886079-baef0ac45fbd?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60",
  "https://images.pexels.com/photos/19130094/pexels-photo-19130094.jpeg",
];

export function generateMockListings(wardenId: string, count = 12): Listing[] {
  const types: Listing["type"][] = ["PG", "Hostel", "Apartment"];
  const areas = [
    "Andheri West", "Andheri East", "Versova", "Lokhandwala", "DN Nagar",
    "Four Bungalows", "Juhu", "Oshiwara", "Jogeshwari West", "Azad Nagar",
    "Chakala", "MIDC Andheri", "Marol", "Saki Naka", "Seven Bungalows",
  ];
  const coords = [
    { lat: 19.1190, lng: 72.8460 }, { lat: 19.1197, lng: 72.8710 },
    { lat: 19.1325, lng: 72.8195 }, { lat: 19.1280, lng: 72.8350 },
    { lat: 19.1225, lng: 72.8380 }, { lat: 19.1370, lng: 72.8285 },
    { lat: 19.1060, lng: 72.8270 }, { lat: 19.1340, lng: 72.8430 },
    { lat: 19.1350, lng: 72.8520 }, { lat: 19.1165, lng: 72.8490 },
    { lat: 19.1130, lng: 72.8670 }, { lat: 19.1100, lng: 72.8750 },
    { lat: 19.1080, lng: 72.8840 }, { lat: 19.1010, lng: 72.8880 },
    { lat: 19.1310, lng: 72.8230 },
  ];
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
    const area = areas[i % areas.length];
    const listing: Listing = {
      id: `listing_${i + 1}`,
      warderId: wardenId,
      title: titles[i % titles.length] + (i > 11 ? ` ${i}` : ""),
      type: types[i % 3],
      location: {
        address: `${100 + i} ${area}, Andheri`,
        city: "Mumbai",
        coordinates: coords[i % coords.length],
      },
      pricing: {
        rent: 6000 + (i % 10) * 1500,
        deposit: 15000 + (i % 5) * 5000,
        currency: "INR",
      },
      amenities,
      safetyScore: calculateSafetyScore(amenities),
      images: [PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]],
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
