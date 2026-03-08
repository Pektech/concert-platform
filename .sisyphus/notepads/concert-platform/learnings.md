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
