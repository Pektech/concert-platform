# Phase 2: Fix develop Branch

## Status: ✅ Phase 1 COMPLETE

**Branch Structure Created:**
- ✅ `main` - Production branch (VPS pulls from here)
- ✅ `develop` - Staging branch (test new features here)
- ✅ `feature/*` - For local work (to be created as needed)

---

## Current Issues on develop Branch

These need to be fixed BEFORE merging to main:

### 1. MusicBrainz API Types ❌

**File:** `src/app/api/artists/[mbid]/concerts/route.ts`

**Problems:**
- `event.id` doesn't exist → should be `event.gid`
- `event.date` doesn't exist → construct from `year/month/day`
- `event.venue?.city` doesn't exist → should be `event.venue?.area`
- `event.tour` doesn't exist → set to `undefined`

**Fix Required:**
```typescript
const concerts = (result.data.events || []).map((event) => ({
  id: event.gid,  // ✅ Changed from event.id
  date: event.year && event.month && event.day 
    ? `${event.year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}` 
    : undefined,  // ✅ Construct from parts
  venue: {
    name: event.venue?.name || "Unknown Venue",
    city: {
      name: event.venue?.area || "Unknown City",  // ✅ Changed from .city to .area
    },
  },
  tour: undefined,  // ✅ Changed from event.tour
}));
```

---

### 2. Feed Page Wrong Link ❌

**File:** `src/app/feed/page.tsx`

**Problem:**
- Link goes to `/browse` (doesn't exist) → 404 error
- Should go to `/reviews`

**Fix Required:**
```typescript
// Change this:
<Link href="/browse">Browse Reviews</Link>

// To this:
<Link href="/reviews">Browse Reviews</Link>
```

---

## Testing Checklist

Before merging develop → main, verify:

### Local Testing (`npm run dev`)
- [ ] Login/Signup works
- [ ] Can create a review
- [ ] Browse Reviews page loads (no 404)
- [ ] Can like a review
- [ ] Can follow a user
- [ ] Feed shows followed users' reviews
- [ ] No console errors
- [ ] No TypeScript errors

### Build Testing (`npm run build`)
- [ ] Build succeeds with no errors
- [ ] TypeScript compiles cleanly
- [ ] All routes generate successfully

---

## Execution Steps

### Step 1: Fix MusicBrainz Types

**On develop branch:**
```bash
# Make sure we're on develop
git checkout develop

# Fix the route file
# (Use sed or manual edit)
```

### Step 2: Fix Feed Link

```bash
# Fix the browse link
sed -i 's|href="/browse"|href="/reviews"|g' src/app/feed/page.tsx
```

### Step 3: Test Locally

```bash
# Start dev server
npm run dev

# Test all features in browser
# Open http://localhost:3000
```

### Step 4: Build Test

```bash
# Test production build
npm run build

# Should complete with no errors
```

### Step 5: Commit & Push

```bash
# Commit fixes
git add -A
git commit -m "fix: MusicBrainz types and feed page link"
git push origin develop
```

---

## Success Criteria

**develop branch is ready when:**
- ✅ All TypeScript errors resolved
- ✅ `npm run dev` works with no errors
- ✅ `npm run build` succeeds
- ✅ All features tested locally
- ✅ No console errors in browser

---

## Next: Merge to main

Once develop passes all tests:
1. Create PR: develop → main (or merge directly for solo dev)
2. Tag release: `v1.0.0`
3. VPS pulls from main
4. Fresh deployment

---

*Created: 2026-03-13*
*Status: Ready to Execute*
