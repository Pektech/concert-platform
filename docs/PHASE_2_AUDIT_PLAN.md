# Phase 2: Comprehensive Codebase Audit

## Goal

Thorough review of ENTIRE codebase before merging develop → main.

Not just known fixes - find ALL issues.

---

## Audit Areas

### 1. Known Issues (Must Fix)

- [ ] MusicBrainz API types (`src/app/api/artists/[mbid]/concerts/route.ts`)
- [ ] Feed page link (`src/app/feed/page.tsx`)

### 2. Navigation & Links Audit

**Map all pages and verify links:**

```
Homepage (/)
├── → /reviews (Browse Reviews)
├── → /feed (Feed)
├── → /concerts/search (Search Concerts)
├── → /login (Sign In)
├── → /signup (Get Started)
└── → /reviews/new (Write Review)

Reviews (/reviews)
├── → /reviews/[id] (Individual review)
├── → /reviews/new (Create review)
└── → / (Back home)

Feed (/feed)
├── → /reviews (Browse Reviews) ← FIX THIS
├── → /profile/[id] (User profiles)
└── → / (Back home)

Profile (/profile/[id])
├── → /profile/[id]/followers
├── → /profile/[id]/following
├── → /reviews (User's reviews)
└── → / (Back home)

Login (/login)
├── → /signup (No account?)
└── → / (After login)

Signup (/signup)
├── → /login (Have account?)
└── → / (After signup)
```

**Check:**
- [ ] All links work (no 404s)
- [ ] No broken internal links
- [ ] Breadcrumbs work
- [ ] Back buttons work

### 3. API Routes Audit

**Check all API endpoints:**

```
/api/
├── artists/[mbid]/concerts ← KNOWN BROKEN
├── auth/[...nextauth]
├── cities/autocomplete
├── concerts/
│   ├── [id]/attended
│   ├── autocomplete
│   ├── local/[id]
│   ├── search
│   └── user/[userId]/reviews
├── reviews/
│   ├── [id]/like
│   ├── [id]/likers
│   └── (create)
├── users/[id]/follow
└── venues/autocomplete
```

**Check:**
- [ ] All routes compile without TypeScript errors
- [ ] All routes return proper responses
- [ ] Error handling exists
- [ ] No console errors

### 4. Component Audit

**Review all components:**

```
src/components/
├── autocomplete-input.tsx
├── artist-card.tsx
├── artist-list.tsx
├── auth-provider.tsx
├── follow-button.tsx
├── header.tsx
├── like-button.tsx
├── login-form.tsx
├── review-card.tsx
├── review-form.tsx
├── review-form-container.tsx
├── search-autocomplete.tsx
├── star-rating.tsx
├── star-rating-input.tsx
├── user-reviews-list.tsx
└── venue-card.tsx
```

**Check:**
- [ ] No TypeScript errors
- [ ] Props are typed correctly
- [ ] No unused imports
- [ ] No console.log() left in code
- [ ] Error boundaries exist where needed

### 5. Page Audit

**Review all pages:**

```
src/app/
├── /
├── /_not-found
├── /concerts/
│   └── [id]/
│       ├── /
│       └── /review/new
├── /concerts/search ← Coming Soon page
├── /feed
├── /login
├── /profile/
│   └── [id]/
│       ├── /
│       ├── /followers
│       └── /following
├── /reviews/
│   ├── [id]/edit
│   └── /new
├── /reviews (Browse)
└── /signup
```

**Check:**
- [ ] All pages load without errors
- [ ] Server components work
- [ ] Client components work
- [ ] No hydration errors
- [ ] Responsive design works

### 6. Database & Prisma Audit

**Check:**
- [ ] Schema matches production DB
- [ ] All migrations are applied
- [ ] Seed script works
- [ ] No missing models
- [ ] Foreign keys are correct

### 7. Environment & Config Audit

**Check:**
- [ ] `.env.example` has all required vars
- [ ] `.env.production.example` is complete
- [ ] No hardcoded secrets
- [ ] NEXTAUTH_URL is correct
- [ ] DATABASE_URL format is correct

### 8. Build & Deploy Audit

**Check:**
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] TypeScript compiles cleanly
- [ ] All routes generate
- [ ] No warnings in build output

---

## Execution Plan

### Step 1: Automated Checks

**Opencode runs:**
```bash
# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint

# Build test
npm run build

# Find console.log statements
grep -r "console.log" src/ --include="*.ts" --include="*.tsx"

# Find TODO/FIXME comments
grep -r "TODO\|FIXME\|XXX" src/ --include="*.ts" --include="*.tsx"
```

### Step 2: Manual Link Testing

**Opencode creates link map:**
1. Crawl all pages
2. Extract all `<Link>` and `<a>` tags
3. Verify each target exists
4. Report broken links

### Step 3: API Testing

**Opencode tests each endpoint:**
1. Check TypeScript compiles
2. Test with curl/Postman
3. Verify responses
4. Check error handling

### Step 4: Component Review

**Opencode reviews each component:**
1. Check for type errors
2. Check for unused imports
3. Check for console statements
4. Verify props are typed

### Step 5: Create Issues List

**Opencode creates:**
```markdown
# Audit Findings

## Critical (Must Fix Before Main)
1. [ ] Issue description
2. [ ] Issue description

## Important (Should Fix)
1. [ ] Issue description

## Nice to Have (Optional)
1. [ ] Issue description
```

### Step 6: Fix All Issues

**Opencode fixes:**
1. All Critical issues
2. As many Important as possible
3. Document Nice to Haves for later

### Step 7: Final Verification

**Benton verifies:**
1. All fixes are correct
2. Build succeeds
3. No TypeScript errors
4. All links work
5. Ready for main

---

## Success Criteria

**develop branch is ready when:**
- ✅ All Critical issues fixed
- ✅ `npm run build` succeeds
- ✅ `npm run lint` passes
- ✅ TypeScript compiles cleanly
- ✅ All pages load without errors
- ✅ All links work (no 404s)
- ✅ All API routes work
- ✅ No console errors in browser
- ✅ Benton approves

---

## Timeline

**Estimated:**
- Automated checks: 10 min
- Link audit: 20 min
- API audit: 20 min
- Component audit: 30 min
- Fix issues: 30-60 min
- Final verification: 15 min

**Total: ~2-3 hours**

---

*Created: 2026-03-13*
*Status: Ready to Execute*
*Assigned: Opencode (execution), Benton (verification)*
