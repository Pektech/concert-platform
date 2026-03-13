# ConcertVibe - Git Branch Strategy & Deployment Plan

## Overview

Two-branch workflow for clean separation between development and production.

```
main (Production)     ← VPS pulls from here ONLY
  ↑
  │ merge when tested & approved
  │
develop (Staging)     ← Test new features here
  ↑
  │ feature branches
  │
feature/*             ← Local work
```

---

## Branch Definitions

### `main` - Production Branch
- **Purpose:** Always production-ready
- **Protected:** No direct commits
- **VPS:** Pulls from this branch ONLY
- **Rule:** Must be tested on `develop` first

### `develop` - Staging Branch
- **Purpose:** Integration & testing
- **Default:** Developers work here
- **Testing:** Deploy to local/staging for QA
- **Rule:** Merge to `main` when ready

### `feature/*` - Feature Branches
- **Purpose:** Individual features/fixes
- **Naming:** `feature/feature-name` or `fix/issue-name`
- **Lifecycle:** Branch → Work → Test → Merge to `develop` → Delete

---

## Setup Steps

### Phase 1: Create Branch Structure

**On Laptop:**
```bash
# 1. Ensure all current work is committed
git status
git add -A
git commit -m "Pre-branch-setup snapshot"

# 2. Create develop branch from current main
git checkout main
git checkout -b develop
git push -u origin develop

# 3. Protect main branch (GitHub Settings)
# Go to: GitHub → Settings → Branches → Add rule
# Branch name pattern: main
# ✓ Require pull request before merging
# ✓ Require status checks to pass before merging
# ✓ Include administrators
```

**Verify:**
```bash
git branch -a
# Should show: main, develop, remotes/origin/main, remotes/origin/develop
```

---

### Phase 2: Local Development Workflow

**Starting New Work:**
```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Work locally
# ... make changes ...
# ... test with npm run dev ...

# 4. Commit changes
git add -A
git commit -m "feat: description of changes"

# 5. Push feature branch
git push -u origin feature/your-feature-name
```

**Merge to Develop:**
```bash
# 1. Test locally on develop
git checkout develop
git merge feature/your-feature-name
npm run dev
# Test thoroughly!

# 2. Push to GitHub
git push origin develop

# 3. Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

### Phase 3: Promote to Production

**When develop is stable:**

```bash
# 1. Create release branch (optional, for final testing)
git checkout develop
git checkout -b release/v1.0.0

# 2. Final testing
npm run build
npm run test

# 3. Merge to main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin main --tags

# 4. Clean up
git branch -d release/v1.0.0
```

**Or Direct Merge (for small changes):**
```bash
git checkout main
git merge develop
git push origin main
```

---

### Phase 4: VPS Deployment

**On VPS:**
```bash
cd ~/concert-platform

# 1. Ensure clean state
git fetch origin
git reset --hard origin/main

# 2. Install dependencies
npm ci

# 3. Run migrations
export $(cat .env.production | xargs)
npx prisma migrate deploy

# 4. Build production
npm run build

# 5. Restart PM2
pm2 restart concertvibe
pm2 save

# 6. Verify deployment
curl https://concertvibe.pektech.dev
pm2 logs concertvibe --lines 20
```

---

## Emergency Rollback

**If production breaks:**

```bash
# On VPS
cd ~/concert-platform

# 1. Stop app
pm2 stop concertvibe

# 2. Revert to previous commit
git revert HEAD
# OR reset to specific tag
git reset --hard v0.9.0

# 3. Rebuild
npm run build
pm2 restart concertvibe
```

---

## Current State Assessment

### What Needs Fixing Before This Plan Works:

**Laptop (Develop Branch):**
- [ ] Fix MusicBrainz types in `src/app/api/artists/[mbid]/concerts/route.ts`
  - `event.id` → `event.gid`
  - `event.date` → construct from year/month/day
  - `event.venue?.city` → `event.venue?.area`
  - `event.tour` → `undefined`
- [ ] Fix feed page link: `/browse` → `/reviews`
- [ ] Test all features locally
- [ ] Ensure all tests pass

**GitHub (main):**
- [ ] Push all laptop fixes
- [ ] Verify main compiles
- [ ] Create develop branch

**VPS (Production):**
- [ ] Wait for main to be stable
- [ ] Fresh pull from main
- [ ] Clean rebuild
- [ ] Run migrations
- [ ] Seed database
- [ ] Verify all features work

---

## Success Criteria

### Develop Branch Ready When:
- ✅ `npm run dev` works locally
- ✅ `npm run build` succeeds
- ✅ All TypeScript errors resolved
- ✅ All features tested:
  - Login/Signup
  - Create Review
  - Browse Reviews
  - Like/Unlike
  - Follow/Unfollow
  - Activity Feed

### Main Branch Ready When:
- ✅ All develop tests pass
- ✅ Tagged with version number
- ✅ Deployment tested on staging

### VPS Ready When:
- ✅ `git pull origin main` succeeds
- ✅ `npm run build` succeeds
- ✅ All migrations applied
- ✅ Site accessible via HTTPS
- ✅ All features work in production

---

## Next Steps

1. **Review this plan** with Opencode
2. **Get agreement** on workflow
3. **Create branch structure** on laptop
4. **Fix develop branch** (MusicBrainz + browse link)
5. **Test thoroughly** on develop
6. **Merge to main** when stable
7. **Fresh VPS deploy** from main

---

*Created: 2026-03-13*
*Status: Draft - Pending Opencode Review*
