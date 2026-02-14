# AASHRAY – Safe Student Housing Marketplace

A platform for students to discover safety-verified housing and for wardens/owners to manage occupancy and rent.

## Tech stack

- **Next.js 14** (App Router)
- **Tailwind CSS**, **Framer Motion**
- **shadcn/ui**-style components (Radix UI)
- **Supabase Auth** (optional; app works with local storage if not configured)
- **Local Storage** for listings, roommates, occupancy, rent, notifications

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. (Optional) Copy `.env.local.example` to `.env.local` and add your Supabase URL and anon key if you want auth.

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). Sign up as **Student** or **Warden**. On first visit to **Discover**, mock listings are seeded automatically.

## Features

- **Landing**: Hero, features, how it works, safety score, CTA
- **Auth**: Login / signup with role (student / warden)
- **Student**: Discover (map + list), filters, listing detail, safety scorecard, virtual tour slider, roommate matcher (swipe), my bookings
- **Warden**: Dashboard, occupancy grid, rent tracker (mark paid → student notification), add listing (multi-step form)
- **Shared**: Navbar, notifications, role-based routes

## Scripts

- `npm run dev` – development
- `npm run build` – production build
- `npm run start` – run production build
- `npm run lint` – ESLint

## Data

Listings, roommate profiles, occupancy, rent records, and notifications are stored in **localStorage**. Clearing site data resets the app. Supabase is used only for authentication when env vars are set.
