# Implementation Plan: Review Likes & User Following

**Project:** `/media/richard-leddy/extra/marcus/`  
**Stack:** Next.js 15 App Router + Prisma + PostgreSQL + Tailwind CSS + lucide-react  
**Auth:** NextAuth v5 (`import { auth } from "@/lib/auth"`)  
**React:** 19.2.3 (supports `useOptimistic`)  
**Created:** March 11, 2026

---

## Overview

Two new features for the concert review platform:

1. **Review Likes** — Users can like/unlike reviews (Letterboxd-style, public likes)
2. **User Following** — Users can follow/unfollow other members

Both features include optimistic UI updates, proper authentication, and public visibility.

---

## 1. DATABASE SCHEMA (Prisma)

### File: `prisma/schema.prisma`

```prisma
// ============================================
// EXISTING MODELS (updates marked with // NEW)
// ============================================

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  password  String
  role      String    @default("user")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  reviews   Review[]
  concerts  Concert[] @relation("UserConcerts")
  
  // NEW: Review Likes
  likedReviews ReviewLike[]
  
  // NEW: User Following (self-relation)
  followers  Follow[] @relation("UserFollowers")
  following  Follow[] @relation("UserFollowing")
}

model Review {
  id                String   @id @default(cuid())
  userId            String
  concertId         String
  rating            Int
  title             String?
  text              String?
  setlistHighlights String?
  artistName        String   @default("Unknown Artist")
  venue             String   @default("Unknown Venue")
  city              String?
  concertDate       DateTime @default(now())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  concert Concert  @relation(fields: [concertId], references: [id])
  user    User     @relation(fields: [userId], references: [id])
  
  // NEW: Likes relation
  likes   ReviewLike[]

  @@index([userId])
  @@index([concertId])
  @@index([artistName])
  @@index([concertDate])
}

// ============================================
// NEW MODELS
// ============================================

/// Public likes on reviews (Letterboxd-style)
model ReviewLike {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  reviewId  String
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  
  @@unique([userId, reviewId])  // One like per user per review
  @@index([reviewId])
  @@index([userId])
  @@map("review_likes")
}

/// User follow relationships with timestamps
model Follow {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  
  followerId  String
  follower    User     @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  
  followingId String
  following   User     @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)
  
  @@unique([followerId, followingId])  // Prevent duplicate follows
  @@index([followerId])
  @@index([followingId])
  @@map("follows")
}
```

### Migration Command
```bash
cd /media/richard-leddy/extra/marcus
npx prisma migrate dev --name add_likes_and_follows
npx prisma generate
```

---

## 2. API ROUTES

### 2.1 Review Likes API

**File:** `src/app/api/reviews/[id]/like/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/reviews/[id]/like - Get like status and count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: reviewId } = await params
    const session = await auth()

    const [likeCount, userLike] = await Promise.all([
      prisma.reviewLike.count({ where: { reviewId } }),
      session?.user?.id
        ? prisma.reviewLike.findUnique({
            where: { userId_reviewId: { userId: session.user.id, reviewId } }
          })
        : null
    ])

    return NextResponse.json({
      likeCount,
      isLiked: !!userLike
    })
  } catch (error) {
    console.error("Get like status error:", error)
    return NextResponse.json(
      { error: "Failed to get like status" },
      { status: 500 }
    )
  }
}

// POST /api/reviews/[id]/like - Toggle like
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: reviewId } = await params
    const userId = session.user.id

    const existingLike = await prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId, reviewId } }
    })

    if (existingLike) {
      await prisma.reviewLike.delete({
        where: { userId_reviewId: { userId, reviewId } }
      })
      const likeCount = await prisma.reviewLike.count({ where: { reviewId } })
      return NextResponse.json({ liked: false, likeCount })
    } else {
      await prisma.reviewLike.create({
        data: { userId, reviewId }
      })
      const likeCount = await prisma.reviewLike.count({ where: { reviewId } })
      return NextResponse.json({ liked: true, likeCount }, { status: 201 })
    }
  } catch (error) {
    console.error("Toggle like error:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}
```

---

### 2.2 User Following API

**File:** `src/app/api/users/[id]/follow/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/users/[id]/follow - Get follow status and counts
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: userId } = await params
    const session = await auth()

    const [followerCount, followingCount, isFollowing] = await Promise.all([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
      session?.user?.id && session.user.id !== userId
        ? prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: session.user.id,
                followingId: userId
              }
            }
          })
        : null
    ])

    return NextResponse.json({
      followerCount,
      followingCount,
      isFollowing: !!isFollowing
    })
  } catch (error) {
    console.error("Get follow status error:", error)
    return NextResponse.json(
      { error: "Failed to get follow status" },
      { status: 500 }
    )
  }
}

// POST /api/users/[id]/follow - Toggle follow
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: followingId } = await params
    const followerId = session.user.id

    if (followerId === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } }
      })
      const followerCount = await prisma.follow.count({ where: { followingId } })
      return NextResponse.json({ following: false, followerCount })
    } else {
      await prisma.follow.create({
        data: { followerId, followingId }
      })
      const followerCount = await prisma.follow.count({ where: { followingId } })
      return NextResponse.json({ following: true, followerCount }, { status: 201 })
    }
  } catch (error) {
    console.error("Toggle follow error:", error)
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    )
  }
}
```

---

### 2.3 Get Likers API (Public Likes)

**File:** `src/app/api/reviews/[id]/likers/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/reviews/[id]/likers - Get list of users who liked
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: reviewId } = await params
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)
    const offset = parseInt(searchParams.get("offset") || "0")

    const likers = await prisma.reviewLike.findMany({
      where: { reviewId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset
    })

    const total = await prisma.reviewLike.count({ where: { reviewId } })

    return NextResponse.json({
      likers: likers.map(like => ({
        id: like.user.id,
        name: like.user.name,
        likedAt: like.createdAt
      })),
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error("Get likers error:", error)
    return NextResponse.json(
      { error: "Failed to get likers" },
      { status: 500 }
    )
  }
}
```

---

## 3. FRONTEND COMPONENTS

### 3.1 LikeButton Component

**File:** `src/components/like-button.tsx`

```typescript
"use client"

import { useState, useOptimistic } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  reviewId: string
  initialLiked: boolean
  initialCount: number
  currentUserId?: string
  showCount?: boolean
  onLikeToggle?: (liked: boolean, count: number) => void
}

export function LikeButton({
  reviewId,
  initialLiked,
  initialCount,
  currentUserId,
  showCount = true,
  onLikeToggle
}: LikeButtonProps) {
  const [isPending, setIsPending] = useState(false)
  
  const [optimisticState, setOptimisticState] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (state, newLiked: boolean) => ({
      liked: newLiked,
      count: newLiked ? state.count + 1 : state.count - 1
    })
  )

  const handleToggle = async () => {
    if (!currentUserId) {
      window.location.href = "/login"
      return
    }

    const newLiked = !optimisticState.liked
    setOptimisticState(newLiked)
    setIsPending(true)

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST"
      })

      if (!response.ok) {
        setOptimisticState(!newLiked)
        throw new Error("Failed to toggle like")
      }

      const data = await response.json()
      onLikeToggle?.(data.liked, data.likeCount)
    } catch (error) {
      console.error("Like toggle failed:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "gap-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10",
        optimisticState.liked && "text-rose-500"
      )}
      onClick={handleToggle}
      disabled={isPending}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all duration-200",
          optimisticState.liked && "fill-current scale-110"
        )}
      />
      {showCount && (
        <span className="text-xs font-medium tabular-nums">
          {optimisticState.count}
        </span>
      )}
    </Button>
  )
}
```

---

### 3.2 FollowButton Component

**File:** `src/components/follow-button.tsx`

```typescript
"use client"

import { useState, useOptimistic } from "react"
import { UserPlus, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FollowButtonProps {
  userId: string
  initialFollowing: boolean
  currentUserId?: string
  isOwnProfile?: boolean
  onFollowToggle?: (following: boolean) => void
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline"
}

export function FollowButton({
  userId,
  initialFollowing,
  currentUserId,
  isOwnProfile,
  onFollowToggle,
  size = "default",
  variant = "default"
}: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false)
  
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(
    initialFollowing,
    (_, newFollowing: boolean) => newFollowing
  )

  if (isOwnProfile) return null

  if (!currentUserId) {
    return (
      <Button variant={variant} size={size} onClick={() => window.location.href = "/login"}>
        <UserPlus className="w-4 h-4 mr-1.5" />
        Follow
      </Button>
    )
  }

  const handleToggle = async () => {
    const newFollowing = !optimisticFollowing
    setOptimisticFollowing(newFollowing)
    setIsPending(true)

    try {
      const response = await fetch(`/api/users/${userId}/follow`, { method: "POST" })

      if (!response.ok) {
        setOptimisticFollowing(!newFollowing)
        throw new Error("Failed to toggle follow")
      }

      const data = await response.json()
      onFollowToggle?.(data.following)
    } catch (error) {
      console.error("Follow toggle failed:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant={optimisticFollowing ? "secondary" : variant}
      size={size}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "gap-1.5 min-w-[100px]",
        optimisticFollowing && "group hover:bg-rose-500/10 hover:text-rose-500"
      )}
    >
      {optimisticFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  )
}
```

---

### 3.3 Updated ReviewCard

**File:** `src/components/review-card.tsx` (modifications)

```typescript
// ADD TO IMPORTS:
import { LikeButton } from "@/components/like-button"

// UPDATE Review INTERFACE:
interface Review {
  id: string
  rating: number
  title: string | null
  text: string | null
  setlistHighlights: string | null
  createdAt: string
  user: { id: string; name: string | null }
  likeCount: number      // NEW
  isLikedByUser: boolean // NEW
}

// REPLACE CardFooter (lines 109-111):
<CardFooter className="pt-2 pb-3">
  <div className="w-full flex items-center justify-between">
    <LikeButton
      reviewId={review.id}
      initialLiked={review.isLikedByUser}
      initialCount={review.likeCount}
      currentUserId={currentUserId}
    />
    <span className="text-xs text-muted-foreground">
      {formatDate(review.createdAt)}
    </span>
  </div>
</CardFooter>
```

---

### 3.4 Updated Profile Page

**File:** `src/app/profile/[id]/page.tsx` (modifications)

```typescript
// ADD IMPORTS:
import { FollowButton } from "@/components/follow-button"
import { auth } from "@/lib/auth"

// ADD AFTER `const { id } = await params`:
const session = await auth()
const currentUserId = session?.user?.id
const isOwnProfile = currentUserId === id

// CHECK IF FOLLOWING:
const followRecord = currentUserId && !isOwnProfile
  ? await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: id } }
    })
  : null
const isFollowing = !!followRecord

// UPDATE USER QUERY:
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    reviews: { select: { id: true } },
    concerts: { select: { id: true } },
    _count: { select: { followers: true, following: true } }  // NEW
  },
})

// EXTRACT COUNTS:
const followerCount = user._count.followers
const followingCount = user._count.following

// ADD FOLLOWBUTTON AFTER NAME:
<h1 className="text-4xl font-bold text-white">{user.name ?? "Anonymous User"}</h1>
<FollowButton
  userId={user.id}
  initialFollowing={isFollowing}
  currentUserId={currentUserId}
  isOwnProfile={isOwnProfile}
  size="sm"
/>

// UPDATE STAT GRID TO 4 COLUMNS:
<div className="grid grid-cols-4 gap-4 pt-4">
  <StatCard icon="🎵" label="Reviews" value={reviewCount} />
  <StatCard icon="🎸" label="Concerts" value={concertsCount} />
  <StatCard icon="👥" label="Followers" value={followerCount} href={`/profile/${user.id}/followers`} />
  <StatCard icon="➡️" label="Following" value={followingCount} href={`/profile/${user.id}/following`} />
</div>
```

---

## 4. UI/UX DETAILS

### 4.1 ReviewCard with LikeButton

```
┌─────────────────────────────────────────────────────────────────┐
│ ━━━━━★★★★☆  "Best show ever!"                                   │
│  John Doe                                         ✏️  🗑️       │
├─────────────────────────────────────────────────────────────────┤
│  The energy was incredible from start to finish...              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ SETLIST HIGHLIGHTS                                          ││
│  │ Paranoid Android • Karma Police • Creep                      ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  ♥ 23                                      Mar 11, 2025        │
└─────────────────────────────────────────────────────────────────┘
```

### LikeButton States

| State | Icon | Color | Behavior |
|-------|------|-------|----------|
| Not liked (logged out) | Heart outline | Gray | Click → `/login` |
| Not liked (logged in) | Heart outline | Gray | Click → fill, +1 |
| Liked | Heart filled | Rose-500 | Click → outline, -1 |
| Pending | (unchanged) | (unchanged) | Disabled |
| Hover | Heart | Rose-500 | Scale 1.1x |

---

### 4.2 Profile Page with Follow

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                                   │
│  │    JD    │  John Doe                              [Follow]  │
│  │          │  @admin  •  Member since January 2024              │
│  └──────────┘                                                   │
├─────────────────────────────────────────────────────────────────┤
│   🎵         🎸         👥         ➡️                          │
│   12         8          156        89                           │
│  Reviews   Concerts   Followers  Following                      │
│                        (clickable)  (clickable)                 │
└─────────────────────────────────────────────────────────────────┘
```

### FollowButton States

| State | Icon | Text | Style |
|-------|------|------|-------|
| Not logged in | UserPlus | "Follow" | Primary |
| Not following | UserPlus | "Follow" | Primary |
| Following | UserCheck | "Following" | Secondary |
| Following (hover) | UserCheck | "Unfollow" | Secondary + rose |
| Own profile | (hidden) | — | — |

---

### 4.3 Public Likes Display

When clicking the like count, show who liked:

```
┌─────────────────────────────────────┐
│  23 people liked this review        │
├─────────────────────────────────────┤
│  👤 Sarah Connor   •  2h ago        │
│  👤 Mike Chen      •  5h ago        │
│  👤 Alex Rivera    •  1d ago        │
│  👤 Jamie Park     •  2d ago        │
│  ...                                │
│                                     │
│  [View all 23 likers]               │
└─────────────────────────────────────┘
```

---

## 5. MIGRATION STRATEGY

### Phase 1: Database (15 min)
```bash
# 1. Edit schema.prisma with new models
# 2. Run migration
npx prisma migrate dev --name add_likes_and_follows
npx prisma generate

# 3. (Optional) Update seed.ts with sample likes/follows
npx prisma db seed
```

### Phase 2: API Routes (45 min)
1. Create `/api/reviews/[id]/like/route.ts`
2. Create `/api/reviews/[id]/likers/route.ts`
3. Create `/api/users/[id]/follow/route.ts`
4. Test endpoints with curl or Postman

### Phase 3: Components (1.5 hrs)
1. Create `like-button.tsx`
2. Create `follow-button.tsx`
3. Update `review-card.tsx` to include LikeButton
4. Update profile page with FollowButton + counts

### Phase 4: Data Queries (30 min)
1. Add `likeCount` and `isLikedByUser` to review queries
2. Add `_count.followers` and `_count.following` to user queries
3. Update TypeScript interfaces

### Phase 5: Testing (30 min)
1. Test like toggle with optimistic update + rollback
2. Test follow toggle with self-follow prevention
3. Test unauthenticated state (redirect to login)
4. Verify count accuracy after multiple operations

---

## 6. TIMELINE ESTIMATE

| Task | Time | Dependencies |
|------|------|--------------|
| Prisma schema + migration | 15 min | None |
| Like API route | 20 min | Schema |
| Follow API route | 20 min | Schema |
| Likers API route | 15 min | Schema |
| LikeButton component | 30 min | API |
| FollowButton component | 30 min | API |
| ReviewCard update | 20 min | LikeButton |
| Profile page update | 30 min | FollowButton |
| Query updates | 30 min | All above |
| Testing & fixes | 30 min | All above |
| **TOTAL** | **~4 hours** | |

---

## FILES SUMMARY

### New Files (5)
```
src/app/api/reviews/[id]/like/route.ts     # Like toggle endpoint
src/app/api/reviews/[id]/likers/route.ts   # Get who liked
src/app/api/users/[id]/follow/route.ts     # Follow toggle endpoint
src/components/like-button.tsx             # Like button with optimistic UI
src/components/follow-button.tsx           # Follow button with optimistic UI
```

### Modified Files (3)
```
prisma/schema.prisma            # Add ReviewLike and Follow models
src/components/review-card.tsx  # Add LikeButton to footer
src/app/profile/[id]/page.tsx   # Add FollowButton + follower counts
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Add ReviewLike model to schema.prisma
- [ ] Add Follow model to schema.prisma
- [ ] Add relations to User model
- [ ] Add relations to Review model
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npx prisma generate`
- [ ] Create `/api/reviews/[id]/like/route.ts`
- [ ] Create `/api/reviews/[id]/likers/route.ts`
- [ ] Create `/api/users/[id]/follow/route.ts`
- [ ] Create `like-button.tsx` component
- [ ] Create `follow-button.tsx` component
- [ ] Update `review-card.tsx` with LikeButton
- [ ] Update `profile/[id]/page.tsx` with FollowButton
- [ ] Update review queries to include like data
- [ ] Update user queries to include follow counts
- [ ] Test like functionality
- [ ] Test follow functionality
- [ ] Test unauthenticated flows

---

## NOTES

- **Auth Pattern**: Uses `import { auth } from "@/lib/auth"` → `session.user.id`
- **Optimistic UI**: React 19's `useOptimistic` hook for instant feedback
- **Self-relation**: Prisma requires named relations (`@relation("UserFollowers")`)
- **Public likes**: Anyone can see who liked a review
- **No notifications**: MVP scope excludes follow/like notifications
- **No private profiles**: All profiles are public in MVP