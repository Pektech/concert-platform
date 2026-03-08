This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

Before running the development server, configure your environment variables:

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure each variable**:

   - `DATABASE_URL`: PostgreSQL connection string from your database provider (e.g., Supabase, Neon, Railway)
   - `NEXTAUTH_SECRET`: Random 32+ character string for session encryption. Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your application URL (`http://localhost:3000` for development)
   - `SETLIST_FM_API_KEY`: Free API key from [setlist.fm](https://api.setlist.fm/)

3. **Verify**: Ensure `.env.local` is in `.gitignore` (it should be by default)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This Next.js app is ready for deployment on [Vercel](https://vercel.com). No `vercel.json` configuration is required.

### Prerequisites

- PostgreSQL database hosted on a provider (e.g., [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app))
- Setlist.fm API key from [api.setlist.fm](https://api.setlist.fm/)

### Deployment Steps

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables** in Vercel dashboard:
   - Navigate to **Settings** → **Environment Variables**
   - Add the following variables for **Production** (and Preview/Development if needed):

   | Variable | Description | Example Value |
   |----------|-------------|---------------|
   | `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
   | `NEXTAUTH_SECRET` | Random 32+ char string for session encryption | Generate with `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | Your production app URL | `https://your-app.vercel.app` |
   | `SETLIST_FM_API_KEY` | Setlist.fm API key | Your API key from setlist.fm |

4. **Redeploy** after adding environment variables:
   - Go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

### Post-Deployment Verification

- [ ] App loads successfully at your Vercel URL
- [ ] Login/signup functionality works
- [ ] Concert search returns results
- [ ] Reviews can be created and displayed
- [ ] Profile pages load correctly

### Important Notes

- `NEXTAUTH_URL` must match your production domain exactly (e.g., `https://your-app.vercel.app`)
- Generate a unique `NEXTAUTH_SECRET` for production (do not use the development value)
- Database must be accessible from Vercel's servers (ensure IP allowlisting if needed)
