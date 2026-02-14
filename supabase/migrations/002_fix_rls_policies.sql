-- Add UPDATE policies for upsert (run in Supabase SQL Editor if seed still fails with RLS)
-- Or add SUPABASE_SERVICE_ROLE_KEY to .env and use that for seeding instead

DROP POLICY IF EXISTS "Allow public update listings" ON public.listings;
CREATE POLICY "Allow public update listings" ON public.listings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public update roommate_profiles" ON public.roommate_profiles;
CREATE POLICY "Allow public update roommate_profiles" ON public.roommate_profiles FOR UPDATE USING (true);
