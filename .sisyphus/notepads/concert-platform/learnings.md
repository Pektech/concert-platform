# Learnings - Concert Platform

## Project Conventions
*To be populated as work progresses*

## Patterns Discovered
*To be populated*

## Gotchas
*To be populated*

## Wave 1, Task 1: Project Scaffolding

### Successful Approach
- Used `bun create next-app .` with flags: `--typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*" --use-npm`
- Had to temporarily move `.sisyphus/` directory to avoid conflicts with existing files
- Next.js 16.1.6 was installed (latest version as of 2026-03-07)

### Configuration
- Path aliases configured in `tsconfig.json`:
  - `@/*` → `./src/*`
  - `@/components/*` → `./src/components/*`
  - `@/lib/*` → `./src/lib/*`
  - `@/types/*` → `./src/types/*`
  - `@/app/*` → `./src/app/*`

### Directory Structure Created
- `src/components/` - React components
- `src/lib/` - Utility functions and helpers
- `src/types/` - TypeScript type definitions
- `prisma/` - Database schema and migrations
- `__tests__/` - Test files

### Build Verification
- `bun run build` completed successfully with exit code 0
- Compiled in 1344.1ms using Turbopack
- Static pages generated: `/` and `/_not-found`

### Notes
- Bun installation required: `curl -fsSL https://bun.sh/install | bash`
- PATH export needed: `export PATH="$HOME/.bun/bin:$PATH"`

### Wave 1, Task 3: Environment Setup

### Environment Variables Configuration
Created `.env.example` with 4 required variables:
- `DATABASE_URL`: PostgreSQL connection string (from Supabase, Neon, Railway, etc.)
- `NEXTAUTH_SECRET`: Session encryption key (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Application URL (`http://localhost:3000` for dev)
- `SETLIST_FM_API_KEY`: Concert data API key (get free key at https://api.setlist.fm/)

### Best Practices Applied
- `.env.example` contains placeholder values with documentation comments
- `.env.local` created for actual values (gitignored by default)
- `.gitignore` already includes `.env*` pattern (line 34)
- README.md updated with "Environment Setup" section before "Getting Started"

### Key Insight
- Always document the source/obtaining method for each environment variable
- Use descriptive comments in `.env.example` to guide new developers

### Wave 1, Task 4: Vitest Test Infrastructure

### Packages Installed
All installed as dev dependencies:
- `vitest` - Test runner
- `@vitejs/plugin-react` - React support for Vite/Vitest
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers for assertions
- `jsdom` - Browser-like environment for tests

### Configuration Files Created
1. `vitest.config.ts` - Vitest configuration with:
   - React plugin enabled
   - jsdom test environment
   - Setup file reference (`./__tests__/setup.ts`)
   - Global test functions enabled

2. `__tests__/setup.ts` - Test setup file:
   - Imports `@testing-library/jest-dom` for DOM matchers

3. `__tests__/example.test.tsx` - Example test demonstrating:
   - Component rendering with Testing Library
   - `toBeInTheDocument()` matcher usage

### Package.json Script
Added `"test": "vitest"` to scripts section

### Verification
- `npm test` runs successfully
- Example test passes (18ms execution time)
- Total duration: 548ms including setup and jsdom initialization

### Gotcha Avoided
- Had to re-read package.json before editing (npm install modified it)
- Always re-read file after external modifications before using Edit tool

### Wave 1, Task 2: Prisma ORM Setup

### Prisma 7 Breaking Changes
- Prisma 7 introduced a new configuration system (`prisma.config.ts`)
- The `url` property in `datasource` block is deprecated
- Must use `prisma.config.ts` for database connection configuration
- Schema file should only declare provider, not connection URL

### Correct Prisma 7 Setup
1. Install: `npm add -D prisma` and `npm add @prisma/client`
2. Create `prisma.config.ts` for datasource configuration
3. Keep models in `prisma/schema.prisma` without `url` in datasource
4. Run `npx prisma generate` to generate client

### Schema Design Patterns
- Used `cuid()` for IDs (better for distributed systems than auto-increment)
- Timestamps: `createdAt` with `@default(now())`, `updatedAt` with `@updatedAt`
- Relations use explicit foreign keys with `@relation` attribute
- Many-to-many: User ↔ Concert via implicit relation table

### Prisma Client Singleton (Next.js)
- Prevents multiple instances in development due to hot reloading
- Uses `globalThis` to store instance across HMR updates
- Conditional logging: verbose in development, errors only in production

### File Structure
```
prisma/
  schema.prisma      # Model definitions
prisma.config.ts     # Datasource configuration (Prisma 7)
src/lib/prisma.ts    # PrismaClient singleton export
.env                 # DATABASE_URL environment variable
```

### Wave 1, Task 5: shadcn/ui Setup with Base Layout

#### shadcn Initialization
- Used `npx shadcn@latest init -d` (not `shadcn-ui` which is deprecated)
- Project uses Tailwind CSS v4 (detected automatically)
- Style selected: `base-nova`
- Configuration written to `components.json`

#### Components Installed
Base components added:
- `button.tsx` - Button component with variants
- `card.tsx` - Card container components
- `input.tsx` - Form input component
- `label.tsx` - Form label (uses @radix-ui/react-label)
- `form.tsx` - Form field components (manually created, uses react-hook-form)

#### Dependencies Added
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - react-hook-form + zod integration
- `@radix-ui/react-label` - Accessible label primitive
- `@radix-ui/react-slot` - Component composition primitive

#### Theme Configuration
- globals.css updated with comprehensive CSS variables via shadcn
- Uses OKLCH color space for better color manipulation
- Light and dark mode themes configured
- Chart colors (chart-1 through chart-5) available for data visualization
- Sidebar CSS variables for future dashboard layouts
- Border radius scale: `--radius-sm` to `--radius-4xl`

#### Metadata Updated
- app/layout.tsx metadata changed:
  - Title: "Concert Platform"
  - Description: "A modern platform for concert discovery and ticketing"

#### Build Issues Resolved
- prisma.config.ts had incorrect `provider` property in datasource block
- Removed `provider` from prisma.config.ts (only `url` is valid there)
- Provider is correctly defined in schema.prisma datasource block
- Build now passes with exit code 0

#### Files Created/Modified
- Created: `components.json`
- Created: `src/components/ui/button.tsx`
- Created: `src/components/ui/card.tsx`
- Created: `src/components/ui/input.tsx`
- Created: `src/components/ui/label.tsx`
- Created: `src/components/ui/form.tsx` (manual implementation)
- Created: `src/lib/utils.ts` (cn helper function)
- Modified: `src/app/globals.css` (shadcn theme tokens)
- Modified: `src/app/layout.tsx` (metadata)
- Modified: `prisma.config.ts` (fixed datasource config)

#### Verification
- `npm run build` completes successfully
- TypeScript compiles without errors
- Static pages generated: `/` and `/_not-found`
