# Concert Platform - Vercel Deployment Checklist

**Estimated Time**: 15 minutes  
**Cost**: $0 (all free tiers)

---

## Pre-Deployment Checklist

### ✅ Step 1: Create Vercel Account (2 minutes)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Sign Up"
- [ ] Sign up with GitHub account (recommended) or email
- [ ] Verify email if needed
- [ ] You're now in the Vercel dashboard

---

### ✅ Step 2: Push Code to GitHub (3 minutes)

**If you don't have a GitHub repo yet:**

```bash
# Navigate to project directory
cd /media/richard-leddy/extra/marcus

# Initialize GitHub repo (if not already done)
git remote add origin https://github.com/YOUR_USERNAME/concert-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:**
- [ ] Code is visible on GitHub
- [ ] Repository is either public or private (your choice)
- [ ] `main` branch exists

---

### ✅ Step 3: Create PostgreSQL Database with Neon (3 minutes)

**Sign up for Neon:**

- [ ] Go to [neon.tech](https://neon.tech)
- [ ] Click "Sign Up Free"
- [ ] Sign up with GitHub (easiest) or email
- [ ] Verify email if needed

**Create Database:**

- [ ] Click "Create a new project"
- [ ] Enter project name: `concert-platform`
- [ ] Choose a region (pick closest to you)
- [ ] Click "Create project"
- [ ] Wait for database to be provisioned (~10 seconds)

**Get Connection String:**

- [ ] On the project dashboard, find "Connection details"
- [ ] Click "Copy connection string"
- [ ] It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- [ ] **Important**: Make sure it includes `?sslmode=require`

**Save This:**
```
DATABASE_URL=<paste-your-connection-string-here>
```

---

### ✅ Step 4: Get Setlist.fm API Key (2 minutes)

**Sign up for API:**

- [ ] Go to [api.setlist.fm](https://api.setlist.fm)
- [ ] Click "Sign Up" or "Get API Key"
- [ ] Fill out the form:
  - Name: Your name
  - Email: Your email
  - Application name: "Concert Platform" (or whatever you want)
  - Application description: "Personal concert review app"
- [ ] Submit form
- [ ] Check email for API key (may take a few minutes)

**Save This:**
```
SETLIST_FM_API_KEY=<your-api-key-here>
```

---

### ✅ Step 5: Generate NEXTAUTH_SECRET (30 seconds)

**Run in terminal:**

```bash
openssl rand -base64 32
```

**Output example:**
```
3xK9vR2+pL8nQ5mW1yT6zU4jH7bN0cF9dS8aE2fG5iO=
```

**Save This:**
```
NEXTAUTH_SECRET=<paste-the-output-here>
```

---

### ✅ Step 6: Note Your Production URL (30 seconds)

Your Vercel app will be deployed at:
```
https://concert-platform-<your-username>.vercel.app
```

Or you can customize it during deployment.

**Save This:**
```
NEXTAUTH_URL=https://YOUR-APP-NAME.vercel.app
```

---

## Deployment in Vercel

### ✅ Step 7: Import Project to Vercel (2 minutes)

- [ ] In Vercel dashboard, click "Add New..." → "Project"
- [ ] Under "Import Git Repository", find your `concert-platform` repo
- [ ] Click "Import"
- [ ] Vercel auto-detects Next.js framework
- [ ] Keep default settings (no changes needed)

---

### ✅ Step 8: Add Environment Variables (2 minutes)

**In Vercel project setup:**

- [ ] Click "Environment Variables" (or "Add Environment Variable")
- [ ] Add each variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | ✅ Production |
| `NEXTAUTH_SECRET` | Your openssl output | ✅ Production |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | ✅ Production |
| `SETLIST_FM_API_KEY` | Your setlist.fm API key | ✅ Production |

- [ ] Click "Save" after each variable
- [ ] Verify all 4 variables are listed

---

### ✅ Step 9: Deploy! (1 minute)

- [ ] Click "Deploy" button
- [ ] Wait for build (~2-3 minutes)
- [ ] Watch the build log (should show no errors)
- [ ] When you see "🎉 Congratulations!", deployment is complete

**Click "Visit" to see your live app!**

---

## Post-Deployment

### ✅ Step 10: Run Database Migrations (2 minutes)

**Option A: Run locally (recommended)**

```bash
# First, set the DATABASE_URL to production
export DATABASE_URL="your-neon-connection-string"

# Run migrations
npx prisma migrate deploy
```

**Option B: Use Vercel's database UI (if using Vercel Postgres)**

- [ ] Go to Vercel project → Storage
- [ ] Find your database
- [ ] Click "Prisma Migrate" or run migrations from UI

**Verify:**
- [ ] No migration errors
- [ ] Database tables created (User, Concert, Review, Artist, Venue)

---

### ✅ Step 11: Create Your First User (3 minutes)

- [ ] Visit your deployed app: `https://your-app.vercel.app`
- [ ] Click "Sign Up" in header
- [ ] Fill out form:
  - Name: Your name
  - Email: Your email
  - Password: A secure password
- [ ] Click "Sign Up"
- [ ] Redirect to login page
- [ ] Enter credentials and log in
- [ ] **Success!** You should see your name in header

---

### ✅ Step 12: Smoke Test (3 minutes)

**Test these critical flows:**

- [ ] **Signup**: Create a test account → redirects to login
- [ ] **Login**: Log in → redirects to home, name shows in header
- [ ] **Search**: Use search bar → type an artist → results appear
- [ ] **Concert Page**: Click a concert → page loads with details
- [ ] **Review**: Click "Write Review" → fill form → submit → appears
- [ ] **Profile**: Go to `/profile` → shows your stats and reviews
- [ ] **Browse**: Go to `/reviews` → shows recent reviews
- [ ] **Check-in**: On concert page → click "Check In" → toggles
- [ ] **Logout**: Click logout → redirects to home, logged out

---

## Troubleshooting

### ❌ Build Failed

**Check:**
- [ ] All environment variables set correctly
- [ ] No TypeScript errors in build log
- [ ] Run `npm run build` locally to debug

**Fix:**
```bash
# Test build locally
npm run build

# Check for errors
```

---

### ❌ Database Connection Error

**Symptoms**: App shows "Database error" or "Prisma error"

**Check:**
- [ ] DATABASE_URL includes `?sslmode=require`
- [ ] DATABASE_URL is correct (no typos)
- [ ] Neon database is active (not paused)

**Fix:**
1. Go to Neon dashboard
2. Copy fresh connection string
3. Update in Vercel: Settings → Environment Variables → DATABASE_URL
4. Redeploy (go to Deployments → click three dots → "Redeploy")

---

### ❌ Login/Signup Not Working

**Symptoms**: Credentials error or session not persisting

**Check:**
- [ ] NEXTAUTH_SECRET is set
- [ ] NEXTAUTH_URL matches your Vercel domain exactly
- [ ] Database migrations ran successfully

**Fix:**
1. Generate new NEXTAUTH_SECRET: `openssl rand -base64 32`
2. Update both NEXTAUTH_SECRET and NEXTAUTH_URL in Vercel
3. Redeploy
4. Clear browser cookies and try again

---

### ❌ Concert Search Returns No Results

**Symptoms**: Search returns empty or error

**Check:**
- [ ] SETLIST_FM_API_KEY is set correctly
- [ ] API key is active (check setlist.fm dashboard)
- [ ] Try searching for a well-known artist (e.g., "Radiohead")

**Fix:**
1. Verify API key on setlist.fm
2. Update SETLIST_FM_API_KEY in Vercel
3. Redeploy

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host.neon.tech/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Random 32-character string | `3xK9vR2+pL8nQ5mW1yT6zU4jH7bN0cF9dS8aE2fG5iO=` |
| `NEXTAUTH_URL` | Your Vercel app URL | `https://concert-platform.vercel.app` |
| `SETLIST_FM_API_KEY` | Setlist.fm API key | `abc123xyz` |

---

## Useful Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Neon Console**: [console.neon.tech](https://console.neon.tech)
- **Setlist.fm API**: [api.setlist.fm](https://api.setlist.fm)
- **Prisma Studio** (view DB): `npx prisma studio`
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

## Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Vercel | Hobby | $0 | Unlimited deployments, 100 GB bandwidth |
| Neon | Free | $0 | 0.5 GB storage, unlimited databases |
| Setlist.fm | Free API | $0 | Rate limited (reasonable for personal use) |
| GitHub | Free | $0 | Unlimited repos |
| **TOTAL** | | **$0/month** | |

---

## Custom Domain (Optional)

Want to use your own domain (e.g., `concerts.yourname.com`)?

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel: Project Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Update NEXTAUTH_URL to your custom domain

---

## Next Steps After Deployment

- [ ] Share with friends
- [ ] Add real concert data
- [ ] Write your first reviews
- [ ] Explore the browse page
- [ ] Test on mobile devices
- [ ] Monitor usage in Vercel dashboard
- [ ] Set up automatic deployments (push to main → auto-deploy)

---

## Support Resources

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Neon Discord**: [neon.tech/discord](https://neon.tech/discord)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

**🎉 Congratulations! Your Concert Platform is live on Vercel!**

---

**Last Updated**: March 8, 2026  
**App Version**: 1.0.0 (MVP)  
**Status**: Production Ready
