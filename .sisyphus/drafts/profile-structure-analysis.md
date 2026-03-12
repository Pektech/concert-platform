# Profile Structure Analysis

## Current Components
Header section - Displays user name, avatar, follow button
Stats section - Shows reviews, concerts counts in grid format  
Reviews section - Lists user's reviews in cards
Navigation - Links to followers, following sections

## Functionality to Preserve
Auth/session handling with currentUserId
Follow/unfollow functionality 
User stats calculations and display  
Reviews display with pagination
All navigation links and routing

## Sections for Visual Enhancement
User header/title area - Apply neon typography effects
Stat cards - Transform to retro digital readout style
Reviews card - Apply synthwave glow effects
Background container - Add perspective grid pattern

## Data Flow Preservation Points
Data fetching from prisma calls - Keep exactly as is
Conditional rendering for auth state - Keep as is
Navigation logic to followers/following - Keep as is
Follow button state management - Keep as is

---

## DETAILED FUNCTIONALITY ANALYSIS

### 1. Authentication & Session Handling

**File**: `src/app/profile/[id]/page.tsx`

**Auth Pattern**:
```typescript
const session = await auth();
const currentUserId = session?.user?.id;
```

**Key Points**:
- Uses `auth()` function imported from `@/lib/auth`
- Session is retrieved at top of server component
- `currentUserId` is optional (undefined if not logged in)
- Used for:
  - Checking if viewer owns the profile (`isOwnProfile`)
  - Determining follow button visibility
  - Checking existing follow relationship

**Auth Source** (`src/lib/auth.ts`):
- NextAuth with credentials provider
- JWT-based sessions
- User ID stored in token and passed to session
- SignIn page at `/login`

---

### 2. Data Fetching (Prisma Queries)

**Main User Query** (lines 40-68):
```typescript
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    reviews: { select: { id: true } },
    concerts: { select: { id: true } },
    followers: {
      where: { followerId: currentUserId },
      select: { id: true },
    },
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  },
});
```

**What's Fetched**:
- User profile data (id, name, email, role, createdAt)
- Reviews array (ids only for counting)
- Concerts array (ids only for counting)
- Followers filtered by current user (to check if already following)
- _count aggregate for followers and following totals

**Metadata Query** (lines 18-21):
- Separate query for SEO metadata generation
- Selects only name and email

**Static Params Generation** (lines 222-228):
```typescript
const users = await prisma.user.findMany({
  select: { id: true },
});
```

---

### 3. User Stats Calculations

**Derived Statistics** (lines 74-78):
```typescript
const reviewCount = user.reviews.length;
const concertsCount = user.concerts.length;
const isFollowing = user.followers.length > 0;
const isOwnProfile = currentUserId === id;
```

**Join Date Formatting** (lines 79-83):
```typescript
const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});
```

**Stat Display Locations**:
1. **Header Stats** (lines 117-119):
   - Followers count (link to `/profile/${id}/followers`)
   - Following count (link to `/profile/${id}/following`)

2. **Stat Cards Grid** (lines 137-142):
   - Reviews count with 🎵 icon
   - Concerts count with 🎸 icon

3. **Profile Statistics Section** (lines 148-179):
   - Total Reviews with ✍️ icon (detailed card)
   - Tracked Concerts with 🎪 icon (detailed card)

---

### 4. Reviews Display Logic

**Component**: `UserReviewsList` (line 181)
```typescript
<UserReviewsList userId={user.id} />
```

**Empty State** (lines 183-200):
- Shows when `reviewCount === 0 && concertsCount === 0`
- Displays 🎭 emoji
- "No Activity Yet" message
- "Explore Concerts" CTA button linking to `/`

**Review Component Location**: `src/components/user-reviews-list.tsx`
- Handles fetching and displaying user's reviews
- Separate component for modularity

---

### 5. Navigation & Routing

**Navigation Links**:

1. **Back to Home** (lines 87-94):
```typescript
<Link href="/" className="...">
  Back to Home
</Link>
```

2. **Followers Link** (line 117):
```typescript
<Link href={`/profile/${id}/followers`}>
  {user._count.followers} followers
</Link>
```

3. **Following Link** (line 118):
```typescript
<Link href={`/profile/${id}/following`}>
  {user._count.following} following
</Link>
```

4. **Explore Concerts CTA** (lines 191-199):
- Empty state button linking to `/`

**Related Pages**:
- `/profile/[id]/followers` - Shows list of followers
- `/profile/[id]/following` - Shows list of following users

---

### 6. Follow Button Integration

**Component Import** (line 9):
```typescript
import { FollowButton } from "@/components/follow-button";
```

**Usage** (lines 120-126):
```typescript
{!isOwnProfile && currentUserId && (
  <FollowButton
    userId={id}
    initialFollowing={isFollowing}
    currentUserId={currentUserId}
  />
)}
```

**Conditional Rendering**:
- Hidden if viewing own profile (`isOwnProfile`)
- Hidden if not logged in (`!currentUserId`)
- Shown only for other users' profiles when authenticated

**FollowButton Component Props** (`src/components/follow-button.tsx`):
- `userId`: Target user to follow/unfollow
- `initialFollowing`: Boolean for current follow state
- `currentUserId`: Authenticated viewer's ID
- `isOwnProfile`: Optional override
- `onFollowToggle`: Optional callback
- `size`, `variant`: Styling options

**FollowButton Behavior**:
- Stateful client component (`useState`)
- Makes POST request to `/api/users/${userId}/follow`
- Optimistic UI updates
- Toast notifications on error
- Icon changes: UserPlus (follow) / UserCheck (following)
- Hover effect shows "Unfollow" when following

---

## PAGE STRUCTURE BREAKDOWN

### Section 1: Background Container (lines 84-205)
```typescript
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
```
- Dark gradient background (slate-900 → purple-900 → slate-900)
- Padding: py-12, px-6

### Section 2: Main Content Wrapper (line 85)
```typescript
<div className="max-w-3xl mx-auto space-y-8">
```
- Max width: 3xl (768px)
- Centered with auto margins
- Vertical spacing between children: space-y-8

### Section 3: Back Button (lines 86-94)
- Simple link with arrow icon
- Purple text with hover effect

### Section 4: User Info Card (lines 96-144)
- Card with gradient background overlay
- Avatar circle with gradient and initial
- User name (h1)
- Role badge
- Join date
- Followers/Following links
- Follow button (conditional)
- Stats grid (2 columns)

### Section 5: Profile Statistics Card (lines 148-179)
- Separate card for detailed stats
- Two stat items with icons and descriptions
- Hover effects on stat rows

### Section 6: User Reviews List (line 181)
- External component
- Displays all user reviews

### Section 7: Empty State Card (lines 183-200)
- Conditional render
- Shown when no activity
- CTA button to explore

### Section 8: StatCard Helper Component (lines 208-219)
```typescript
function StatCard({ icon, label, value, delay })
```
- Reusable component for stat display
- Animation delay prop
- Hover effects

---

## VISUAL ELEMENTS REQUIRING 80s STYLING UPDATES

### Priority 1: Background & Container
- Current: Dark gradient (slate/purple)
- Target: Synthwave grid pattern, neon glow effects

### Priority 2: User Avatar & Header
- Current: Purple/pink gradient circle
- Target: Neon-rimmed avatar, retro wave sun backdrop

### Priority 3: Stat Cards
- Current: Simple grid with emoji icons
- Target: Digital readout style, LED/vacuum tube aesthetic

### Priority 4: Typography
- Current: White text with purple accents
- Target: Neon glow text, retro fonts, cyan/magenta color scheme

### Priority 5: Cards & Containers
- Current: Translucent white/5 with blur
- Target: Wireframe grids, CRT scanline effects, glow borders

### Priority 6: Buttons & Interactive Elements
- Current: Gradient purple/pink buttons
- Target: Neon-outlined buttons, arcade-style hover effects

---

## PRESERVATION CHECKLIST

✅ **Must Not Change**:
- [x] `auth()` call and session handling logic
- [x] Prisma query structure and included relations
- [x] Stats calculation logic (reviewCount, concertsCount, etc.)
- [x] Conditional rendering for follow button
- [x] Navigation href paths
- [x] Component props and data flow
- [x] `generateMetadata` function
- [x] `generateStaticParams` function
- [x] Error handling (notFound for missing users)

✅ **Can Modify (Visual Only)**:
- [x] CSS classes and Tailwind utilities
- [x] Color schemes and gradients
- [x] Icons and emojis (can be enhanced)
- [x] Card styling and borders
- [x] Animation effects
- [x] Background patterns

---

## RELATED FILES

**Direct Dependencies**:
- `src/lib/auth.ts` - Authentication
- `src/lib/prisma.ts` - Database client
- `src/components/follow-button.tsx` - Follow functionality
- `src/components/user-reviews-list.tsx` - Reviews display
- `src/components/ui/card.tsx` - Card component
- `src/components/ui/badge.tsx` - Badge component

**Related Pages**:
- `src/app/profile/[id]/followers/page.tsx`
- `src/app/profile/[id]/following/page.tsx`
- `src/app/profile/page.tsx` (own profile redirect)

**API Endpoints**:
- `/api/users/[id]/follow` - Follow/unfollow action

---

*Analysis completed: Profile page structure fully documented for 80s retro visual enhancement while preserving all functionality.*
