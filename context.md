# AASHRAY - Safe Student Housing Marketplace
## Comprehensive Implementation Prompt for Cursor AI

---

## 🎯 Project Overview

Build a **Safe Student Housing Discovery & Management Platform** called **AASHRAY** that connects students with verified, safe housing options while providing owners/wardens with occupancy and rent management tools.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui + Aceternity UI
- **Authentication**: Supabase Auth (Role-based: Student/Warden)
- **Data Storage**: Local Storage (primary) + Supabase for auth
- **State Management**: React Context API + Local Storage sync

---

## 🎨 Design System

### Color Palette (Natural Warm Minimalist Theme)
```css
/* Primary Colors */
--primary: #D4A574 (warm sand)
--primary-light: #E8C9A0
--primary-dark: #B8865A

/* Neutral Colors */
--background: #FEFDFB (warm white)
--surface: #F7F4F0 (light cream)
--surface-dark: #E8E3DC

/* Text Colors */
--text-primary: #3E3530 (warm charcoal)
--text-secondary: #6B615B
--text-muted: #9B918A

/* Accent Colors */
--accent-success: #7A9B76 (sage green)
--accent-warning: #D89B6A (terracotta)
--accent-danger: #C77567 (dusty rose)

/* Safety Score Colors */
--safety-high: #7A9B76
--safety-medium: #D4A574
--safety-low: #C77567
```

### Typography
- **Headings**: Inter (font-semibold to font-bold)
- **Body**: Inter (font-normal to font-medium)
- **Accent**: Outfit (for hero text)

### Design Principles
- Spacious layouts with generous padding
- Soft shadows and rounded corners (rounded-2xl to rounded-3xl)
- Subtle hover states with scale transformations
- Natural transitions (ease-in-out)
- Mobile-first responsive design

---

## 📁 Project Structure

```
aashray/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (student)/
│   │   ├── discover/
│   │   │   └── page.tsx
│   │   ├── listing/[id]/
│   │   │   └── page.tsx
│   │   ├── roommate-matcher/
│   │   │   └── page.tsx
│   │   └── my-bookings/
│   │       └── page.tsx
│   ├── (warden)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── occupancy/
│   │   │   └── page.tsx
│   │   ├── rent-tracker/
│   │   │   └── page.tsx
│   │   └── add-listing/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx (Landing Page)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SafetyFeatures.tsx
│   │   └── CTA.tsx
│   ├── student/
│   │   ├── MapView.tsx
│   │   ├── ListingCard.tsx
│   │   ├── SafetyScorecard.tsx
│   │   ├── VirtualTourSlider.tsx
│   │   ├── RoommateCard.tsx
│   │   ├── RoommateSwiper.tsx
│   │   └── FilterPanel.tsx
│   ├── warden/
│   │   ├── OccupancyGrid.tsx
│   │   ├── RentTrackerTable.tsx
│   │   ├── ListingForm.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── RoleSelector.tsx
│   │   └── NotificationBadge.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── auth.ts
│   ├── storage/
│   │   ├── listings.ts
│   │   ├── roommates.ts
│   │   ├── occupancy.ts
│   │   └── rent.ts
│   ├── utils/
│   │   ├── safety-calculator.ts
│   │   ├── matcher-algorithm.ts
│   │   └── notifications.ts
│   └── constants/
│       ├── mock-data.ts
│       └── amenities.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useListings.ts
│   ├── useOccupancy.ts
│   └── useNotifications.ts
├── types/
│   └── index.ts
└── contexts/
    ├── AuthContext.tsx
    ├── ListingContext.tsx
    └── NotificationContext.tsx
```

---

## 🔐 Supabase Setup

### Authentication Configuration

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// User roles stored in user_metadata
export type UserRole = 'student' | 'warden'
```

### Auth Flow
1. Sign up with email/password + role selection
2. Store role in Supabase user metadata
3. Create user profile in local storage with additional fields
4. Redirect based on role (student → /discover, warden → /dashboard)

---

## 📦 Data Models (Local Storage)

### Listing Model
```typescript
interface Listing {
  id: string
  warderId: string
  title: string
  type: 'PG' | 'Hostel' | 'Apartment'
  location: {
    address: string
    city: string
    coordinates: { lat: number; lng: number }
  }
  pricing: {
    rent: number
    deposit: number
    currency: 'INR'
  }
  amenities: {
    cctv: boolean
    securityGuard: boolean
    biometrics: boolean
    wifi: boolean
    meals: boolean
    laundry: boolean
    parking: boolean
    gym: boolean
  }
  safetyScore: number // Auto-calculated (0-100)
  images: string[] // URLs
  occupancy: {
    total: number
    occupied: number
    available: number
  }
  gender: 'Male' | 'Female' | 'Co-ed'
  rules: string[]
  description: string
  createdAt: string
  updatedAt: string
}
```

### Roommate Profile Model
```typescript
interface RoommateProfile {
  id: string
  userId: string
  name: string // Anonymous display name
  age: number
  course: string
  university: string
  habits: {
    sleepSchedule: 'Early Riser' | 'Night Owl' | 'Flexible'
    cleanliness: 'Very Clean' | 'Moderately Clean' | 'Relaxed'
    socialPreference: 'Social Butterfly' | 'Balanced' | 'Quiet Time'
    studyStyle: 'Library Goer' | 'Room Studier' | 'Group Studier'
    lifestyle: 'Party Person' | 'Occasional' | 'Homebody'
  }
  interests: string[]
  bio: string
  lookingFor: {
    genderPreference: 'Same Gender' | 'Any' | 'Female' | 'Male'
    budgetRange: { min: number; max: number }
    preferredLocations: string[]
  }
  matchScore?: number // Calculated during matching
  createdAt: string
}
```

### Occupancy Model
```typescript
interface OccupancyGrid {
  listingId: string
  rooms: {
    roomNumber: string
    beds: {
      bedNumber: string
      status: 'Empty' | 'Occupied' | 'Reserved'
      tenantId?: string
      tenantName?: string
    }[]
  }[]
  updatedAt: string
}
```

### Rent Tracker Model
```typescript
interface RentRecord {
  id: string
  listingId: string
  tenantId: string
  tenantName: string
  roomNumber: string
  bedNumber: string
  amount: number
  dueDate: string
  paidDate?: string
  status: 'Pending' | 'Paid' | 'Overdue'
  month: string // 'YYYY-MM'
  notificationSent: boolean
}
```

---

## 🎨 Component Implementation Guide

### 1. Landing Page (`app/page.tsx`)

**Hero Section**:
- Animated headline with Framer Motion fade-in
- Split view: Left = Students, Right = Wardens
- Floating cards with hover effects
- CTA buttons with role routing

```tsx
// Hero.tsx structure
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="min-h-screen flex items-center"
>
  <div className="grid md:grid-cols-2 gap-12">
    {/* Student Side */}
    <motion.div whileHover={{ scale: 1.02 }}>
      <h2>Find Your Safe Haven</h2>
      <ul>Safety-verified listings, Roommate matching, Virtual tours</ul>
      <Button href="/signup?role=student">Get Started as Student</Button>
    </motion.div>
    
    {/* Warden Side */}
    <motion.div whileHover={{ scale: 1.02 }}>
      <h2>Manage with Ease</h2>
      <ul>Occupancy tracking, Rent management, Safety analytics</ul>
      <Button href="/signup?role=warden">Join as Owner/Warden</Button>
    </motion.div>
  </div>
</motion.div>
```

**Features Section**:
- Grid of feature cards with icons (Lucide React)
- Aceternity UI's "Bento Grid" component
- Smooth scroll animations

**How It Works**:
- Timeline component with step-by-step flow
- Different flows for students vs wardens
- Animated path connecting steps

**Safety Features Highlight**:
- Visual safety score breakdown
- Animated percentage circles
- Real amenity examples

---

### 2. Student Discovery Page (`app/(student)/discover/page.tsx`)

**Layout**: Split view - Map (60%) + List (40%)

**Map Component** (`components/student/MapView.tsx`):
```tsx
// Use a simple mock map with pinned locations
// Libraries: react-map-gl (optional) or custom SVG map
- Display listing pins with price tags
- Color-coded by safety score
- Click pin → highlight corresponding card
- Smooth pan/zoom (Framer Motion)
```

**Listing Card** (`components/student/ListingCard.tsx`):
```tsx
<motion.div 
  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
  className="bg-surface rounded-3xl overflow-hidden"
>
  <ImageCarousel images={listing.images} />
  
  <div className="p-6">
    <div className="flex justify-between items-start">
      <h3>{listing.title}</h3>
      <SafetyBadge score={listing.safetyScore} />
    </div>
    
    <LocationBadge>{listing.location.city}</LocationBadge>
    
    <div className="flex justify-between mt-4">
      <PriceTag>₹{listing.pricing.rent}/month</PriceTag>
      <AvailabilityBadge>{listing.occupancy.available} beds</AvailabilityBadge>
    </div>
    
    <AmenitiesGrid amenities={listing.amenities} limit={4} />
    
    <Button onClick={() => router.push(`/listing/${listing.id}`)}>
      View Details
    </Button>
  </div>
</motion.div>
```

**Filter Panel** (`components/student/FilterPanel.tsx`):
```tsx
<Sheet> {/* shadcn Sheet */}
  <Filters>
    - Price range slider (shadcn Slider)
    - Gender preference (Radio)
    - Amenities checklist (Checkbox)
    - Safety score minimum (Slider)
    - Availability filter (Select)
  </Filters>
  
  <Button onClick={applyFilters}>Apply Filters</Button>
</Sheet>
```

---

### 3. Listing Detail Page (`app/(student)/listing/[id]/page.tsx`)

**Image Slider** (`components/student/VirtualTourSlider.tsx`):
```tsx
// Aceternity UI's Image Slider or custom with Framer Motion
<AnimatePresence mode="wait">
  <motion.img
    key={currentImage}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    src={images[currentIndex]}
    className="w-full h-96 object-cover rounded-2xl"
  />
</AnimatePresence>

{/* Thumbnail navigation */}
<div className="flex gap-2 mt-4">
  {images.map((img, i) => (
    <img 
      key={i}
      src={img}
      onClick={() => setCurrentIndex(i)}
      className={cn(
        "w-20 h-20 rounded-lg cursor-pointer transition",
        i === currentIndex && "ring-2 ring-primary"
      )}
    />
  ))}
</div>
```

**Safety Scorecard** (`components/student/SafetyScorecard.tsx`):
```tsx
<Card className="p-6">
  <h3>Safety Score</h3>
  
  {/* Circular progress */}
  <div className="relative w-32 h-32 mx-auto">
    <svg className="transform -rotate-90">
      <circle /* background */ />
      <motion.circle
        /* animated stroke based on score */
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-3xl font-bold">{score}</span>
    </div>
  </div>
  
  {/* Breakdown */}
  <div className="space-y-3 mt-6">
    {safetyFeatures.map(feature => (
      <div className="flex justify-between items-center">
        <span>{feature.label}</span>
        <Badge variant={feature.active ? "success" : "default"}>
          {feature.active ? "✓" : "✗"}
        </Badge>
      </div>
    ))}
  </div>
</Card>
```

**Safety Score Calculation Logic** (`lib/utils/safety-calculator.ts`):
```typescript
export function calculateSafetyScore(amenities: Listing['amenities']): number {
  let score = 0
  
  // Weighted scoring
  if (amenities.cctv) score += 30
  if (amenities.securityGuard) score += 30
  if (amenities.biometrics) score += 25
  if (amenities.wifi) score += 5
  if (amenities.parking) score += 5
  if (amenities.gym) score += 5
  
  return Math.min(score, 100)
}

// Color mapping
export function getSafetyColor(score: number): string {
  if (score >= 75) return 'var(--safety-high)'
  if (score >= 50) return 'var(--safety-medium)'
  return 'var(--safety-low)'
}

export function getSafetyLabel(score: number): string {
  if (score >= 75) return 'Highly Safe'
  if (score >= 50) return 'Moderately Safe'
  return 'Basic Safety'
}
```

---

### 4. Roommate Matcher (`app/(student)/roommate-matcher/page.tsx`)

**Swipe Interface** (`components/student/RoommateSwiper.tsx`):
```tsx
// Tinder-style card swiper using Framer Motion
const [currentIndex, setCurrentIndex] = useState(0)
const [direction, setDirection] = useState<'left' | 'right' | null>(null)

<div className="relative h-[600px]">
  <AnimatePresence>
    {profiles.slice(currentIndex, currentIndex + 3).map((profile, i) => (
      <motion.div
        key={profile.id}
        drag={i === 0 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = Math.abs(offset.x) > 100
          
          if (swipe) {
            if (offset.x > 0) {
              handleLike(profile)
              setDirection('right')
            } else {
              handleSkip(profile)
              setDirection('left')
            }
            setCurrentIndex(prev => prev + 1)
          }
        }}
        initial={{ scale: 1 - i * 0.05, y: i * 20 }}
        animate={{ scale: 1 - i * 0.05, y: i * 20 }}
        exit={{
          x: direction === 'right' ? 300 : -300,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        className="absolute inset-0"
      >
        <RoommateCard profile={profile} />
      </motion.div>
    ))}
  </AnimatePresence>
  
  {/* Action buttons */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-6">
    <Button
      variant="outline"
      size="lg"
      className="rounded-full w-16 h-16"
      onClick={() => handleSkip(profiles[currentIndex])}
    >
      ✗
    </Button>
    <Button
      size="lg"
      className="rounded-full w-16 h-16"
      onClick={() => handleLike(profiles[currentIndex])}
    >
      ♥
    </Button>
  </div>
</div>
```

**Roommate Card** (`components/student/RoommateCard.tsx`):
```tsx
<Card className="p-8 h-full">
  <Avatar size="xl" className="mx-auto mb-4" />
  
  <h2 className="text-center text-2xl font-bold">{profile.name}</h2>
  <p className="text-center text-muted">{profile.course} • {profile.university}</p>
  
  <div className="mt-6 space-y-4">
    <HabitBadge icon="🌅" label="Sleep Schedule" value={profile.habits.sleepSchedule} />
    <HabitBadge icon="✨" label="Cleanliness" value={profile.habits.cleanliness} />
    <HabitBadge icon="🎉" label="Social Life" value={profile.habits.socialPreference} />
    <HabitBadge icon="📚" label="Study Style" value={profile.habits.studyStyle} />
    <HabitBadge icon="🎊" label="Lifestyle" value={profile.habits.lifestyle} />
  </div>
  
  <Separator className="my-6" />
  
  <div>
    <h4 className="font-semibold mb-2">Interests</h4>
    <div className="flex flex-wrap gap-2">
      {profile.interests.map(interest => (
        <Badge key={interest} variant="secondary">{interest}</Badge>
      ))}
    </div>
  </div>
  
  <p className="mt-6 text-sm text-muted">{profile.bio}</p>
</Card>
```

**Matching Algorithm** (`lib/utils/matcher-algorithm.ts`):
```typescript
export function calculateMatchScore(
  userProfile: RoommateProfile,
  candidateProfile: RoommateProfile
): number {
  let score = 0
  const weights = {
    sleepSchedule: 25,
    cleanliness: 20,
    socialPreference: 15,
    studyStyle: 15,
    lifestyle: 15,
    interests: 10
  }
  
  // Sleep schedule compatibility
  if (userProfile.habits.sleepSchedule === candidateProfile.habits.sleepSchedule) {
    score += weights.sleepSchedule
  } else if (
    userProfile.habits.sleepSchedule === 'Flexible' ||
    candidateProfile.habits.sleepSchedule === 'Flexible'
  ) {
    score += weights.sleepSchedule * 0.5
  }
  
  // Cleanliness compatibility
  const cleanlinessLevels = ['Relaxed', 'Moderately Clean', 'Very Clean']
  const userCleanIndex = cleanlinessLevels.indexOf(userProfile.habits.cleanliness)
  const candidateCleanIndex = cleanlinessLevels.indexOf(candidateProfile.habits.cleanliness)
  const cleanDiff = Math.abs(userCleanIndex - candidateCleanIndex)
  score += weights.cleanliness * (1 - cleanDiff / 2)
  
  // Social preference compatibility
  if (userProfile.habits.socialPreference === candidateProfile.habits.socialPreference) {
    score += weights.socialPreference
  } else if (
    userProfile.habits.socialPreference === 'Balanced' ||
    candidateProfile.habits.socialPreference === 'Balanced'
  ) {
    score += weights.socialPreference * 0.7
  }
  
  // Study style compatibility
  if (userProfile.habits.studyStyle === candidateProfile.habits.studyStyle) {
    score += weights.studyStyle
  }
  
  // Lifestyle compatibility
  const lifestyleLevels = ['Homebody', 'Occasional', 'Party Person']
  const userLifeIndex = lifestyleLevels.indexOf(userProfile.habits.lifestyle)
  const candidateLifeIndex = lifestyleLevels.indexOf(candidateProfile.habits.lifestyle)
  const lifeDiff = Math.abs(userLifeIndex - candidateLifeIndex)
  score += weights.lifestyle * (1 - lifeDiff / 2)
  
  // Common interests
  const commonInterests = userProfile.interests.filter(interest =>
    candidateProfile.interests.includes(interest)
  )
  score += (commonInterests.length / Math.max(userProfile.interests.length, 1)) * weights.interests
  
  return Math.round(score)
}
```

---

### 5. Warden Dashboard (`app/(warden)/dashboard/page.tsx`)

**Dashboard Layout**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {/* Stats Cards */}
  <StatCard
    title="Total Listings"
    value={listings.length}
    icon={<Building />}
    trend="+2 this month"
  />
  <StatCard
    title="Total Beds"
    value={totalBeds}
    icon={<Bed />}
  />
  <StatCard
    title="Occupied"
    value={occupiedBeds}
    icon={<Users />}
    percentage={(occupiedBeds / totalBeds) * 100}
  />
  <StatCard
    title="Rent Collected"
    value={`₹${collectedRent}`}
    icon={<IndianRupee />}
    trend="+12% vs last month"
  />
</div>

{/* Quick Actions */}
<div className="grid md:grid-cols-3 gap-6 mt-8">
  <QuickActionCard
    title="Add New Listing"
    icon={<Plus />}
    href="/warden/add-listing"
  />
  <QuickActionCard
    title="Manage Occupancy"
    icon={<Grid3x3 />}
    href="/warden/occupancy"
  />
  <QuickActionCard
    title="Track Rent"
    icon={<Receipt />}
    href="/warden/rent-tracker"
  />
</div>

{/* Recent Activity */}
<Card className="mt-8">
  <CardHeader>
    <h3>Recent Activity</h3>
  </CardHeader>
  <CardContent>
    <ActivityTimeline activities={recentActivities} />
  </CardContent>
</Card>
```

---

### 6. Occupancy Grid (`app/(warden)/occupancy/page.tsx`)

**Grid Component** (`components/warden/OccupancyGrid.tsx`):
```tsx
<div className="space-y-8">
  <Select onValueChange={setSelectedListing}>
    <SelectTrigger>
      <SelectValue placeholder="Select Listing" />
    </SelectTrigger>
    <SelectContent>
      {listings.map(listing => (
        <SelectItem key={listing.id} value={listing.id}>
          {listing.title}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  
  {selectedListing && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {occupancyData.rooms.map(room => (
        <Card key={room.roomNumber} className="mb-6">
          <CardHeader>
            <h4>Room {room.roomNumber}</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {room.beds.map(bed => (
                <motion.div
                  key={bed.bedNumber}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleBedClick(bed)}
                  className={cn(
                    "p-6 rounded-2xl cursor-pointer transition-all",
                    bed.status === 'Empty' && "bg-safety-high text-white",
                    bed.status === 'Occupied' && "bg-accent-danger text-white",
                    bed.status === 'Reserved' && "bg-accent-warning text-white"
                  )}
                >
                  <div className="flex flex-col items-center">
                    <Bed className="w-8 h-8 mb-2" />
                    <p className="font-semibold">Bed {bed.bedNumber}</p>
                    <Badge variant="secondary" className="mt-2">
                      {bed.status}
                    </Badge>
                    {bed.tenantName && (
                      <p className="text-sm mt-2">{bed.tenantName}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )}
</div>

{/* Bed Management Dialog */}
<Dialog open={selectedBed !== null} onOpenChange={closeDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Manage Bed {selectedBed?.bedNumber}</DialogTitle>
    </DialogHeader>
    
    <Select 
      value={selectedBed?.status} 
      onValueChange={updateBedStatus}
    >
      <SelectItem value="Empty">Mark as Empty</SelectItem>
      <SelectItem value="Occupied">Mark as Occupied</SelectItem>
      <SelectItem value="Reserved">Mark as Reserved</SelectItem>
    </Select>
    
    {selectedBed?.status !== 'Empty' && (
      <Input
        placeholder="Tenant Name"
        value={selectedBed?.tenantName || ''}
        onChange={(e) => updateTenantName(e.target.value)}
      />
    )}
    
    <DialogFooter>
      <Button onClick={saveBedChanges}>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 7. Rent Tracker (`app/(warden)/rent-tracker/page.tsx`)

**Rent Table** (`components/warden/RentTrackerTable.tsx`):
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <h3>Rent Tracker</h3>
    <div className="flex gap-2">
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectItem value="2025-02">February 2025</SelectItem>
        <SelectItem value="2025-01">January 2025</SelectItem>
        {/* ... */}
      </Select>
      <Button onClick={generateMonthlyRent}>
        <Plus className="w-4 h-4 mr-2" />
        Generate Monthly Rent
      </Button>
    </div>
  </CardHeader>
  
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Room/Bed</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rentRecords.map(record => (
          <TableRow key={record.id}>
            <TableCell className="font-medium">{record.tenantName}</TableCell>
            <TableCell>{record.roomNumber} / {record.bedNumber}</TableCell>
            <TableCell>₹{record.amount}</TableCell>
            <TableCell>{formatDate(record.dueDate)}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  record.status === 'Paid' ? 'success' :
                  record.status === 'Overdue' ? 'destructive' :
                  'default'
                }
              >
                {record.status}
              </Badge>
            </TableCell>
            <TableCell>
              {record.status !== 'Paid' && (
                <Button
                  size="sm"
                  onClick={() => markAsPaid(record)}
                >
                  Mark as Paid
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>

{/* Summary Cards */}
<div className="grid md:grid-cols-3 gap-6 mt-6">
  <Card>
    <CardHeader>
      <h4>Total Expected</h4>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">₹{totalExpected}</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <h4>Collected</h4>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-safety-high">₹{totalCollected}</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <h4>Pending</h4>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-accent-warning">₹{totalPending}</p>
    </CardContent>
  </Card>
</div>
```

**Mark as Paid Logic** (`lib/storage/rent.ts`):
```typescript
export function markRentAsPaid(recordId: string): void {
  const records = getRentRecords()
  const recordIndex = records.findIndex(r => r.id === recordId)
  
  if (recordIndex !== -1) {
    records[recordIndex].status = 'Paid'
    records[recordIndex].paidDate = new Date().toISOString()
    records[recordIndex].notificationSent = false // Reset for sending notification
    
    saveRentRecords(records)
    
    // Trigger notification to student
    sendRentPaidNotification(records[recordIndex])
  }
}

function sendRentPaidNotification(record: RentRecord): void {
  const notifications = getNotifications()
  
  notifications.push({
    id: generateId(),
    userId: record.tenantId,
    type: 'rent_paid',
    title: 'Rent Payment Confirmed',
    message: `Your rent payment of ₹${record.amount} for ${record.month} has been confirmed.`,
    read: false,
    createdAt: new Date().toISOString()
  })
  
  saveNotifications(notifications)
}
```

---

### 8. Add Listing Form (`app/(warden)/add-listing/page.tsx`)

**Multi-Step Form** (`components/warden/ListingForm.tsx`):
```tsx
const [step, setStep] = useState(1)
const [formData, setFormData] = useState<Partial<Listing>>({})

<Card className="max-w-4xl mx-auto">
  <CardHeader>
    <h2>Add New Listing</h2>
    <StepIndicator currentStep={step} totalSteps={4} />
  </CardHeader>
  
  <CardContent>
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Basic Information */}
          <FormField label="Title">
            <Input 
              value={formData.title} 
              onChange={(e) => updateField('title', e.target.value)}
            />
          </FormField>
          
          <FormField label="Type">
            <Select 
              value={formData.type}
              onValueChange={(val) => updateField('type', val)}
            >
              <SelectItem value="PG">PG</SelectItem>
              <SelectItem value="Hostel">Hostel</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
            </Select>
          </FormField>
          
          <FormField label="Address">
            <Textarea 
              value={formData.location?.address}
              onChange={(e) => updateField('location.address', e.target.value)}
            />
          </FormField>
          
          <FormField label="City">
            <Input 
              value={formData.location?.city}
              onChange={(e) => updateField('location.city', e.target.value)}
            />
          </FormField>
        </motion.div>
      )}
      
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Pricing & Occupancy */}
          <FormField label="Monthly Rent">
            <Input 
              type="number"
              value={formData.pricing?.rent}
              onChange={(e) => updateField('pricing.rent', Number(e.target.value))}
            />
          </FormField>
          
          <FormField label="Security Deposit">
            <Input 
              type="number"
              value={formData.pricing?.deposit}
              onChange={(e) => updateField('pricing.deposit', Number(e.target.value))}
            />
          </FormField>
          
          <FormField label="Total Beds">
            <Input 
              type="number"
              value={formData.occupancy?.total}
              onChange={(e) => updateField('occupancy.total', Number(e.target.value))}
            />
          </FormField>
          
          <FormField label="Gender Preference">
            <Select 
              value={formData.gender}
              onValueChange={(val) => updateField('gender', val)}
            >
              <SelectItem value="Male">Male Only</SelectItem>
              <SelectItem value="Female">Female Only</SelectItem>
              <SelectItem value="Co-ed">Co-ed</SelectItem>
            </Select>
          </FormField>
        </motion.div>
      )}
      
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Amenities */}
          <h4 className="font-semibold mb-4">Safety Amenities</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Checkbox
              checked={formData.amenities?.cctv}
              onCheckedChange={(val) => updateField('amenities.cctv', val)}
              label="CCTV Surveillance"
            />
            <Checkbox
              checked={formData.amenities?.securityGuard}
              onCheckedChange={(val) => updateField('amenities.securityGuard', val)}
              label="24/7 Security Guard"
            />
            <Checkbox
              checked={formData.amenities?.biometrics}
              onCheckedChange={(val) => updateField('amenities.biometrics', val)}
              label="Biometric Access"
            />
          </div>
          
          <h4 className="font-semibold mb-4 mt-6">Facilities</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Checkbox
              checked={formData.amenities?.wifi}
              onCheckedChange={(val) => updateField('amenities.wifi', val)}
              label="WiFi"
            />
            <Checkbox
              checked={formData.amenities?.meals}
              onCheckedChange={(val) => updateField('amenities.meals', val)}
              label="Meals Included"
            />
            <Checkbox
              checked={formData.amenities?.laundry}
              onCheckedChange={(val) => updateField('amenities.laundry', val)}
              label="Laundry Service"
            />
            <Checkbox
              checked={formData.amenities?.parking}
              onCheckedChange={(val) => updateField('amenities.parking', val)}
              label="Parking"
            />
            <Checkbox
              checked={formData.amenities?.gym}
              onCheckedChange={(val) => updateField('amenities.gym', val)}
              label="Gym"
            />
          </div>
        </motion.div>
      )}
      
      {step === 4 && (
        <motion.div
          key="step4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Images & Description */}
          <FormField label="Property Images">
            <ImageUploader
              images={formData.images || []}
              onUpload={(urls) => updateField('images', urls)}
              maxImages={8}
            />
          </FormField>
          
          <FormField label="Description">
            <Textarea
              rows={6}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your property, nearby facilities, rules, etc."
            />
          </FormField>
          
          <FormField label="House Rules (Optional)">
            <TagInput
              tags={formData.rules || []}
              onTagsChange={(tags) => updateField('rules', tags)}
              placeholder="Add rule and press Enter"
            />
          </FormField>
        </motion.div>
      )}
    </AnimatePresence>
  </CardContent>
  
  <CardFooter className="flex justify-between">
    {step > 1 && (
      <Button variant="outline" onClick={() => setStep(s => s - 1)}>
        Previous
      </Button>
    )}
    
    {step < 4 ? (
      <Button onClick={() => setStep(s => s + 1)} className="ml-auto">
        Next
      </Button>
    ) : (
      <Button onClick={handleSubmit} className="ml-auto">
        Create Listing
      </Button>
    )}
  </CardFooter>
</Card>
```

---

## 🔔 Notification System

### Notification Component (`components/shared/NotificationBadge.tsx`):
```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-accent-danger text-white text-xs rounded-full flex items-center justify-center"
        >
          {unreadCount}
        </motion.span>
      )}
    </Button>
  </PopoverTrigger>
  
  <PopoverContent className="w-80">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Notifications</h4>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all read
        </Button>
      </div>
      
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <p className="text-center text-muted py-8">No notifications</p>
        ) : (
          notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-lg mb-2 cursor-pointer hover:bg-surface",
                !notif.read && "bg-surface-dark"
              )}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-muted mt-1">{notif.message}</p>
                  <p className="text-xs text-muted mt-2">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </motion.div>
          ))
        )}
      </ScrollArea>
    </div>
  </PopoverContent>
</Popover>
```

### Notification Types:
- **Rent Paid**: Warden marks rent as paid → Student gets notification
- **New Listing Match**: New listing matches student's saved preferences
- **Roommate Match**: High compatibility roommate found
- **Occupancy Alert**: Warden gets alert when occupancy reaches 80%
- **Booking Confirmation**: Student books a bed

---

## 🎯 Local Storage Structure

### Storage Keys:
```typescript
// User data
STORAGE_KEYS = {
  USER_PROFILE: 'aashray_user_profile',
  LISTINGS: 'aashray_listings',
  ROOMMATE_PROFILES: 'aashray_roommate_profiles',
  OCCUPANCY_DATA: 'aashray_occupancy',
  RENT_RECORDS: 'aashray_rent_records',
  NOTIFICATIONS: 'aashray_notifications',
  BOOKINGS: 'aashray_bookings',
  SAVED_LISTINGS: 'aashray_saved_listings',
  FILTERS: 'aashray_filters',
}
```

### Storage Utilities (`lib/storage/index.ts`):
```typescript
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}

// Sync across tabs
export function syncStorageAcrossTabs(key: string, callback: (value: any) => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      callback(JSON.parse(e.newValue))
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}
```

---

## 🎨 Animation Patterns

### Page Transitions:
```typescript
// lib/animations.ts
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const cardHover = {
  rest: { scale: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.03, 
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: { duration: 0.3 }
  }
}

export const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', damping: 20 }
}
```

### Loading States:
```tsx
// Skeleton loaders using Framer Motion
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity }}
  className="bg-surface-dark rounded-2xl h-64"
/>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind Config):
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### Mobile Navigation:
```tsx
// components/shared/Navbar.tsx
<nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <Logo />
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <NavLinks />
        <UserMenu />
      </div>
      
      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <MobileNavLinks />
        </SheetContent>
      </Sheet>
    </div>
  </div>
</nav>
```

---

## 🧪 Mock Data Generation

### Seed Data Script (`lib/constants/mock-data.ts`):
```typescript
import { faker } from '@faker-js/faker'

export function generateMockListings(count: number = 20): Listing[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `listing_${i + 1}`,
    warderId: `warden_${faker.number.int({ min: 1, max: 5 })}`,
    title: `${faker.company.name()} ${faker.helpers.arrayElement(['PG', 'Hostel', 'Residency'])}`,
    type: faker.helpers.arrayElement(['PG', 'Hostel', 'Apartment']),
    location: {
      address: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad']),
      coordinates: {
        lat: faker.location.latitude({ min: 18, max: 19 }),
        lng: faker.location.longitude({ min: 73, max: 74 })
      }
    },
    pricing: {
      rent: faker.number.int({ min: 5000, max: 25000 }),
      deposit: faker.number.int({ min: 10000, max: 50000 }),
      currency: 'INR'
    },
    amenities: {
      cctv: faker.datatype.boolean(),
      securityGuard: faker.datatype.boolean(),
      biometrics: faker.datatype.boolean(),
      wifi: faker.datatype.boolean(),
      meals: faker.datatype.boolean(),
      laundry: faker.datatype.boolean(),
      parking: faker.datatype.boolean(),
      gym: faker.datatype.boolean()
    },
    safetyScore: 0, // Will be calculated
    images: Array.from({ length: 5 }, () => 
      `https://images.unsplash.com/photo-${faker.number.int({ min: 1500000000000, max: 1700000000000 })}`
    ),
    occupancy: {
      total: faker.number.int({ min: 10, max: 50 }),
      occupied: 0, // Will be calculated
      available: 0 // Will be calculated
    },
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Co-ed']),
    rules: [
      'No smoking',
      'No loud music after 10 PM',
      'Visitors allowed till 9 PM',
      'Keep common areas clean'
    ],
    description: faker.lorem.paragraph(3),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  })).map(listing => ({
    ...listing,
    safetyScore: calculateSafetyScore(listing.amenities)
  }))
}

export function generateMockRoommateProfiles(count: number = 50): RoommateProfile[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `roommate_${i + 1}`,
    userId: `user_${i + 1}`,
    name: faker.person.firstName(),
    age: faker.number.int({ min: 18, max: 25 }),
    course: faker.helpers.arrayElement([
      'Computer Science',
      'Mechanical Engineering',
      'Business Administration',
      'Psychology',
      'Medicine',
      'Architecture'
    ]),
    university: faker.helpers.arrayElement([
      'Pune University',
      'COEP',
      'VIT',
      'Symbiosis',
      'MIT'
    ]),
    habits: {
      sleepSchedule: faker.helpers.arrayElement(['Early Riser', 'Night Owl', 'Flexible']),
      cleanliness: faker.helpers.arrayElement(['Very Clean', 'Moderately Clean', 'Relaxed']),
      socialPreference: faker.helpers.arrayElement(['Social Butterfly', 'Balanced', 'Quiet Time']),
      studyStyle: faker.helpers.arrayElement(['Library Goer', 'Room Studier', 'Group Studier']),
      lifestyle: faker.helpers.arrayElement(['Party Person', 'Occasional', 'Homebody'])
    },
    interests: faker.helpers.arrayElements([
      'Reading', 'Coding', 'Gaming', 'Sports', 'Music', 'Movies', 
      'Cooking', 'Travel', 'Photography', 'Art', 'Fitness'
    ], faker.number.int({ min: 3, max: 6 })),
    bio: faker.lorem.sentence(),
    lookingFor: {
      genderPreference: faker.helpers.arrayElement(['Same Gender', 'Any']),
      budgetRange: {
        min: faker.number.int({ min: 5000, max: 10000 }),
        max: faker.number.int({ min: 15000, max: 25000 })
      },
      preferredLocations: faker.helpers.arrayElements(['Pune', 'Mumbai', 'Bangalore'], 2)
    },
    createdAt: faker.date.past().toISOString()
  }))
}

// Initialize storage with mock data
export function seedDatabase() {
  const listings = generateMockListings(20)
  saveToStorage(STORAGE_KEYS.LISTINGS, listings)
  
  const roommateProfiles = generateMockRoommateProfiles(50)
  saveToStorage(STORAGE_KEYS.ROOMMATE_PROFILES, roommateProfiles)
  
  console.log('✅ Database seeded successfully')
}
```

---

## 🚀 Implementation Checklist

### Phase 1: Setup & Authentication (Day 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Tailwind CSS + shadcn/ui
- [ ] Configure Supabase client
- [ ] Implement authentication pages (login/signup)
- [ ] Create role-based routing
- [ ] Setup local storage utilities
- [ ] Generate and seed mock data

### Phase 2: Landing Page (Day 1)
- [ ] Build hero section with animations
- [ ] Create features showcase
- [ ] Add "How It Works" timeline
- [ ] Implement safety features highlight
- [ ] Design CTA sections
- [ ] Make fully responsive

### Phase 3: Student Interface (Day 2-3)
- [ ] Build discovery page with map and listings
- [ ] Implement filter panel
- [ ] Create listing detail page
- [ ] Build safety scorecard component
- [ ] Add virtual tour slider
- [ ] Implement roommate matcher with swipe interface
- [ ] Create roommate profile cards
- [ ] Implement matching algorithm
- [ ] Add saved listings functionality

### Phase 4: Warden Interface (Day 3-4)
- [ ] Build warden dashboard with stats
- [ ] Create occupancy grid with visual bed status
- [ ] Implement bed management dialog
- [ ] Build rent tracker table
- [ ] Add mark as paid functionality
- [ ] Create listing form (multi-step)
- [ ] Implement image upload simulation
- [ ] Add listing management (edit/delete)

### Phase 5: Shared Features (Day 4-5)
- [ ] Implement notification system
- [ ] Add real-time sync between admin and user views
- [ ] Create navbar with role-based navigation
- [ ] Build footer
- [ ] Add loading states and skeletons
- [ ] Implement error handling
- [ ] Add toast notifications

### Phase 6: Polish & Testing (Day 5)
- [ ] Add micro-interactions throughout
- [ ] Optimize animations and transitions
- [ ] Test responsive design on all devices
- [ ] Test all user flows
- [ ] Add accessibility improvements
- [ ] Optimize performance
- [ ] Create demo accounts
- [ ] Add onboarding tooltips

---

## 🎯 Key Features Summary

### Student Features:
✅ Map-based listing discovery
✅ Advanced filtering (price, location, amenities, safety)
✅ Safety scorecard with visual indicators
✅ Virtual tour image slider
✅ Tinder-style roommate matching
✅ Compatibility algorithm
✅ Saved listings
✅ Real-time rent payment notifications
✅ Booking history

### Warden Features:
✅ Dashboard with analytics
✅ Visual occupancy grid (color-coded beds)
✅ Bed status management
✅ Rent tracker with status updates
✅ Mark as paid with instant notification
✅ Multi-step listing form
✅ Image upload
✅ Listing management

### Shared Features:
✅ Role-based authentication (Supabase)
✅ Real-time notification system
✅ Responsive design (mobile-first)
✅ Smooth animations (Framer Motion)
✅ Local storage persistence
✅ Cross-tab synchronization
✅ Natural warm color theme
✅ Minimalist UI/UX

---

## 🎨 UI/UX Best Practices

1. **Consistency**: Use design system tokens for colors, spacing, typography
2. **Feedback**: Always show loading states, success/error messages
3. **Accessibility**: Keyboard navigation, ARIA labels, color contrast
4. **Performance**: Lazy load images, debounce search, optimize re-renders
5. **Mobile-first**: Design for mobile, enhance for desktop
6. **Micro-interactions**: Subtle animations on hover, click, focus
7. **Error handling**: Graceful degradation, helpful error messages
8. **Empty states**: Show helpful messages when no data
9. **Confirmation dialogs**: For destructive actions (delete, mark paid)
10. **Progressive disclosure**: Show advanced features progressively

---

## 🐛 Testing Scenarios

### Student Flow:
1. Sign up as student
2. Browse listings on map
3. Apply filters
4. View listing details
5. Check safety scorecard
6. View virtual tour
7. Save listing
8. Browse roommate profiles
9. Swipe right on compatible match
10. Receive rent notification

### Warden Flow:
1. Sign up as warden
2. View dashboard stats
3. Add new listing (all 4 steps)
4. Manage occupancy grid
5. Mark bed as occupied
6. Generate monthly rent
7. Mark rent as paid
8. Verify student receives notification
9. Edit listing
10. View analytics

---

## 📝 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Getting Started Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed mock data (run once)
npm run seed
```

---

## 🎯 Deliverables

1. ✅ Fully functional web application
2. ✅ Landing page with hero and features
3. ✅ Student discovery and matching interface
4. ✅ Warden management dashboard
5. ✅ Real-time notifications
6. ✅ Responsive design (mobile + desktop)
7. ✅ Smooth animations throughout
8. ✅ Role-based authentication
9. ✅ Local storage persistence
10. ✅ Demo accounts for testing

---

## 💡 Tips for Cursor AI

1. **Start with setup**: Initialize project, install dependencies, configure tools
2. **Build incrementally**: Complete one page/component before moving to next
3. **Test frequently**: Verify each feature works before adding the next
4. **Use mock data**: Generate realistic data for testing
5. **Focus on UX**: Smooth animations, loading states, error handling
6. **Mobile-first**: Build mobile layout first, then adapt for desktop
7. **Reuse components**: Create shared components for consistency
8. **Type safety**: Use TypeScript interfaces for all data models
9. **Performance**: Optimize re-renders, lazy load images, debounce inputs
10. **Documentation**: Add comments for complex logic

---

## 🎨 Design Inspiration

- **Color scheme**: Warm, natural, earthy tones
- **Typography**: Clean, readable, modern
- **Layout**: Spacious, card-based, grid layouts
- **Animations**: Subtle, smooth, purposeful
- **Components**: Rounded corners, soft shadows, hover effects
- **Icons**: Lucide React (consistent, minimal)

---

## ✨ Bonus Features (If Time Permits)

- [ ] Dark mode toggle
- [ ] Export rent reports (PDF)
- [ ] Occupancy analytics charts
- [ ] Student reviews and ratings
- [ ] Chat between student and warden
- [ ] Advanced search with autocomplete
- [ ] Comparison view (compare 2-3 listings)
- [ ] Wishlist with email alerts
- [ ] Virtual tour 360° view
- [ ] Payment integration simulation

---

## 🏁 Final Checklist

- [ ] All pages load correctly
- [ ] Authentication works (login/signup/logout)
- [ ] Role-based routing enforced
- [ ] All CRUD operations functional
- [ ] Safety score calculates correctly
- [ ] Roommate matching works
- [ ] Occupancy grid updates in real-time
- [ ] Rent notifications trigger properly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Animations smooth on all devices
- [ ] No console errors
- [ ] Local storage persists data
- [ ] Cross-tab sync works
- [ ] Error states handled gracefully
- [ ] Loading states implemented

---

## 🎓 Learning Resources

- Next.js 14 Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- shadcn/ui: https://ui.shadcn.com/
- Supabase Auth: https://supabase.com/docs/guides/auth
- Aceternity UI: https://ui.aceternity.com/

---

## 📞 Support

If you encounter any issues during implementation:
1. Check console for errors
2. Verify environment variables
3. Ensure all dependencies installed
4. Check Supabase configuration
5. Review component imports
6. Test in incognito mode (clear cache)

---

## 🎉 Good Luck!

This prompt contains everything needed to build a production-ready AASHRAY platform. Focus on:
- Clean code structure
- Smooth user experience
- Visual polish
- Feature completeness

Remember: **Quality over quantity**. A few well-implemented features are better than many half-finished ones.

Happy coding! 🚀