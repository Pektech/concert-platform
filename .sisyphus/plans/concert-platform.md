# Concert Review Platform (Letterboxd for Concerts) - MVP

## TL;DR

> **Quick Summary**: Build a minimal concert review platform where users can authenticate, search concerts via Setlist.fm API, write reviews with ratings and setlist highlights, mark concerts as attended, and browse other users' reviews via public profiles.
> 
> **Deliverables**:
> - Next.js 14/15 App Router application with TypeScript
> - PostgreSQL database with Prisma ORM
> - NextAuth.js email/password authentication
> - Setlist.fm API integration for concert data
> - Concert review system (ratings, text, highlights, attended)
> - User profile pages showing their reviews
> - Browse/search functionality for concerts and reviews
> - TDD test suite with Bun test or Vitest
> 
> **Estimated Effort**: Medium (10-15 days for solo developer)
> **Parallel Execution**: YES - 6 waves
> **Critical Path**: Project setup → Database schema → Auth → Concert search → Review system → Profiles → Local testing → Deploy

---

## Context

### Original Request
Build a website like Letterboxd.com but for concerts instead of films. Core features: user accounts, concert reviews, nominate favorites, view other users' reviews.

### Interview Summary
**Key Discussions**:
- **Tech Stack**: Next.js 14/15 + App Router + Prisma + PostgreSQL + Tailwind + shadcn/ui
- **Auth**: NextAuth.js with email/password only (OAuth deferred)
- **Concert Data**: Setlist.fm API (free, non-commercial)
- **MVP Scope**: Minimal core - auth, reviews, profiles, browse (no photos, no follows, no comments)
- **Test Strategy**: TDD approach

**Research Findings**:
- Setlist.fm API provides concerts, artists, venues, setlists - requires API key
- Next.js App Router supports Server Components and Server Actions for data mutations
- unstable_cache enables tagged revalidation for API data caching

### Gap Analysis (Pre-Plan)
**Identified Gaps** (addressed in plan):
- **Setlist.fm API Key**: User must register at setlist.fm to obtain API key - documented in setup
- **Database hosting**: PostgreSQL on Vercel Postgres, Neon, or Supabase - plan uses environment-based config
- **Test framework choice**: Using Vitest (better Next.js integration) - documented
- **Rate limiting**: Setlist.fm API has limits - caching strategy included

---

## Work Objectives

### Core Objective
Build a functional MVP concert review platform enabling users to discover concerts, write reviews, and browse others' experiences.

### Concrete Deliverables
- Fully functional Next.js application deployed to Vercel
- Working authentication (sign up, login, logout, session management)
- Concert search and display powered by Setlist.fm API
- Review creation, editing, deletion
- User profile pages listing their reviews
- Global browse/feed of recent reviews
- Database schema with proper relations
- Test coverage for critical paths

### Definition of Done
- All TODOs completed and verified
- `bun test` passes (0 failures)
- `bun run build` succeeds
- Deployed to Vercel and accessible via URL
- Agent-Executed QA scenarios pass for all features

### Must Have
- Email/password authentication working
- Concert search returns real data from Setlist.fm
- Users can create, edit, delete reviews
- Reviews include: star rating (1-5), text, setlist highlights, attended flag
- User profiles show their reviews
- Browse page shows recent reviews from all users
- Responsive UI (mobile + desktop)
- TypeScript types throughout

### Must NOT Have (Guardrails)
- **NO photo uploads** - explicitly deferred
- **NO OAuth providers** - email/password only for MVP
- **NO follows/followers** - deferred
- **NO activity feed** - deferred
- **NO comments on reviews** - deferred
- **NO admin dashboard** - out of scope
- **NO real-time features** - not needed for MVP
- **NO complex caching layers** - basic unstable_cache only

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (greenfield project)
- **Automated tests**: YES (TDD)
- **Framework**: Vitest (better Next.js App Router integration)
- **Approach**: Each task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy
Every task includes agent-executed QA scenarios:
- **Frontend/UI**: Playwright - navigate, interact, assert DOM, screenshot
- **API/Backend**: Bash (curl) - send requests, assert status + response fields
- **Database**: Bash (Prisma queries) - verify data persisted correctly
- **Auth flows**: Playwright - full login/logout cycles

Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Project Foundation):
├── Task 1: Project scaffolding + config [quick]
├── Task 2: Database schema + Prisma setup [quick]
├── Task 3: Environment setup + .env documentation [quick]
├── Task 4: Test infrastructure (Vitest + Testing Library) [quick]
└── Task 5: Base layout + Tailwind + shadcn/ui setup [quick]

Wave 2 (After Wave 1 — Authentication):
├── Task 6: NextAuth.js configuration + providers [deep]
├── Task 7: Sign up flow (server action + form) [visual-engineering]
├── Task 8: Login flow (server action + form) [visual-engineering]
├── Task 9: Session management + protected routes [deep]
└── Task 10: Logout + auth UI components [quick]

Wave 3 (After Wave 2 — Concert Data Layer):
├── Task 11: Setlist.fm API client + types [quick]
├── Task 12: Concert search API route + caching [deep]
├── Task 13: Concert detail page + data fetching [visual-engineering]
├── Task 14: Artist display components [quick]
└── Task 15: Venue display components [quick]

Wave 4 (After Wave 3 — Review System Core):
├── Task 16: Review schema + Prisma migrations [quick]
├── Task 17: Create review form + server action [visual-engineering]
├── Task 18: Edit review flow [visual-engineering]
├── Task 19: Delete review + confirmation [quick]
├── Task 20: Review display component [visual-engineering]
└── Task 21: Star rating component + validation [quick]

Wave 5 (After Wave 4 — User Profiles + Browse):
├── Task 22: User profile page (public) [visual-engineering]
├── Task 23: Profile page reviews list [visual-engineering]
├── Task 24: Browse/recent reviews page [visual-engineering]
├── Task 25: Concert-attached reviews list [visual-engineering]
└── Task 26: Attended check-in functionality [quick]

Wave 6 (After Wave 5 — Polish + Local Testing):
├── Task 27: Navigation + header component [visual-engineering]
├── Task 28: Search UI + autocomplete [visual-engineering]
├── Task 29: Error boundaries + loading states [quick]
├── Task 30: SEO metadata + OpenGraph [quick]
├── Task 31: Local PostgreSQL setup + database seeding [quick]
├── Task 32: Full end-to-end local testing [deep]
├── Task 33: Environment validation script [quick]
├── Task 34: Setlist.fm API integration testing [deep]
├── Task 35: Vercel deployment config [quick]
└── Task 36: Final QA + smoke tests [deep]

Wave FINAL (After ALL tasks — Independent Review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)

Critical Path: 1 → 2 → 6 → 11 → 16 → 17 → 22 → 27 → 32 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 5 (Wave 1, 4, 5, 6)
```

### Dependency Matrix (abbreviated)

- **1-5**: — (can all start immediately)
- **6-10**: 1, 2, 3, 5 — 11-26
- **11-15**: 6, 9 — 16-26
- **16-21**: 11-15 — 22-26
- **22-26**: 16-21 — 27-36
- **27-36**: 22-26 — F1-F4

### Agent Dispatch Summary

- **Wave 1**: **5 tasks** — All `quick`
- **Wave 2**: **5 tasks** — T6, T9 `deep`, T7, T8 `visual-engineering`, T10 `quick`
- **Wave 3**: **5 tasks** — T12 `deep`, T13 `visual-engineering`, T11, T14, T15 `quick`
- **Wave 4**: **6 tasks** — T17, T18, T20 `visual-engineering`, T16, T19, T21 `quick`
- **Wave 5**: **5 tasks** — T22, T23, T24, T25 `visual-engineering`, T26 `quick`
- **Wave 6**: **10 tasks** — T27, T28 `visual-engineering`, T29, T30, T31, T33, T35 `quick`, T32, T34, T36 `deep`
- **Wave FINAL**: **4 tasks** — F1 `oracle`, F2, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [ ] 1. Project Scaffolding + Configuration

  **What to do**:
  - Create Next.js 14/15 project with TypeScript, App Router, Tailwind CSS
  - Configure eslint, prettier, tsconfig
  - Set up path aliases (@/components, @/lib, @/types)
  - Create base directory structure: components/, lib/, app/, prisma/, __tests__/

  **Must NOT do**:
  - Do not add authentication yet (separate task)
  - Do not configure database connection yet
  - Do not add any UI components yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard project setup with create-next-app, minimal decision-making
  - **Skills**: []
    - No specialized skills needed for basic scaffolding

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Tasks 6-32 (all tasks depend on project existing)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `create-next-app` docs: https://nextjs.org/docs/app/api-reference/cli/create-next-app - Project creation flags and options
  - Next.js App Router structure: https://nextjs.org/docs/app - Directory conventions

  **Acceptance Criteria**:
  - [ ] `bun create next-app` succeeds with TypeScript, ESLint, Tailwind, App Router
  - [ ] `bun run dev` starts without errors
  - [ ] `bun run build` completes successfully
  - [ ] Path aliases configured and working (@/ imports resolve)

  **QA Scenarios**:

  ```
  Scenario: Project builds successfully
    Tool: Bash
    Preconditions: Fresh Next.js project created
    Steps:
      1. Run: bun run build
      2. Verify exit code is 0
      3. Verify .next/ directory exists with build output
    Expected Result: Build completes with "Build completed successfully" message, exit code 0
    Failure Indicators: Build errors, non-zero exit code, missing .next/ directory
    Evidence: .sisyphus/evidence/task-1-build-success.txt

  Scenario: Dev server starts
    Tool: interactive_bash
    Preconditions: Project scaffolded
    Steps:
      1. Run: bun run dev
      2. Wait for "Ready in Xms" message
      3. Navigate to localhost:3000 in browser
    Expected Result: Dev server starts, displays welcome page at localhost:3000
    Failure Indicators: Port conflicts, module errors, TypeScript compilation errors
    Evidence: .sisyphus/evidence/task-1-dev-server.txt
  ```

  **Commit**: YES (grouped with 2-5)
  - Message: `chore: project scaffolding with Next.js 14, TypeScript, Tailwind CSS`
  - Files: `package.json, tsconfig.json, next.config.js, tailwind.config.ts, app/`
  - Pre-commit: `bun run build`

- [ ] 2. Database Schema + Prisma Setup

  **What to do**:
  - Install Prisma ORM: `bun add prisma @prisma/client`
  - Initialize Prisma: `bunx prisma init --datasource-provider postgresql`
  - Define schema with: User, Concert, Review, Artist, Venue models
  - Set up proper relations (User → Reviews, Concert → Reviews, Concert → Artists)
  - Create Prisma client singleton for Next.js
  - Add database scripts to package.json

  **Must NOT do**:
  - Do not run migrations yet (no database connection configured)
  - Do not create actual database yet
  - Do not add seed data yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Prisma setup with well-documented schema patterns
  - **Skills**: []
    - Prisma schema is straightforward for this domain

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Tasks 6-10 (auth needs User model), 16-21 (reviews need schema)
  - **Blocked By**: None

  **References**:
  - Prisma Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference - Model definitions
  - Next.js Prisma singleton: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices - Prevent multiple instances

  **Acceptance Criteria**:
  - [ ] Prisma installed and initialized
  - [ ] Schema file (prisma/schema.prisma) defines: User, Concert, Review, Artist, Venue
  - [ ] All relations properly defined with foreign keys
  - [ ] Prisma client singleton created at `lib/prisma.ts`
  - [ ] `bunx prisma generate` succeeds

  **QA Scenarios**:

  ```
  Scenario: Prisma client generates without errors
    Tool: Bash
    Preconditions: Schema file exists with valid models
    Steps:
      1. Run: bunx prisma generate
      2. Verify @prisma/client is generated
    Expected Result: Prisma client generated successfully, no schema errors
    Failure Indicators: Schema validation errors, missing relation definitions
    Evidence: .sisyphus/evidence/task-2-prisma-generate.txt

  Scenario: Schema validation passes
    Tool: Bash
    Preconditions: schema.prisma exists
    Steps:
      1. Run: bunx prisma validate
      2. Verify output shows "Schema is valid"
    Expected Result: Schema validation passes with no errors
    Failure Indicators: Invalid model definitions, circular dependencies
    Evidence: .sisyphus/evidence/task-2-schema-validate.txt
  ```

  **Commit**: YES (grouped with 1, 3-5)
  - Message: `chore: Prisma ORM setup with initial schema`
  - Files: `prisma/schema.prisma, lib/prisma.ts, package.json`
  - Pre-commit: `bunx prisma validate`

- [ ] 3. Environment Setup + .env Documentation

  **What to do**:
  - Create .env.example with all required environment variables
  - Document each variable: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, SETLIST_FM_API_KEY
  - Create .env.local for local development
  - Add .env* to .gitignore
  - Create setup documentation for obtaining API keys

  **Must NOT do**:
  - Do not commit actual secrets
  - Do not hardcode any credentials
  - Do not skip documentation of how to obtain each key

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard environment configuration, minimal complexity
  - **Skills**: []
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Tasks 6-10 (auth needs NEXTAUTH_SECRET), 11-15 (needs API key)
  - **Blocked By**: None

  **References**:
  - Next.js environment variables: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables - Server vs client env vars
  - NextAuth.js environment setup: https://next-auth.js.org/configuration/options#environment-variables

  **Acceptance Criteria**:
  - [ ] .env.example contains: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, SETLIST_FM_API_KEY
  - [ ] Each variable has comment explaining source/purpose
  - [ ] .env.local created (not committed)
  - [ ] .gitignore includes .env*
  - [ ] README.md has setup section for environment variables

  **QA Scenarios**:

  ```
  Scenario: Environment variables are documented
    Tool: Bash
    Preconditions: .env.example exists
    Steps:
      1. Read .env.example file
      2. Verify all 4 required variables present with comments
    Expected Result: All variables documented with clear instructions
    Failure Indicators: Missing variables, no comments, unclear instructions
    Evidence: .sisyphus/evidence/task-3-env-docs.txt

  Scenario: Environment variables load correctly
    Tool: Bash
    Preconditions: .env.local exists with valid values
    Steps:
      1. Create test script that logs process.env.DATABASE_URL
      2. Run script and verify value matches .env.local
    Expected Result: Environment variables load correctly from .env.local
    Failure Indicators: Undefined values, incorrect parsing
    Evidence: .sisyphus/evidence/task-3-env-load.txt
  ```

  **Commit**: YES (grouped with 1-2, 4-5)
  - Message: `chore: environment configuration and documentation`
  - Files: `.env.example, .env.local, .gitignore, README.md`
  - Pre-commit: None

- [ ] 4. Test Infrastructure (Vitest + Testing Library)

  **What to do**:
  - Install Vitest: `bun add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`
  - Create vitest.config.ts with Next.js compatibility
  - Create test setup file (__tests__/setup.ts) with Testing Library extensions
  - Configure test script in package.json
  - Create example test to verify setup works

  **Must NOT do**:
  - Do not write tests for features yet (that's TDD in later tasks)
  - Do not configure coverage yet (add after first feature tests)
  - Do not add Playwright yet (separate task for E2E)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard test setup with well-documented patterns
  - **Skills**: []
    - Vitest + Testing Library is standard configuration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: All TDD tasks (6-32 need tests)
  - **Blocked By**: None

  **References**:
  - Vitest + Next.js: https://vitest.dev/guide/ - Framework configuration
  - Testing Library setup: https://testing-library.com/docs/react-testing-library/setup/

  **Acceptance Criteria**:
  - [ ] Vitest installed as dev dependency
  - [ ] vitest.config.ts configured for Next.js App Router
  - [ ] __tests__/setup.ts imports @testing-library/jest-dom
  - [ ] package.json has "test": "vitest" script
  - [ ] Example test file passes when running `bun test`

  **QA Scenarios**:

  ```
  Scenario: Test runner executes successfully
    Tool: Bash
    Preconditions: Vitest configured, example test exists
    Steps:
      1. Run: bun test
      2. Verify test runner starts and completes
      3. Verify example test passes
    Expected Result: All tests pass, test runner exits cleanly
    Failure Indicators: Configuration errors, test failures, module resolution issues
    Evidence: .sisyphus/evidence/task-4-test-run.txt

  Scenario: Testing Library matchers work
    Tool: Bash
    Preconditions: Setup file configured
    Steps:
      1. Create test using toBeInTheDocument() matcher
      2. Run test and verify matcher works
    Expected Result: Testing Library matchers available and functional
    Failure Indicators: Matcher undefined errors, setup not loading
    Evidence: .sisyphus/evidence/task-4-matchers.txt
  ```

  **Commit**: YES (grouped with 1-3, 5)
  - Message: `chore: Vitest test infrastructure with Testing Library`
  - Files: `vitest.config.ts, __tests__/setup.ts, package.json, __tests__/example.test.tsx`
  - Pre-commit: `bun test`

- [ ] 5. Base Layout + Tailwind + shadcn/ui Setup

  **What to do**:
  - Initialize shadcn/ui: `bunx shadcn-ui@latest init`
  - Configure theme tokens in globals.css
  - Add base shadcn components: button, card, input, label, form
  - Create app/layout.tsx with proper metadata and fonts
  - Create base layout component with header placeholder

  **Must NOT do**:
  - Do not add authentication UI yet
  - Do not create full navigation yet (separate task)
  - Do not customize theme extensively (stick to defaults for MVP)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component setup with styling considerations
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Component library integration and base styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: All UI tasks (7-10, 13-15, 17-30)
  - **Blocked By**: None

  **References**:
  - shadcn/ui docs: https://ui.shadcn.com/docs - Component installation and customization
  - Next.js metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

  **Acceptance Criteria**:
  - [ ] shadcn/ui initialized with components.json
  - [ ] Base components installed (button, card, input, label, form)
  - [ ] globals.css has Tailwind directives and CSS variables
  - [ ] app/layout.tsx has metadata (title, description)
  - [ ] Base layout renders without errors

  **QA Scenarios**:

  ```
  Scenario: Base layout renders
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to localhost:3000
      2. Verify page loads without errors
      3. Verify Tailwind styles are applied
    Expected Result: Page renders with correct styling, no console errors
    Failure Indicators: 404 errors, unstyled content, console errors
    Evidence: .sisyphus/evidence/task-5-layout-render.png

  Scenario: shadcn components work
    Tool: Playwright
    Preconditions: Base layout exists with button component
    Steps:
      1. Navigate to page with shadcn button
      2. Verify button renders with correct styles
      3. Click button and verify interaction works
    Expected Result: Button renders correctly, click interaction works
    Failure Indicators: Missing styles, click not registering
    Evidence: .sisyphus/evidence/task-5-components.png
  ```

  **Commit**: YES (grouped with 1-4)
  - Message: `chore: shadcn/ui setup with base layout`
  - Files: `components.json, app/globals.css, app/layout.tsx, components/ui/`
  - Pre-commit: `bun run build`

- [ ] 6. NextAuth.js Configuration + Providers

  **What to do**:
  - Install NextAuth.js: `bun add next-auth`
  - Install bcrypt for password hashing: `bun add bcrypt`
  - Configure NextAuth with Credentials provider
  - Create auth options file (lib/auth.ts or lib/next-auth.ts)
  - Set up Prisma adapter for session storage
  - Create auth route handler (app/api/auth/[...nextauth]/route.ts)

  **Must NOT do**:
  - Do not add OAuth providers yet (email/password only for MVP)
  - Do not create signup/login UI yet (separate tasks)
  - Do not skip password hashing

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Authentication is security-critical, requires careful implementation
  - **Skills**: []
    - NextAuth.js with Credentials provider is well-documented

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Wave 1)
  - **Blocks**: Tasks 7-10, all protected routes
  - **Blocked By**: Tasks 1, 2, 3 (needs project, schema, env)

  **References**:
  - NextAuth.js Credentials: https://next-auth.js.org/configuration/providers/credentials - Provider setup
  - NextAuth.js Prisma Adapter: https://next-auth.js.org/adapters/prisma - Session storage
  - Password hashing: https://nextjs.org/docs/app/building-your-application/authentication - bcrypt usage

  **Acceptance Criteria**:
  - [ ] NextAuth.js installed and configured
  - [ ] Credentials provider configured with email/password
  - [ ] Prisma adapter connected for sessions
  - [ ] Auth route handler created at correct path
  - [ ] NEXTAUTH_SECRET and NEXTAUTH_URL configured

  **QA Scenarios**:

  ```
  Scenario: Auth configuration loads
    Tool: Bash
    Preconditions: NextAuth configured, env vars set
    Steps:
      1. Start dev server
      2. Verify no auth configuration errors in console
      3. Check NextAuth.js initializes without errors
    Expected Result: Auth system initializes without errors
    Failure Indicators: Missing env vars, provider configuration errors
    Evidence: .sisyphus/evidence/task-6-auth-init.txt

  Scenario: Session endpoint responds
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl localhost:3000/api/auth/session
      2. Verify JSON response (null for unauthenticated)
    Expected Result: Session endpoint returns valid JSON response
    Failure Indicators: 404 errors, server errors, malformed JSON
    Evidence: .sisyphus/evidence/task-6-session-endpoint.json
  ```

  **Commit**: YES (grouped with 7-10)
  - Message: `feat: NextAuth.js configuration with Credentials provider`
  - Files: `lib/auth.ts, app/api/auth/[...nextauth]/route.ts, package.json`
  - Pre-commit: `bun run build`

- [ ] 7. Sign Up Flow (Server Action + Form)

  **What to do**:
  - Create signup form component with email, password, name fields
  - Implement form validation (Zod schema)
  - Create signup server action with password hashing
  - Handle duplicate email errors
  - Create signup page (app/signup/page.tsx)
  - Redirect to login or home on success

  **Must NOT do**:
  - Do not skip password validation requirements
  - Do not store plain-text passwords
  - Do not auto-login after signup (redirect to login for MVP)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Form UI with validation + server action integration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form design, validation UI, user feedback

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10)
  - **Blocks**: Task 9 (session management needs users)
  - **Blocked By**: Task 6 (needs auth config)

  **References**:
  - Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  - Zod validation: https://zod.dev/ - Schema validation patterns

  **Acceptance Criteria**:
  - [ ] Signup form with email, password, name fields
  - [ ] Client-side validation (Zod schema)
  - [ ] Server action hashes password with bcrypt
  - [ ] Duplicate email returns error
  - [ ] Success redirects to login page

  **QA Scenarios**:

  ```
  Scenario: User can sign up
    Tool: Playwright
    Preconditions: Dev server running, database connected
    Steps:
      1. Navigate to /signup
      2. Fill email: "test@example.com", password: "SecurePass123!", name: "Test User"
      3. Submit form
      4. Verify redirect to /login
      5. Verify user exists in database
    Expected Result: User created, redirected to login, no errors
    Failure Indicators: Form errors, database errors, no redirect
    Evidence: .sisyphus/evidence/task-7-signup-success.png

  Scenario: Duplicate email rejected
    Tool: Playwright
    Preconditions: User "test@example.com" exists
    Steps:
      1. Navigate to /signup
      2. Fill same email, different password
      3. Submit form
      4. Verify error message displayed
    Expected Result: Error message "Email already registered" shown
    Failure Indicators: No error, duplicate created, crash
    Evidence: .sisyphus/evidence/task-7-duplicate-error.png

  Scenario: Invalid email rejected
    Tool: Playwright
    Preconditions: On signup page
    Steps:
      1. Fill email: "not-an-email"
      2. Submit form
      3. Verify validation error before server request
    Expected Result: Client-side validation error shown
    Failure Indicators: Server request made, no error shown
    Evidence: .sisyphus/evidence/task-7-validation-error.png
  ```

  **Commit**: YES (grouped with 6, 8-10)
  - Message: `feat: user signup flow with validation`
  - Files: `app/signup/page.tsx, components/signup-form.tsx, actions/signup.ts`
  - Pre-commit: `bun test`

- [ ] 8. Login Flow (Server Action + Form)

  **What to do**:
  - Create login form component with email, password fields
  - Implement login server action with credentials verification
  - Handle invalid credentials errors
  - Create login page (app/login/page.tsx)
  - Redirect to home on success
  - Display session after login

  **Must NOT do**:
  - Do not implement "remember me" (out of scope)
  - Do not add password reset (out of scope for MVP)
  - Do not skip rate limiting hints

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Form UI with auth flow
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form design, error states, user feedback

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 9, 10)
  - **Blocks**: Task 9 (needs login to test sessions)
  - **Blocked By**: Task 6 (needs auth config)

  **References**:
  - NextAuth.js signIn: https://next-auth.js.org/getting-started/example#adding-a-signin-button

  **Acceptance Criteria**:
  - [ ] Login form with email, password fields
  - [ ] Server action verifies credentials
  - [ ] Invalid credentials returns error
  - [ ] Success creates session and redirects
  - [ ] Session persists across page reloads

  **QA Scenarios**:

  ```
  Scenario: User can login
    Tool: Playwright
    Preconditions: User exists in database
    Steps:
      1. Navigate to /login
      2. Fill credentials (correct email/password)
      3. Submit form
      4. Verify redirect to home page
      5. Verify session exists (check /api/auth/session)
    Expected Result: Login succeeds, session created, redirected to home
    Failure Indicators: Login error, no session, no redirect
    Evidence: .sisyphus/evidence/task-8-login-success.png

  Scenario: Invalid password rejected
    Tool: Playwright
    Preconditions: User exists
    Steps:
      1. Navigate to /login
      2. Fill correct email, wrong password
      3. Submit form
      4. Verify error message displayed
    Expected Result: Error "Invalid credentials" shown, no session created
    Failure Indicators: Login succeeds with wrong password, no error
    Evidence: .sisyphus/evidence/task-8-invalid-password.png

  Scenario: Session persists after reload
    Tool: Playwright
    Preconditions: User logged in
    Steps:
      1. Navigate to home page
      2. Refresh page
      3. Verify user still logged in (check session)
    Expected Result: Session persists, user remains authenticated
    Failure Indicators: Logged out after refresh, session lost
    Evidence: .sisyphus/evidence/task-8-session-persist.png
  ```

  **Commit**: YES (grouped with 6-7, 9-10)
  - Message: `feat: user login flow with session management`
  - Files: `app/login/page.tsx, components/login-form.tsx, actions/login.ts`
  - Pre-commit: `bun test`

- [ ] 9. Session Management + Protected Routes

  **What to do**:
  - Create getServerSession helper for server components
  - Create useSession hook wrapper for client components
  - Implement protected route logic (redirect unauthenticated)
  - Create auth middleware or wrapper for protected pages
  - Handle loading states during session check

  **Must NOT do**:
  - Do not implement role-based access (no roles for MVP)
  - Do not add session expiry handling (default NextAuth behavior)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Session management is security-critical, affects all protected routes
  - **Skills**: []
    - NextAuth.js session patterns are well-documented

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential within wave)
  - **Blocks**: All protected routes (concert reviews, profiles)
  - **Blocked By**: Tasks 6, 7, 8 (needs auth working)

  **References**:
  - NextAuth.js getServerSession: https://next-auth.js.org/configuration/nextjs#in-app-router

  **Acceptance Criteria**:
  - [ ] getServerSession helper created
  - [ ] useSession hook available for client components
  - [ ] Protected routes redirect to login
  - [ ] Session available in server components
  - [ ] Loading state shown during session check

  **QA Scenarios**:

  ```
  Scenario: Protected route redirects unauthenticated
    Tool: Playwright
    Preconditions: User NOT logged in
    Steps:
      1. Navigate to /profile (protected)
      2. Verify redirect to /login
      3. Verify no flash of protected content
    Expected Result: Immediate redirect to login, no protected content shown
    Failure Indicators: Protected page renders, no redirect
    Evidence: .sisyphus/evidence/task-9-protected-redirect.png

  Scenario: Authenticated user accesses protected route
    Tool: Playwright
    Preconditions: User logged in
    Steps:
      1. Navigate to /profile
      2. Verify page loads without redirect
      3. Verify user data displayed
    Expected Result: Protected page loads successfully
    Failure Indicators: Redirect to login, 403 errors
    Evidence: .sisyphus/evidence/task-9-protected-access.png
  ```

  **Commit**: YES (grouped with 6-8, 10)
  - Message: `feat: session management and protected routes`
  - Files: `lib/session.ts, components/auth-provider.tsx, middleware.ts`
  - Pre-commit: `bun test`

- [ ] 10. Logout + Auth UI Components

  **What to do**:
  - Create logout server action
  - Create logout button component
  - Implement signOut functionality
  - Add auth state display (logged in user name)
  - Redirect to home after logout

  **Must NOT do**:
  - Do not add "remember this device" (out of scope)
  - Do not add logout confirmation dialog (overkill for MVP)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple logout flow, well-documented pattern
  - **Skills**: []
    - NextAuth.js signOut is straightforward

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8)
  - **Blocks**: Task 27 (navigation needs logout)
  - **Blocked By**: Task 6 (needs auth config)

  **References**:
  - NextAuth.js signOut: https://next-auth.js.org/getting-started/example#add-a-signout-button

  **Acceptance Criteria**:
  - [ ] Logout server action created
  - [ ] Logout button component works
  - [ ] Session destroyed on logout
  - [ ] Redirect to home after logout
  - [ ] UI shows logged-out state

  **QA Scenarios**:

  ```
  Scenario: User can logout
    Tool: Playwright
    Preconditions: User logged in
    Steps:
      1. Navigate to page with logout button
      2. Click logout
      3. Verify redirect to home
      4. Verify session is null (check /api/auth/session)
    Expected Result: Logout succeeds, session destroyed, redirected to home
    Failure Indicators: Session persists, no redirect, error on logout
    Evidence: .sisyphus/evidence/task-10-logout-success.png

  Scenario: Logout button not shown when logged out
    Tool: Playwright
    Preconditions: User NOT logged in
    Steps:
      1. Navigate to home page
      2. Verify logout button NOT visible
      3. Verify login/signup links visible
    Expected Result: Auth UI shows correct state for logged-out user
    Failure Indicators: Logout button visible, wrong auth state
    Evidence: .sisyphus/evidence/task-10-logout-state.png
  ```

  **Commit**: YES (grouped with 6-9)
  - Message: `feat: logout functionality and auth state UI`
  - Files: `actions/logout.ts, components/logout-button.tsx, components/user-nav.tsx`
  - Pre-commit: `bun test`

- [ ] 11. Setlist.fm API Client + Types

  **What to do**:
  - Create API client module (lib/setlistfm.ts)
  - Define TypeScript types for API responses (Artist, Concert, Venue, Setlist)
  - Implement searchArtists function
  - Implement searchConcerts function
  - Implement getConcertById function
  - Handle API errors gracefully

  **Must NOT do**:
  - Do not implement caching yet (separate task)
  - Do not store API responses in database yet
  - Do not exceed API rate limits

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard API client with typed responses
  - **Skills**: []
    - REST API integration is straightforward

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12-15)
  - **Blocks**: Tasks 12-15 (need API client)
  - **Blocked By**: Task 3 (needs API key configured)

  **References**:
  - Setlist.fm API docs: https://api.setlist.fm/docs/1.0/ - API endpoints and response formats
  - Setlist.fm API examples: https://api.setlist.fm/docs/1.0/ui/index.html

  **Acceptance Criteria**:
  - [ ] API client module created with base URL and auth
  - [ ] TypeScript types for Artist, Concert, Venue, Setlist
  - [ ] searchArtists(query: string) function works
  - [ ] searchConcerts(artistMbid: string) function works
  - [ ] getConcertById(id: string) function works
  - [ ] Errors handled with proper error messages

  **QA Scenarios**:

  ```
  Scenario: Search for artist returns results
    Tool: Bash (curl via test)
    Preconditions: SETLIST_FM_API_KEY configured
    Steps:
      1. Call searchArtists("Radiohead")
      2. Verify array of artists returned
      3. Verify each artist has name, mbid
    Expected Result: Artist search returns valid results with required fields
    Failure Indicators: Empty results, missing fields, API errors
    Evidence: .sisyphus/evidence/task-11-search-artists.json

  Scenario: Get concert by ID
    Tool: Bash
    Preconditions: Known concert ID from setlist.fm
    Steps:
      1. Call getConcertById(known-id)
      2. Verify concert data returned
      3. Verify setlist, venue, date present
    Expected Result: Concert data returned with all fields
    Failure Indicators: 404 error, missing fields, malformed data
    Evidence: .sisyphus/evidence/task-11-get-concert.json

  Scenario: Invalid API key rejected
    Tool: Bash
    Preconditions: Invalid API key configured
    Steps:
      1. Call any API function
      2. Verify proper error returned (not crash)
    Expected Result: Graceful error handling, clear error message
    Failure Indicators: Unhandled exception, confusing error
    Evidence: .sisyphus/evidence/task-11-invalid-key.txt
  ```

  **Commit**: YES (grouped with 12-15)
  - Message: `feat: Setlist.fm API client with TypeScript types`
  - Files: `lib/setlistfm.ts, types/setlistfm.ts`
  - Pre-commit: `bun test`

- [ ] 12. Concert Search API Route + Caching

  **What to do**:
  - Create API route: app/api/concerts/search/route.ts
  - Implement search with query parameters (artist, venue, date range)
  - Add unstable_cache with tagged revalidation
  - Implement pagination (page param)
  - Return JSON response with concerts

  **Must NOT do**:
  - Do not cache indefinitely (use reasonable revalidation)
  - Do not expose API key to client
  - Do not implement complex filtering yet

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Caching strategy critical for performance and API rate limits
  - **Skills**: []
    - Next.js caching patterns well-documented

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (depends on Task 11)
  - **Blocks**: Tasks 13, 25, 28
  - **Blocked By**: Task 11 (needs API client)

  **References**:
  - Next.js unstable_cache: https://nextjs.org/docs/app/building-your-application/caching#unstable_cache
  - Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

  **Acceptance Criteria**:
  - [ ] API route created at /api/concerts/search
  - [ ] Accepts query params: artist, venue, page
  - [ ] Returns paginated concert results
  - [ ] unstable_cache configured with 1-hour revalidation
  - [ ] Cache tags enable manual invalidation

  **QA Scenarios**:

  ```
  Scenario: Concert search returns results
    Tool: Bash (curl)
    Preconditions: API configured, dev server running
    Steps:
      1. curl /api/concerts/search?artist=Radiohead
      2. Verify JSON response with concerts array
      3. Verify each concert has id, artist, venue, date
    Expected Result: Valid JSON with concert data
    Failure Indicators: Empty results, errors, missing fields
    Evidence: .sisyphus/evidence/task-12-search-response.json

  Scenario: Caching works (second request faster)
    Tool: Bash
    Preconditions: First request made and cached
    Steps:
      1. Time first request to /api/concerts/search
      2. Time second identical request
      3. Verify second request faster (cache hit)
    Expected Result: Second request significantly faster
    Failure Indicators: Same response time, cache miss
    Evidence: .sisyphus/evidence/task-12-cache-timing.txt
  ```

  **Commit**: YES (grouped with 11-15)
  - Message: `feat: concert search API with caching`
  - Files: `app/api/concerts/search/route.ts`
  - Pre-commit: `bun test`

- [ ] 13. Concert Detail Page + Data Fetching

  **What to do**:
  - Create concert detail page: app/concerts/[id]/page.tsx
  - Fetch concert data from API route or Setlist.fm
  - Display concert info: date, venue, artists, setlist
  - Add loading state
  - Add error state (concert not found)

  **Must NOT do**:
  - Do not add review creation yet (separate task)
  - Do not add "attend" functionality yet

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI page with data fetching and display
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Page layout, data presentation, loading states

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 14, 15)
  - **Blocks**: Tasks 20, 25 (review display needs concert page)
  - **Blocked By**: Task 12 (needs API route)

  **References**:
  - Next.js dynamic routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
  - Next.js data fetching: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching

  **Acceptance Criteria**:
  - [ ] Concert detail page at /concerts/[id]
  - [ ] Displays: date, venue, artists, setlist
  - [ ] Loading state shown during fetch
  - [ ] 404 shown for invalid concert ID
  - [ ] Responsive layout

  **QA Scenarios**:

  ```
  Scenario: Concert detail page loads
    Tool: Playwright
    Preconditions: Dev server running, valid concert ID
    Steps:
      1. Navigate to /concerts/[valid-id]
      2. Verify loading state shown briefly
      3. Verify concert data displayed
      4. Verify setlist visible
    Expected Result: Concert info loads and displays correctly
    Failure Indicators: 404 for valid ID, missing data, infinite loading
    Evidence: .sisyphus/evidence/task-13-concert-detail.png

  Scenario: Invalid concert shows 404
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /concerts/invalid-id-12345
      2. Verify 404 page displayed
    Expected Result: 404 error page shown
    Failure Indicators: Page crashes, empty page, wrong error
    Evidence: .sisyphus/evidence/task-13-404.png
  ```

  **Commit**: YES (grouped with 11-15)
  - Message: `feat: concert detail page with data fetching`
  - Files: `app/concerts/[id]/page.tsx, components/concert-detail.tsx`
  - Pre-commit: `bun run build`

- [ ] 14. Artist Display Components

  **What to do**:
  - Create ArtistCard component
  - Display: artist name, image (if available), link to artist page
  - Create ArtistList component for multiple artists
  - Handle missing images gracefully

  **Must NOT do**:
  - Do not create full artist page (out of scope for MVP)
  - Do not fetch additional artist data

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple display component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Card component design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 15)
  - **Blocks**: Task 13 (concert detail uses artist components)
  - **Blocked By**: Task 11 (needs artist types)

  **References**:
  - shadcn/ui Card: https://ui.shadcn.com/docs/components/card

  **Acceptance Criteria**:
  - [ ] ArtistCard component created
  - [ ] Displays artist name, optional image
  - [ ] ArtistList renders multiple artists
  - [ ] Handles missing images gracefully (fallback)

  **QA Scenarios**:

  ```
  Scenario: Artist card renders
    Tool: Playwright
    Preconditions: Component exists with artist data
    Steps:
      1. Render ArtistCard with test artist
      2. Verify name displayed
      3. Verify image or fallback shown
    Expected Result: Artist card renders correctly
    Failure Indicators: Missing data, broken layout
    Evidence: .sisyphus/evidence/task-14-artist-card.png
  ```

  **Commit**: YES (grouped with 11-15)
  - Message: `feat: artist display components`
  - Files: `components/artist-card.tsx, components/artist-list.tsx`
  - Pre-commit: `bun run build`

- [ ] 15. Venue Display Components

  **What to do**:
  - Create VenueCard component
  - Display: venue name, city, country, map link (optional)
  - Handle missing venue data gracefully

  **Must NOT do**:
  - Do not integrate real maps (out of scope)
  - Do not fetch additional venue data

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple display component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Component styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14)
  - **Blocks**: Task 13 (concert detail uses venue)
  - **Blocked By**: Task 11 (needs venue types)

  **References**:
  - shadcn/ui Card: https://ui.shadcn.com/docs/components/card

  **Acceptance Criteria**:
  - [ ] VenueCard component created
  - [ ] Displays: name, city, country
  - [ ] Handles missing data gracefully

  **QA Scenarios**:

  ```
  Scenario: Venue card renders
    Tool: Playwright
    Preconditions: Component exists with venue data
    Steps:
      1. Render VenueCard with test venue
      2. Verify name, city, country displayed
    Expected Result: Venue info displays correctly
    Failure Indicators: Missing fields, layout broken
    Evidence: .sisyphus/evidence/task-15-venue-card.png
  ```

  **Commit**: YES (grouped with 11-15)
  - Message: `feat: venue display components`
  - Files: `components/venue-card.tsx`
  - Pre-commit: `bun run build`

- [ ] 16. Review Schema + Prisma Migrations

  **What to do**:
  - Add Review model to Prisma schema with: id, userId, concertId, rating, text, setlistHighlights, attended, createdAt, updatedAt
  - Add relations: Review → User, Review → Concert
  - Run Prisma migration: `bunx prisma migrate dev --name add_reviews`
  - Create Review type exports

  **Must NOT do**:
  - Do not create seed data yet
  - Do not add review CRUD yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Prisma model addition
  - **Skills**: []
    - Prisma migrations are straightforward

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 17-21)
  - **Blocks**: Tasks 17-21 (need Review model)
  - **Blocked By**: Tasks 2, 11 (need base schema, concert types)

  **References**:
  - Prisma migrations: https://www.prisma.io/docs/concepts/components/prisma-migrations

  **Acceptance Criteria**:
  - [ ] Review model added to schema with all fields
  - [ ] Relations defined correctly
  - [ ] Migration runs successfully
  - [ ] Prisma client regenerated

  **QA Scenarios**:

  ```
  Scenario: Migration applies successfully
    Tool: Bash
    Preconditions: Schema updated with Review model
    Steps:
      1. Run: bunx prisma migrate dev --name add_reviews
      2. Verify migration file created
      3. Verify database table created
    Expected Result: Migration succeeds, reviews table exists
    Failure Indicators: Migration errors, missing table
    Evidence: .sisyphus/evidence/task-16-migration.txt

  Scenario: Review model types generated
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run: bunx prisma generate
      2. Import Review type in test file
      3. Verify TypeScript compilation succeeds
    Expected Result: Review type available in Prisma client
    Failure Indicators: Type errors, missing Review type
    Evidence: .sisyphus/evidence/task-16-types.txt
  ```

  **Commit**: YES (grouped with 17-21)
  - Message: `feat: Review model with database migration`
  - Files: `prisma/schema.prisma, prisma/migrations/`
  - Pre-commit: `bunx prisma validate`

- [ ] 17. Create Review Form + Server Action

  **What to do**:
  - Create review form component with: star rating, text area, setlist highlights input, attended checkbox
  - Implement form validation (Zod)
  - Create createReview server action
  - Link review to authenticated user and concert
  - Handle form submission and errors
  - Redirect to concert page on success

  **Must NOT do**:
  - Do not allow editing yet (separate task)
  - Do not allow reviews without authentication

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Form UI with complex fields (star rating, multi-input)
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form design, custom inputs (star rating)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (depends on Task 16)
  - **Blocks**: Tasks 18-21, 25
  - **Blocked By**: Tasks 9, 13, 16 (needs auth, concert page, schema)

  **References**:
  - Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  - shadcn/ui Form: https://ui.shadcn.com/docs/components/form

  **Acceptance Criteria**:
  - [ ] Review form with all fields (rating, text, highlights, attended)
  - [ ] Star rating input works (1-5 selection)
  - [ ] Form validation (required fields, rating 1-5)
  - [ ] Server action creates review in database
  - [ ] Redirects to concert page after success
  - [ ] Shows error on failure

  **QA Scenarios**:

  ```
  Scenario: User creates review
    Tool: Playwright
    Preconditions: User logged in, on concert page
    Steps:
      1. Click "Write Review" button
      2. Fill rating: 5 stars, text: "Amazing show!", highlights: "Song1, Song2"
      3. Check "Attended" checkbox
      4. Submit form
      5. Verify redirect to concert page
      6. Verify review appears on page
    Expected Result: Review created, displayed on concert page
    Failure Indicators: Form errors, no redirect, review not saved
    Evidence: .sisyphus/evidence/task-17-create-review.png

  Scenario: Unauthenticated user cannot review
    Tool: Playwright
    Preconditions: User NOT logged in, on concert page
    Steps:
      1. Try to access review form
      2. Verify redirect to login or disabled state
    Expected Result: Unauthenticated user blocked from creating review
    Failure Indicators: Form accessible, review created without auth
    Evidence: .sisyphus/evidence/task-17-unauth-review.png

  Scenario: Invalid rating rejected
    Tool: Playwright
    Preconditions: On review form
    Steps:
      1. Fill text but skip rating
      2. Submit form
      3. Verify validation error
    Expected Result: Validation error shown, form not submitted
    Failure Indicators: Form submits without rating
    Evidence: .sisyphus/evidence/task-17-validation.png
  ```

  **Commit**: YES (grouped with 16, 18-21)
  - Message: `feat: create review form and server action`
  - Files: `components/review-form.tsx, actions/create-review.ts`
  - Pre-commit: `bun test`

- [ ] 18. Edit Review Flow

  **What to do**:
  - Create edit review page/modal
  - Pre-fill form with existing review data
  - Create updateReview server action
  - Only allow user to edit their own reviews
  - Redirect after successful update

  **Must NOT do**:
  - Do not allow editing others' reviews
  - Do not add version history

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Form UI similar to create, with ownership check
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form pre-filling, edit UX

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (depends on Task 17)
  - **Blocks**: Task 20 (display needs edit button)
  - **Blocked By**: Task 17 (needs create working first)

  **References**:
  - Same as Task 17

  **Acceptance Criteria**:
  - [ ] Edit button on user's reviews
  - [ ] Edit form pre-filled with existing data
  - [ ] updateReview server action works
  - [ ] Ownership check (can only edit own reviews)
  - [ ] Redirect after update

  **QA Scenarios**:

  ```
  Scenario: User edits own review
    Tool: Playwright
    Preconditions: User logged in, has existing review
    Steps:
      1. Navigate to review
      2. Click "Edit" button
      3. Modify text field
      4. Submit
      5. Verify changes saved and displayed
    Expected Result: Review updated, changes visible
    Failure Indicators: Edit fails, changes not saved
    Evidence: .sisyphus/evidence/task-18-edit-own.png

  Scenario: User cannot edit others' reviews
    Tool: Playwright
    Preconditions: User logged in, viewing another user's review
    Steps:
      1. Check for "Edit" button
      2. Verify NOT visible
    Expected Result: Edit button not shown for others' reviews
    Failure Indicators: Edit button visible, edit allowed
    Evidence: .sisyphus/evidence/task-18-edit-others.png
  ```

  **Commit**: YES (grouped with 16-17, 19-21)
  - Message: `feat: edit review functionality`
  - Files: `app/reviews/[id]/edit/page.tsx, actions/update-review.ts`
  - Pre-commit: `bun test`

- [ ] 19. Delete Review + Confirmation

  **What to do**:
  - Create deleteReview server action
  - Add delete button to user's reviews
  - Implement confirmation dialog
  - Only allow deleting own reviews
  - Redirect after deletion

  **Must NOT do**:
  - Do not add soft delete (hard delete for MVP)
  - Do not add undo/delete recovery

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple delete pattern with confirmation
  - **Skills**: []
    - Delete with confirmation is standard

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 20, 21)
  - **Blocks**: Task 20 (display refreshes after delete)
  - **Blocked By**: Task 16 (needs Review model)

  **References**:
  - shadcn/ui Alert Dialog: https://ui.shadcn.com/docs/components/alert-dialog

  **Acceptance Criteria**:
  - [ ] Delete button on user's reviews
  - [ ] Confirmation dialog before delete
  - [ ] deleteReview server action works
  - [ ] Ownership check enforced
  - [ ] Redirect/refresh after delete

  **QA Scenarios**:

  ```
  Scenario: User deletes own review
    Tool: Playwright
    Preconditions: User logged in, has existing review
    Steps:
      1. Click "Delete" button
      2. Confirm in dialog
      3. Verify review removed from page
    Expected Result: Review deleted, no longer visible
    Failure Indicators: Delete fails, review still visible
    Evidence: .sisyphus/evidence/task-19-delete-own.png

  Scenario: Cancel delete works
    Tool: Playwright
    Preconditions: On delete confirmation dialog
    Steps:
      1. Click "Delete" button
      2. Click "Cancel" in dialog
      3. Verify review still present
    Expected Result: Review not deleted after cancel
    Failure Indicators: Review deleted despite cancel
    Evidence: .sisyphus/evidence/task-19-cancel-delete.png
  ```

  **Commit**: YES (grouped with 16-18, 20-21)
  - Message: `feat: delete review with confirmation`
  - Files: `actions/delete-review.ts, components/delete-review-button.tsx`
  - Pre-commit: `bun test`

- [ ] 20. Review Display Component

  **What to do**:
  - Create ReviewCard component
  - Display: rating (stars), user name, text, setlist highlights, attended badge, date
  - Show edit/delete buttons for owner
  - Create ReviewList component for multiple reviews

  **Must NOT do**:
  - Do not add comments (out of scope)
  - Do not add likes (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card component with conditional UI (owner actions)
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Card design, conditional rendering

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 19, 21)
  - **Blocks**: Tasks 23, 24, 25 (need review display)
  - **Blocked By**: Tasks 17, 18, 19 (needs CRUD to know structure)

  **References**:
  - shadcn/ui Card: https://ui.shadcn.com/docs/components/card
  - shadcn/ui Badge: https://ui.shadcn.com/docs/components/badge

  **Acceptance Criteria**:
  - [ ] ReviewCard displays all review fields
  - [ ] Star rating rendered visually
  - [ ] Attended badge shown when applicable
  - [ ] Edit/delete buttons for owner only
  - [ ] ReviewList renders multiple reviews

  **QA Scenarios**:

  ```
  Scenario: Review card displays correctly
    Tool: Playwright
    Preconditions: Review exists in database
    Steps:
      1. Navigate to page with review
      2. Verify all fields visible (rating, text, highlights, date)
      3. Verify attended badge if applicable
    Expected Result: All review data displayed correctly
    Failure Indicators: Missing fields, wrong formatting
    Evidence: .sisyphus/evidence/task-20-review-display.png

  Scenario: Owner sees edit/delete buttons
    Tool: Playwright
    Preconditions: User logged in, viewing own review
    Steps:
      1. Navigate to review
      2. Verify "Edit" button visible
      3. Verify "Delete" button visible
    Expected Result: Owner action buttons visible
    Failure Indicators: Buttons missing for owner
    Evidence: .sisyphus/evidence/task-20-owner-buttons.png
  ```

  **Commit**: YES (grouped with 16-19, 21)
  - Message: `feat: review display components`
  - Files: `components/review-card.tsx, components/review-list.tsx`
  - Pre-commit: `bun run build`

- [ ] 21. Star Rating Component + Validation

  **What to do**:
  - Create StarRating display component (read-only)
  - Create StarRatingInput component (interactive, for forms)
  - Implement 1-5 star selection
  - Add validation (required, 1-5 range)

  **Must NOT do**:
  - Do not support half-stars (whole numbers only for MVP)
  - Do not add hover animations (optional polish)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple reusable component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Interactive component, icons

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 19, 20)
  - **Blocks**: Task 17 (review form uses star input)
  - **Blocked By**: None (can be done early in wave)

  **References**:
  - Lucide icons (for stars): https://lucide.dev/icons/star

  **Acceptance Criteria**:
  - [ ] StarRating displays correct number of filled stars
  - [ ] StarRatingInput allows 1-5 selection
  - [ ] Visual feedback on hover/click
  - [ ] Value prop works for controlled component

  **QA Scenarios**:

  ```
  Scenario: Star rating displays correctly
    Tool: Playwright
    Preconditions: StarRating component with rating=4
    Steps:
      1. Render component with rating prop = 4
      2. Verify 4 stars filled, 1 empty
    Expected Result: Correct number of filled stars
    Failure Indicators: Wrong count, all filled, all empty
    Evidence: .sisyphus/evidence/task-21-rating-display.png

  Scenario: Star input allows selection
    Tool: Playwright
    Preconditions: StarRatingInput in form
    Steps:
      1. Click on 3rd star
      2. Verify 3 stars filled
      3. Verify form value updated to 3
    Expected Result: Clicking stars updates value
    Failure Indicators: No visual feedback, value not updated
    Evidence: .sisyphus/evidence/task-21-rating-input.png
  ```

  **Commit**: YES (grouped with 16-20)
  - Message: `feat: star rating display and input components`
  - Files: `components/star-rating.tsx, components/star-rating-input.tsx`
  - Pre-commit: `bun run build`

- [ ] 22. User Profile Page (Public)

  **What to do**:
  - Create user profile page: app/profiles/[userId]/page.tsx
  - Fetch user's public info (name, join date, stats)
  - Display: total reviews, attended concerts
  - Add profile header with user info

  **Must NOT do**:
  - Do not add follows/followers (deferred)
  - Do not add profile editing (out of scope for MVP)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Public profile page layout
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Profile page design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 23-26)
  - **Blocks**: Task 23 (profile reviews list)
  - **Blocked By**: Tasks 9, 16 (needs auth, review model)

  **References**:
  - Next.js dynamic routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

  **Acceptance Criteria**:
  - [ ] Profile page accessible at /profiles/[userId]
  - [ ] Displays user name, join date
  - [ ] Shows stats: total reviews, attended count
  - [ ] Public (no auth required to view)
  - [ ] 404 for non-existent users

  **QA Scenarios**:

  ```
  Scenario: Profile page loads
    Tool: Playwright
    Preconditions: User exists in database
    Steps:
      1. Navigate to /profiles/[userId]
      2. Verify user info displayed
      3. Verify stats shown (reviews count, attended count)
    Expected Result: Profile loads with correct user data
    Failure Indicators: 404 for existing user, wrong data
    Evidence: .sisyphus/evidence/task-22-profile-page.png

  Scenario: Profile is publicly accessible
    Tool: Playwright
    Preconditions: User exists, viewer NOT logged in
    Steps:
      1. Navigate to /profiles/[userId] without logging in
      2. Verify page loads (no auth redirect)
    Expected Result: Profile visible to unauthenticated users
    Failure Indicators: Redirect to login, auth required
    Evidence: .sisyphus/evidence/task-22-public-profile.png
  ```

  **Commit**: YES (grouped with 23-26)
  - Message: `feat: public user profile pages`
  - Files: `app/profiles/[userId]/page.tsx, components/profile-header.tsx`
  - Pre-commit: `bun run build`

- [ ] 23. Profile Page Reviews List

  **What to do**:
  - Add reviews list to profile page
  - Fetch user's reviews from database
  - Display using ReviewList component
  - Add pagination if needed (10 per page)

  **Must NOT do**:
  - Do not add filtering/sorting (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: List display with data fetching
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: List layout, pagination

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (depends on Task 22)
  - **Blocks**: Task 24 (browse page uses similar pattern)
  - **Blocked By**: Tasks 20, 22 (needs review display, profile page)

  **References**:
  - Prisma pagination: https://www.prisma.io/docs/concepts/components/prisma-client/pagination

  **Acceptance Criteria**:
  - [ ] Reviews list on profile page
  - [ ] Shows all user's reviews
  - [ ] Uses ReviewList component
  - [ ] Pagination for 10+ reviews

  **QA Scenarios**:

  ```
  Scenario: Profile shows user's reviews
    Tool: Playwright
    Preconditions: User has 3+ reviews
    Steps:
      1. Navigate to user's profile
      2. Verify reviews list visible
      3. Verify each review displays correctly
    Expected Result: All user reviews displayed on profile
    Failure Indicators: Empty list, wrong user's reviews
    Evidence: .sisyphus/evidence/task-23-profile-reviews.png

  Scenario: Pagination works for many reviews
    Tool: Playwright
    Preconditions: User has 15+ reviews
    Steps:
      1. Navigate to profile
      2. Verify page 1 shows first 10
      3. Click "Next" or page 2
      4. Verify reviews 11-15 shown
    Expected Result: Pagination navigates through reviews
    Failure Indicators: All on one page, pagination broken
    Evidence: .sisyphus/evidence/task-23-pagination.png
  ```

  **Commit**: YES (grouped with 22, 24-26)
  - Message: `feat: profile reviews list with pagination`
  - Files: `components/profile-reviews.tsx`
  - Pre-commit: `bun run build`

- [ ] 24. Browse/Recent Reviews Page

  **What to do**:
  - Create browse page: app/browse/page.tsx
  - Fetch recent reviews from all users
  - Display using ReviewList component
  - Add pagination (20 per page)
  - Show concert info with each review

  **Must NOT do**:
  - Do not add advanced filtering (deferred)
  - Do not add search (separate task)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Feed-style page layout
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Feed design, infinite scroll or pagination

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 22, 25, 26)
  - **Blocks**: Task 27 (navigation links to browse)
  - **Blocked By**: Task 20 (needs review display)

  **Acceptance Criteria**:
  - [ ] Browse page at /browse
  - [ ] Shows recent reviews from all users
  - [ ] Each review shows concert info
  - [ ] Pagination works

  **QA Scenarios**:

  ```
  Scenario: Browse page shows recent reviews
    Tool: Playwright
    Preconditions: Multiple reviews exist in database
    Steps:
      1. Navigate to /browse
      2. Verify reviews displayed, newest first
      3. Verify concert info shown with each
    Expected Result: Recent reviews displayed in correct order
    Failure Indicators: Wrong order, missing reviews, no concert info
    Evidence: .sisyphus/evidence/task-24-browse-page.png

  Scenario: Browse is publicly accessible
    Tool: Playwright
    Preconditions: NOT logged in
    Steps:
      1. Navigate to /browse
      2. Verify page loads without redirect
    Expected Result: Browse page public
    Failure Indicators: Auth redirect
    Evidence: .sisyphus/evidence/task-24-public-browse.png
  ```

  **Commit**: YES (grouped with 22-23, 25-26)
  - Message: `feat: browse page with recent reviews`
  - Files: `app/browse/page.tsx, components/browse-reviews.tsx`
  - Pre-commit: `bun run build`

- [ ] 25. Concert-Attached Reviews List

  **What to do**:
  - Add reviews section to concert detail page
  - Fetch reviews for specific concert
  - Display using ReviewList component
  - Show "Write Review" button for authenticated users
  - Show average rating

  **Must NOT do**:
  - Do not add review sorting (newest first only for MVP)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Page section with conditional CTAs
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Section layout, conditional buttons

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (depends on Task 13)
  - **Blocks**: None (final review display piece)
  - **Blocked By**: Tasks 13, 17, 20 (needs concert page, review creation, display)

  **Acceptance Criteria**:
  - [ ] Reviews section on concert page
  - [ ] Shows all reviews for concert
  - [ ] Average rating calculated and displayed
  - [ ] "Write Review" button for authenticated users
  - [ ] Button hidden for unauthenticated

  **QA Scenarios**:

  ```
  Scenario: Concert page shows reviews
    Tool: Playwright
    Preconditions: Concert has 2+ reviews
    Steps:
      1. Navigate to concert page
      2. Verify reviews section visible
      3. Verify all reviews displayed
      4. Verify average rating shown
    Expected Result: Reviews displayed with average rating
    Failure Indicators: No reviews shown, wrong average
    Evidence: .sisyphus/evidence/task-25-concert-reviews.png

  Scenario: Write Review button visibility
    Tool: Playwright
    Preconditions: On concert page
    Steps:
      1. Check button NOT visible when logged out
      2. Log in
      3. Verify button IS visible
    Expected Result: Button shows only for authenticated users
    Failure Indicators: Button always visible or never visible
    Evidence: .sisyphus/evidence/task-25-write-button.png
  ```

  **Commit**: YES (grouped with 22-24, 26)
  - Message: `feat: concert page reviews section`
  - Files: `components/concert-reviews.tsx` (added to concert page)
  - Pre-commit: `bun run build`

- [ ] 26. Attended Check-in Functionality

  **What to do**:
  - Add "I Attended" button to concert page
  - Toggle attended status on review
  - If no review exists, prompt to create one
  - Update attended flag via server action
  - Display attended count on concert page

  **Must NOT do**:
  - Do not require review to mark attended (can mark without review)
  - Do not add attended feed (deferred)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple toggle functionality
  - **Skills**: []
    - Basic toggle with database update

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 22, 24)
  - **Blocks**: None
  - **Blocked By**: Task 16 (needs Review model with attended field)

  **Acceptance Criteria**:
  - [ ] "I Attended" button on concert page
  - [ ] Button toggles attended status
  - [ ] Creates review if needed (with attended=true)
  - [ ] Updates existing review if exists
  - [ ] Attended count displayed

  **QA Scenarios**:

  ```
  Scenario: User marks concert as attended
    Tool: Playwright
    Preconditions: User logged in, on concert page, no existing review
    Steps:
      1. Click "I Attended" button
      2. Verify button state changes to "Attended"
      3. Verify attended count increments
      4. Check database: review created with attended=true
    Expected Result: Concert marked as attended, count updated
    Failure Indicators: Button doesn't toggle, count wrong, no database update
    Evidence: .sisyphus/evidence/task-26-attended-toggle.png

  Scenario: Attended persists after reload
    Tool: Playwright
    Preconditions: User marked concert as attended
    Steps:
      1. Refresh page
      2. Verify button still shows "Attended"
    Expected Result: Attended status persists
    Failure Indicators: Status resets after reload
    Evidence: .sisyphus/evidence/task-26-attended-persist.png
  ```

  **Commit**: YES (grouped with 22-25)
  - Message: `feat: attended check-in functionality`
  - Files: `components/attended-button.tsx, actions/toggle-attended.ts`
  - Pre-commit: `bun test`

- [ ] 27. Navigation + Header Component

  **What to do**:
  - Create header component with site logo/name
  - Add navigation links: Home, Browse, Search
  - Add auth-aware user menu (login/signup when logged out, logout/profile when logged in)
  - Make header sticky/fixed at top
  - Ensure responsive (mobile hamburger menu)

  **Must NOT do**:
  - Do not add complex mega-menus
  - Do not add notifications (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Navigation UI with responsive behavior
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Navigation design, responsive menus

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 28-32)
  - **Blocks**: None (final polish)
  - **Blocked By**: Task 10 (needs logout), Task 22 (needs profile link)

  **Acceptance Criteria**:
  - [ ] Header displays on all pages
  - [ ] Navigation links work
  - [ ] Auth state reflected in user menu
  - [ ] Mobile responsive (hamburger menu)
  - [ ] Sticky positioning works

  **QA Scenarios**:

  ```
  Scenario: Header displays on all pages
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to home, browse, concert, profile pages
      2. Verify header visible on each
      3. Verify navigation links present
    Expected Result: Header consistent across all pages
    Failure Indicators: Missing header, broken links
    Evidence: .sisyphus/evidence/task-27-header-pages.png

  Scenario: Mobile navigation works
    Tool: Playwright
    Preconditions: On mobile viewport (375px width)
    Steps:
      1. Set viewport to mobile size
      2. Verify hamburger menu visible
      3. Click hamburger, verify menu opens
      4. Click nav item, verify navigation
    Expected Result: Mobile nav functional
    Failure Indicators: No hamburger, menu doesn't open
    Evidence: .sisyphus/evidence/task-27-mobile-nav.png
  ```

  **Commit**: YES (grouped with 28-32)
  - Message: `feat: navigation header with responsive design`
  - Files: `components/header.tsx, components/mobile-nav.tsx`
  - Pre-commit: `bun run build`

- [ ] 28. Search UI + Autocomplete

  **What to do**:
  - Create search input component with autocomplete
  - Fetch artist suggestions as user types (debounced)
  - Display dropdown with matching artists
  - Navigate to artist's concerts on selection
  - Add search to header

  **Must NOT do**:
  - Do not implement full-text search (just artist name for MVP)
  - Do not add advanced filters

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Interactive search with async data
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Autocomplete UX, dropdown design

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (depends on Task 12)
  - **Blocks**: None
  - **Blocked By**: Task 12 (needs concert search API)

  **Acceptance Criteria**:
  - [ ] Search input in header
  - [ ] Autocomplete shows artist suggestions
  - [ ] Debounced API calls (300ms)
  - [ ] Click suggestion navigates to concerts
  - [ ] Keyboard navigation (arrow keys, enter)

  **QA Scenarios**:

  ```
  Scenario: Search autocomplete works
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Type "Radio" in search
      2. Wait for debounce
      3. Verify suggestions dropdown appears
      4. Verify "Radiohead" in suggestions
    Expected Result: Autocomplete shows matching artists
    Failure Indicators: No suggestions, wrong matches
    Evidence: .sisyphus/evidence/task-28-autocomplete.png

  Scenario: Search navigation works
    Tool: Playwright
    Preconditions: Suggestions visible
    Steps:
      1. Click on artist suggestion
      2. Verify navigate to concert search for that artist
    Expected Result: Navigation to artist concerts page
    Failure Indicators: No navigation, wrong page
    Evidence: .sisyphus/evidence/task-28-search-nav.png
  ```

  **Commit**: YES (grouped with 27, 29-32)
  - Message: `feat: search with autocomplete`
  - Files: `components/search-input.tsx, components/search-results.tsx`
  - Pre-commit: `bun run build`

- [ ] 29. Error Boundaries + Loading States

  **What to do**:
  - Create error boundary component
  - Add loading skeletons for main pages
  - Handle API errors gracefully
  - Add 404 page customization
  - Add 500 error page

  **Must NOT do**:
  - Do not add error reporting service (deferred)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard error handling patterns
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Error state design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 27, 30-32)
  - **Blocks**: None
  - **Blocked By**: None (can be done anytime)

  **Acceptance Criteria**:
  - [ ] Error boundary catches React errors
  - [ ] Loading skeletons on concert/review pages
  - [ ] Custom 404 page
  - [ ] Custom 500 page
  - [ ] Graceful API error messages

  **QA Scenarios**:

  ```
  Scenario: Loading state displays
    Tool: Playwright
    Preconditions: Slow network throttling enabled
    Steps:
      1. Navigate to concert page
      2. Verify skeleton/loading shown during fetch
      3. Verify content replaces loading state
    Expected Result: Loading state visible, then content
    Failure Indicators: No loading state, blank page
    Evidence: .sisyphus/evidence/task-29-loading.png

  Scenario: Error boundary catches errors
    Tool: Bash
    Preconditions: Trigger error in component
    Steps:
      1. Force error in test component
      2. Verify error boundary renders fallback
      3. Verify no crash
    Expected Result: Error caught, fallback shown
    Failure Indicators: App crashes, white screen
    Evidence: .sisyphus/evidence/task-29-error-boundary.png
  ```

  **Commit**: YES (grouped with 27-28, 30-32)
  - Message: `chore: error boundaries and loading states`
  - Files: `components/error-boundary.tsx, components/loading-skeleton.tsx, app/not-found.tsx, app/error.tsx`
  - Pre-commit: `bun run build`

- [ ] 30. SEO Metadata + OpenGraph

  **What to do**:
  - Add generateMetadata to all pages
  - Set title, description for each route
  - Add OpenGraph images for concert/review pages
  - Add Twitter card metadata
  - Create sitemap.xml

  **Must NOT do**:
  - Do not add RSS feeds (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Next.js metadata patterns
  - **Skills**: []
    - Next.js metadata API is straightforward

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 27-29, 31-32)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

  **Acceptance Criteria**:
  - [ ] Dynamic metadata on concert pages
  - [ ] Dynamic metadata on review pages
  - [ ] OpenGraph tags for social sharing
  - [ ] sitemap.xml generated

  **QA Scenarios**:

  ```
  Scenario: Page metadata is correct
    Tool: Bash
    Preconditions: Dev server running
    Steps:
      1. Fetch concert page HTML
      2. Parse <title> tag
      3. Verify contains concert info
      4. Verify OpenGraph tags present
    Expected Result: Correct title and OG tags
    Failure Indicators: Missing tags, generic titles
    Evidence: .sisyphus/evidence/task-30-metadata.txt

  Scenario: Sitemap is generated
    Tool: Bash
    Preconditions: Production build or sitemap route exists
    Steps:
      1. Fetch /sitemap.xml
      2. Verify XML structure
      3. Verify concert/profile URLs included
    Expected Result: Valid sitemap with site URLs
    Failure Indicators: 404, invalid XML, missing URLs
    Evidence: .sisyphus/evidence/task-30-sitemap.xml
  ```

  **Commit**: YES (grouped with 27-29, 31-32)
  - Message: `chore: SEO metadata and OpenGraph tags`
  - Files: `app/**/page.tsx (metadata exports), app/sitemap.ts`
  - Pre-commit: `bun run build`

- [ ] 31. Local PostgreSQL Setup + Database Seeding

  **What to do**:
  - Install and configure PostgreSQL locally (Docker or native)
  - Update .env.local with local database URL
  - Run Prisma migrations locally: `bunx prisma migrate dev`
  - Create seed script for test data (sample users, concerts, reviews)
  - Verify local database connection works
  - Document local setup process in README

  **Must NOT do**:
  - Do not use production database credentials
  - Do not skip migration verification

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard local database setup
  - **Skills**: []
    - PostgreSQL setup is well-documented

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (sequential prerequisite)
  - **Blocks**: Tasks 32, 33, 34, 35 (all need working local DB)
  - **Blocked By**: All previous tasks (need complete app)

  **References**:
  - PostgreSQL Docker: https://hub.docker.com/_/postgres
  - Prisma migrations: https://www.prisma.io/docs/concepts/components/prisma-migrations

  **Acceptance Criteria**:
  - [ ] PostgreSQL running locally (Docker or native)
  - [ ] .env.local configured with local DATABASE_URL
  - [ ] `bunx prisma migrate dev` succeeds
  - [ ] Seed script creates test data
  - [ ] App connects to local database successfully

  **QA Scenarios**:

  ```
  Scenario: Local PostgreSQL starts
    Tool: Bash
    Preconditions: Docker installed or PostgreSQL available
    Steps:
      1. Start PostgreSQL (docker run or service start)
      2. Verify port 5432 accessible
      3. Connect with psql or pgAdmin
    Expected Result: PostgreSQL running and accessible
    Failure Indicators: Port conflicts, connection errors
    Evidence: .sisyphus/evidence/task-31-postgres-start.txt

  Scenario: Prisma connects to local DB
    Tool: Bash
    Preconditions: PostgreSQL running, .env.local configured
    Steps:
      1. Run: bunx prisma migrate dev --name init
      2. Verify tables created
      3. Run: bunx prisma studio
      4. Verify data browser loads
    Expected Result: Prisma connects, migrations work, studio loads
    Failure Indicators: Connection errors, migration failures
    Evidence: .sisyphus/evidence/task-31-prisma-local.txt
  ```

  **Commit**: YES (grouped with 32-35)
  - Message: `chore: local PostgreSQL setup and seeding`
  - Files: `prisma/seed.ts, .env.local, README.md`
  - Pre-commit: `bunx prisma migrate dev`

- [ ] 32. Full End-to-End Local Testing

  **What to do**:
  - Run complete application locally with real PostgreSQL
  - Test full user journey: signup → login → search concert → create review → view profile → browse
  - Verify all features work with real database
  - Test error scenarios (invalid credentials, network errors)
  - Run full test suite against local database
  - Fix any issues found before deployment

  **Must NOT do**:
  - Do not skip testing with real database (in-memory only is insufficient)
  - Do not proceed to deployment if local tests fail

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Comprehensive end-to-end testing with real database
  - **Skills**: [`playwright`]
    - `playwright`: E2E browser testing with real database

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (sequential after Task 31)
  - **Blocks**: Tasks 33, 34, 35 (deployment requires passing local tests)
  - **Blocked By**: Task 31 (needs local database)

  **Acceptance Criteria**:
  - [ ] All core features work end-to-end locally
  - [ ] Authentication flows work with real database
  - [ ] Concert search returns real data
  - [ ] Reviews persist to database
  - [ ] Profile pages show correct data
  - [ ] Full test suite passes (`bun test`)

  **QA Scenarios**:

  ```
  Scenario: Complete user journey works locally
    Tool: Playwright
    Preconditions: Local PostgreSQL running, dev server started
    Steps:
      1. Navigate to localhost:3000
      2. Sign up new user
      3. Login with credentials
      4. Search for artist (e.g., "Radiohead")
      5. Select concert from results
      6. Create review with rating and text
      7. Mark as attended
      8. Visit profile page
      9. Verify review appears on profile
      10. Logout and verify session destroyed
    Expected Result: Complete journey works without errors
    Failure Indicators: Any step fails, database errors, session issues
    Evidence: .sisyphus/evidence/task-32-local-journey.png

  Scenario: Real database persistence
    Tool: Playwright
    Preconditions: User created review locally
    Steps:
      1. Restart dev server
      2. Navigate to profile page
      3. Verify review still exists
      4. Check Prisma Studio - verify data persisted
    Expected Result: Data persists across server restarts
    Failure Indicators: Data lost, empty profiles
    Evidence: .sisyphus/evidence/task-32-persistence.png
  ```

  **Commit**: YES (grouped with 31, 33-35)
  - Message: `test: comprehensive local end-to-end testing`
  - Files: `__tests__/e2e/local.test.tsx`
  - Pre-commit: `bun test`

- [ ] 33. Environment Validation Script

  **What to do**:
  - Create validation script that checks all required environment variables
  - Verify database connection works
  - Verify Setlist.fm API key works with actual API calls
  - Verify NextAuth configuration is valid
  - Add script to package.json: `validate-env`
  - Run validation as part of pre-commit hook
  - Include specific Setlist.fm API health check

  **Must NOT do**:
  - Do not expose sensitive validation logic publicly
  - Do not skip validation in CI/CD
  - Do not make excessive API calls during validation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple validation script with API integration
  - **Skills**: []
    - Environment validation with external API calls

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 34-35)
  - **Blocks**: None (but should run before deployment)
  - **Blocked By**: Task 11 (needs Setlist.fm API client)

  **References**:
  - Setlist.fm API docs: https://api.setlist.fm/docs/1.0/ - Health check endpoint
  - Setlist.fm rate limits: https://api.setlist.fm/docs/1.0/#_rate_limiting

  **Acceptance Criteria**:
  - [ ] Validation script created at `scripts/validate-env.ts`
  - [ ] Script checks all 4 required env vars
  - [ ] Script tests database connection
  - [ ] Script tests Setlist.fm API key with real search call
  - [ ] Script includes rate limiting awareness (single test call)
  - [ ] Script exits with code 0 on success, 1 on failure
  - [ ] Added to package.json as `validate-env` script
  - [ ] Added to package.json as `test:setlist` script for focused testing

  **QA Scenarios**:

  ```
  Scenario: Validation script passes with good config
    Tool: Bash
    Preconditions: .env.local has all valid values
    Steps:
      1. Run: bun run validate-env
      2. Verify exit code 0
      3. Verify success message
    Expected Result: Script passes, exit code 0
    Failure Indicators: Script fails, wrong exit code
    Evidence: .sisyphus/evidence/task-33-validate-good.txt

  Scenario: Validation script fails with missing API key
    Tool: Bash
    Preconditions: .env.local has empty SETLIST_FM_API_KEY
    Steps:
      1. Run: bun run validate-env
      2. Verify exit code 1
      3. Verify error message about API key
    Expected Result: Script fails gracefully, clear error message
    Failure Indicators: Script crashes, vague error
    Evidence: .sisyphus/evidence/task-33-validate-bad.txt

  Scenario: Setlist.fm API test returns valid data
    Tool: Bash
    Preconditions: Valid API key configured
    Steps:
      1. Run: bun run test:setlist
      2. Verify search for "Radiohead" returns concerts
      3. Verify response contains expected fields (artist, venue, date)
    Expected Result: API returns valid concert data
    Failure Indicators: API errors, empty results, missing fields
    Evidence: .sisyphus/evidence/task-33-setlist-test.json
  ```

  **Commit**: YES (grouped with 31-32, 34-35)
  - Message: `chore: environment validation script with Setlist.fm API testing`
  - Files: `scripts/validate-env.ts, scripts/test-setlist.ts, package.json`
  - Pre-commit: `bun run validate-env`

- [ ] 34. Setlist.fm API Integration Testing

  **What to do**:
  - Create comprehensive integration tests for Setlist.fm API
  - Test all API endpoints: searchArtists, searchConcerts, getConcertById
  - Verify caching behavior works correctly
  - Test error handling for rate limits and invalid requests
  - Test with real concert data (Radiohead, Metallica, etc.)
  - Ensure proper retry logic for transient failures
  - Add integration tests to test suite

  **Must NOT do**:
  - Do not make excessive API calls during testing
  - Do not test with production Vercel deployment during local testing
  - Do not skip mocking in unit tests (integration tests use real API)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex integration testing with external API
  - **Skills**: []
    - External API integration testing requires thorough validation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (sequential after Task 12)
  - **Blocks**: Task 35 (final QA needs this verified)
  - **Blocked By**: Tasks 11, 12 (needs API client and caching)

  **References**:
  - Setlist.fm API documentation: https://api.setlist.fm/docs/1.0/
  - Next.js testing best practices: https://nextjs.org/docs/app/building-your-application/testing

  **Acceptance Criteria**:
  - [ ] Integration tests cover all Setlist.fm API functions
  - [ ] Tests verify successful responses with real data
  - [ ] Tests verify error handling for invalid inputs
  - [ ] Tests verify caching behavior (cache hits/misses)
  - [ ] Tests include rate limiting awareness
  - [ ] All integration tests pass consistently
  - [ ] Added to test suite with `test:setlist:integration` script

  **QA Scenarios**:

  ```
  Scenario: Integration test passes with real API
    Tool: Bash
    Preconditions: Valid API key, dev server not required
    Steps:
      1. Run: bun run test:setlist:integration
      2. Verify all tests pass
      3. Verify no rate limit errors
    Expected Result: All integration tests pass
    Failure Indicators: Test failures, API errors, rate limiting
    Evidence: .sisyphus/evidence/task-34-setlist-integration.txt

  Scenario: Caching works in integration tests
    Tool: Bash
    Preconditions: Integration tests include caching verification
    Steps:
      1. Run integration tests that test cache behavior
      2. Verify first call takes longer, second call is faster
      3. Verify cache invalidation works
    Expected Result: Caching behavior validated in integration tests
    Failure Indicators: No performance difference, cache not working
    Evidence: .sisyphus/evidence/task-34-caching-integration.txt

  Scenario: Error handling tested
    Tool: Bash
    Preconditions: Integration tests include error scenarios
    Steps:
      1. Run integration tests with invalid artist name
      2. Verify proper error handling (not crash)
      3. Verify user-friendly error messages
    Expected Result: Graceful error handling verified
    Failure Indicators: Unhandled exceptions, crashes
    Evidence: .sisyphus/evidence/task-34-error-integration.txt
  ```

  **Commit**: YES (grouped with 31-33, 35-36)
  - Message: `test: comprehensive Setlist.fm API integration tests`
  - Files: `__tests__/integration/setlist.test.ts`
  - Pre-commit: `bun run test:setlist:integration`

- [ ] 35. Vercel Deployment Configuration

  **What to do**:
  - Create vercel.json if needed (custom config)
  - Configure environment variables in Vercel dashboard
  - Set up production database connection
  - Run migrations in production
  - Test deployment

  **Must NOT do**:
  - Do not configure custom domains (use vercel.app subdomain for MVP)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Vercel deployment
  - **Skills**: []
    - Vercel deployment is straightforward for Next.js

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 27-30, 32)
  - **Blocks**: Final verification
  - **Blocked By**: All previous tasks (need complete app)

  **Acceptance Criteria**:
  - [ ] Project connected to Vercel
  - [ ] Environment variables configured
  - [ ] Production database connected
  - [ ] Migrations run in production
  - [ ] Deployment succeeds

  **QA Scenarios**:

  ```
  Scenario: Production deployment succeeds
    Tool: Bash
    Preconditions: Vercel CLI installed, project configured
    Steps:
      1. Run: vercel --prod
      2. Verify build succeeds
      3. Note deployment URL
    Expected Result: Production deployment succeeds
    Failure Indicators: Build errors, deployment fails
    Evidence: .sisyphus/evidence/task-34-deploy-success.txt

  Scenario: Production site loads
    Tool: Playwright
    Preconditions: Production URL available
    Steps:
      1. Navigate to production URL
      2. Verify home page loads
      3. Verify no console errors
    Expected Result: Production site functional
    Failure Indicators: 404, 500 errors, console errors
    Evidence: .sisyphus/evidence/task-34-prod-load.png
  ```

  **Commit**: YES (grouped with 27-30, 32)
  - Message: `chore: Vercel deployment configuration`
  - Files: `vercel.json, .env.production`
  - Pre-commit: None

- [ ] 35. Final QA + Smoke Tests

  **What to do**:
  - Create smoke test suite (critical path tests)
  - Test: signup, login, create review, browse, view profile
  - Run full test suite
  - Fix any critical bugs found
  - Document known issues

  **Must NOT do**:
  - Do not add new features (only fixes)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: End-to-end testing, bug triage
  - **Skills**: [`playwright`]
    - `playwright`: E2E browser testing

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (final task before verification)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: All previous tasks (needs complete app)

  **Acceptance Criteria**:
  - [ ] Smoke test suite created
  - [ ] All smoke tests pass
  - [ ] Full test suite passes
  - [ ] Critical bugs fixed
  - [ ] Known issues documented

  **QA Scenarios**:

  ```
  Scenario: Full user journey works
    Tool: Playwright
    Preconditions: Clean test database
    Steps:
      1. Sign up new user
      2. Search for concert
      3. Create review
      4. View profile
      5. Browse reviews
      6. Logout
    Expected Result: Complete journey works without errors
    Failure Indicators: Any step fails, errors encountered
    Evidence: .sisyphus/evidence/task-35-full-journey.png

  Scenario: All tests pass
    Tool: Bash
    Preconditions: Test suite complete
    Steps:
      1. Run: bun test
      2. Verify 0 failures
    Expected Result: All tests pass
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-35-tests-pass.txt
  ```

  **Commit**: YES (grouped with 27-35)
  - Message: `test: smoke tests and final QA`
  - Files: `__tests__/smoke.test.tsx`
  - Pre-commit: `bun test`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + `bun run build` + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Wave 1**: Group commits 1-5 → `chore: project setup with Next.js, Prisma, Vitest, shadcn/ui`
- **Wave 2**: Group commits 6-10 → `feat: email/password authentication with NextAuth.js`
- **Wave 3**: Group commits 11-15 → `feat: Setlist.fm API integration with caching`
- **Wave 4**: Group commits 16-21 → `feat: concert review CRUD system`
- **Wave 5**: Group commits 22-26 → `feat: user profiles and browse pages`
- **Wave 6**: Group commits 27-36 → `chore: navigation, SEO, local testing, deployment`

---

## Success Criteria

### Verification Commands
```bash
bun install                    # Expected: dependencies installed, no errors
bun run db:generate            # Expected: Prisma client generated
bun run db:migrate             # Expected: migrations applied successfully
bun test                       # Expected: all tests pass (0 failures)
bun run build                  # Expected: build succeeds, no type errors
bun run start                  # Expected: server starts on port 3000
```

### Final Checklist
- [ ] All "Must Have" features implemented and working
- [ ] All "Must NOT Have" features absent (verified via code search)
- [ ] All tests pass (TDD compliance verified)
- [ ] Application deployed to Vercel
- [ ] Evidence files captured for all QA scenarios
- [ ] No critical bugs in final QA
