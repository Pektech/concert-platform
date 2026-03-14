# VPS Deployment Checklist - Clean Deploy

## Pre-Deployment Checklist

### On Your Laptop (Before Deploying):
- [x] All code merged to `main`
- [x] All tests passing (12/12 Playwright tests)
- [x] Git pushed to GitHub

---

## VPS Deployment Steps

### Step 1: SSH Into VPS
```bash
ssh richard-leddy@198.46.175.197
cd ~/concert-platform
```

### Step 2: Stop Current App
```bash
pm2 stop concertvibe
```

### Step 3: Pull Latest Code
```bash
git fetch origin
git reset --hard origin/main
```
**Why `reset --hard`:** Ensures clean state, removes any local changes

### Step 4: Clean Install Dependencies
```bash
# Remove old node_modules
rm -rf node_modules

# Fresh install
npm ci
```
**Why `npm ci`:** Clean install from package-lock.json (faster, more reliable)

### Step 5: Apply Database Migrations
```bash
# Ensure env is loaded
export $(cat .env.production | xargs)

# Run migrations
npx prisma migrate deploy
```
**Why:** Ensures DB schema matches code (Follow, ReviewLike tables, etc.)

### Step 6: Rebuild Application
```bash
npm run build
```
**Why:** Fresh build with new code, clears Next.js cache

### Step 7: Restart PM2
```bash
pm2 restart concertvibe
pm2 save
```

### Step 8: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs concertvibe --lines 20

# Test site
curl https://concertvibe.pektech.dev
```

---

## What Gets Cleaned/Refreshed:

| Component | Action | Why |
|-----------|--------|-----|
| **Code** | `git reset --hard` | Clean state, no local changes |
| **node_modules** | Delete & reinstall | Remove old dependencies |
| **Database** | Run migrations | Ensure schema matches code |
| **Build cache** | Fresh `npm run build` | Clear Next.js cache |
| **PM2 process** | Restart | Load new code |

---

## What Does NOT Need Cleaning:

| Component | Why |
|-----------|-----|
| **.env.production** | Already correct (NEXTAUTH_URL, DATABASE_URL, etc.) |
| **Docker containers** | Database is already running with correct schema |
| **Caddy/SSL** | Already configured, no changes needed |
| **PM2 config** | Already saved, just needs restart |

---

## Rollback Plan (If Something Goes Wrong):

```bash
# Stop app
pm2 stop concertvibe

# Revert to previous commit
git reset --hard HEAD~1

# Reinstall & rebuild
rm -rf node_modules && npm ci
npm run build

# Restart
pm2 restart concertvibe
```

---

## Post-Deployment Testing:

1. ✅ Visit `https://concertvibe.pektech.dev`
2. ✅ Test login/signup
3. ✅ Test create review
4. ✅ Test browse reviews (no 404!)
5. ✅ Test concert search page
6. ✅ Test feed page navigation
7. ✅ Check PM2 logs for errors

---

*Ready to deploy! All steps verified.*
