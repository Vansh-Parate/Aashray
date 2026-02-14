/**
 * AASHRAY Supabase seed script
 * Run: npm run seed
 *
 * 1. Run supabase/migrations/001_initial_schema.sql in Supabase Dashboard > SQL Editor first
 * 2. Add to .env:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY (recommended for seed - bypasses RLS)
 *    Or NEXT_PUBLIC_SUPABASE_ANON_KEY if you don't have the service role key
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { createClient } = require("@supabase/supabase-js");

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1588012886079-baef0ac45fbd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdXNlc3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D",
  "https://images.pexels.com/photos/19130094/pexels-photo-19130094.jpeg",
];

function calculateSafetyScore(amenities) {
  let score = 0;
  if (amenities.cctv) score += 30;
  if (amenities.securityGuard) score += 30;
  if (amenities.biometrics) score += 25;
  if (amenities.wifi) score += 5;
  if (amenities.parking) score += 5;
  if (amenities.gym) score += 5;
  return Math.min(score, 100);
}

function generateListings(wardenId, count = 12) {
  const types = ["PG", "Hostel", "Apartment"];
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
    return {
      id: `listing_${i + 1}`,
      warder_id: wardenId,
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
      safety_score: calculateSafetyScore(amenities),
      images: PLACEHOLDER_IMAGES,
      occupancy: { total, occupied, available: total - occupied },
      gender: ["Male", "Female", "Co-ed"][i % 3],
      rules: [
        "No smoking",
        "No loud music after 10 PM",
        "Visitors allowed till 9 PM",
        "Keep common areas clean",
      ],
      description: `Safe and comfortable student accommodation near universities. ${amenities.cctv ? "CCTV surveillance." : ""} ${amenities.wifi ? "High-speed WiFi." : ""} Ideal for students.`,
      created_at: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

function generateRoommateProfiles(count = 20) {
  const courses = [
    "Computer Science",
    "Mechanical Engineering",
    "Business Administration",
    "Psychology",
    "Medicine",
    "Architecture",
  ];
  const universities = ["Pune University", "COEP", "VIT", "Symbiosis", "MIT"];
  const sleep = ["Early Riser", "Night Owl", "Flexible"];
  const clean = ["Very Clean", "Moderately Clean", "Relaxed"];
  const social = ["Social Butterfly", "Balanced", "Quiet Time"];
  const study = ["Library Goer", "Room Studier", "Group Studier"];
  const lifestyle = ["Party Person", "Occasional", "Homebody"];
  const interestsPool = [
    "Reading", "Coding", "Gaming", "Sports", "Music", "Movies",
    "Cooking", "Travel", "Photography", "Art", "Fitness",
  ];
  const names = [
    "Rahul", "Priya", "Arjun", "Ananya", "Vikram", "Sneha", "Karan", "Isha",
    "Aditya", "Neha", "Rohan", "Kavya", "Siddharth", "Diya", "Aarav", "Meera",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `roommate_${i + 1}`,
    user_id: `user_rm_${i + 1}`,
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
    looking_for: {
      genderPreference: ["Same Gender", "Any"][i % 2],
      budgetRange: { min: 5000 + i * 200, max: 15000 + i * 500 },
      preferredLocations: ["Pune", "Mumbai", "Bangalore"].slice(0, 1 + (i % 3)),
    },
    created_at: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  }));
}

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (!url || !key) {
    console.error("❌ Missing env vars. Add to .env or .env.local:");
    console.error("   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co");
    console.error("   SUPABASE_SERVICE_ROLE_KEY=eyJ... (recommended - bypasses RLS, from Supabase Dashboard > Settings > API)");
    console.error("   Or NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...");
    process.exit(1);
  }

  if (serviceKey) {
    console.log("Using service role key (bypasses RLS)");
  } else if (!anonKey.startsWith("ey")) {
    console.warn("⚠️  Supabase keys usually start with 'ey'.");
  }

  const supabase = createClient(url, key);
  const wardenId = "warden_demo";

  try {
    const listings = generateListings(wardenId, 15);
    const roommateProfiles = generateRoommateProfiles(20);

    const { error: listingsErr } = await supabase.from("listings").upsert(listings, {
      onConflict: "id",
    });
    if (listingsErr) {
      if (listingsErr.message?.includes("Could not find the table")) {
        console.error("❌ Tables don't exist. Run the schema first:");
        console.error("   1. npm run db:schema  (prints SQL)");
        console.error("   2. Copy output → Supabase Dashboard > SQL Editor > Run");
      } else if (listingsErr.message?.includes("row-level security")) {
        console.error("❌ RLS policy error. Use the service role key for seeding:");
        console.error("   Add SUPABASE_SERVICE_ROLE_KEY to .env (from Supabase Dashboard > Settings > API)");
        console.error("   Or run supabase/migrations/002_fix_rls_policies.sql in SQL Editor");
      } else {
        console.error("❌ Listings insert failed:", listingsErr.message);
      }
      process.exit(1);
    }
    console.log(`✅ Inserted ${listings.length} listings`);

    const { error: roommatesErr } = await supabase
      .from("roommate_profiles")
      .upsert(roommateProfiles, { onConflict: "id" });
    if (roommatesErr) {
      console.error("❌ Roommate profiles insert failed:", roommatesErr.message);
      process.exit(1);
    }
    console.log(`✅ Inserted ${roommateProfiles.length} roommate profiles`);

    console.log("✅ Database seeded successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
