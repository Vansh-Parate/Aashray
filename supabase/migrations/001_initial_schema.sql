-- AASHRAY: Run this in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/_/sql/new

CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  warder_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PG', 'Hostel', 'Apartment')),
  location JSONB NOT NULL,
  pricing JSONB NOT NULL,
  amenities JSONB NOT NULL,
  safety_score INTEGER NOT NULL,
  images JSONB NOT NULL DEFAULT '[]',
  occupancy JSONB NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Co-ed')),
  rules JSONB NOT NULL DEFAULT '[]',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roommate_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  course TEXT NOT NULL,
  university TEXT NOT NULL,
  habits JSONB NOT NULL,
  interests JSONB NOT NULL DEFAULT '[]',
  bio TEXT,
  looking_for JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public insert listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public update listings" ON public.listings;
CREATE POLICY "Allow public read listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow public insert listings" ON public.listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update listings" ON public.listings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read roommate_profiles" ON public.roommate_profiles;
DROP POLICY IF EXISTS "Allow public insert roommate_profiles" ON public.roommate_profiles;
DROP POLICY IF EXISTS "Allow public update roommate_profiles" ON public.roommate_profiles;
CREATE POLICY "Allow public read roommate_profiles" ON public.roommate_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert roommate_profiles" ON public.roommate_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update roommate_profiles" ON public.roommate_profiles FOR UPDATE USING (true);
