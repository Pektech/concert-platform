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

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
