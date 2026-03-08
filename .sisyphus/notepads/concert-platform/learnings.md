### Wave 1, Task 10: Logout + Auth UI Components

#### Logout Implementation
- Used NextAuth v5's `signOut` function exported from `src/lib/auth.ts`
- No separate logout server action needed - `signOut` handles session destruction
- Redirect to home page configured via `callbackUrl: "/"` option

#### Components Created
1. `src/components/user-nav.tsx` - User navigation component with:
   - `useSession` hook to check authentication state
   - Loading state handling (returns null while session loads)
   - Conditional rendering:
     - Logged out: "Sign In" button linking to `/login`
     - Logged in: User name/email display + "Logout" button
   - Logout button triggers `signOut({ callbackUrl: "/" })` for clean session cleanup

#### Layout Changes
Modified `src/app/layout.tsx` to include:
- `SessionProvider` wrapper from next-auth/react (required for useSession hook)
- Header section with UserNav component positioned at top-right
- Flex layout structure: header + main content area

#### Build Fixes Required
- Removed unused `getServerSession` import from `src/lib/auth.ts` (not available in NextAuth v5)
- Fixed Zod v4 breaking change in `src/actions/login.ts`:
  - Changed `parsed.error.errors` to `parsed.error.issues`
  - Zod v4 renamed the `errors` array to `issues`

#### Dependencies Used
- `next-auth/react` - `useSession` hook and `signOut` function
- `@base-ui/react/button` - Button component (via shadcn)
- No new packages required

#### Files Created/Modified
- Created: `src/components/user-nav.tsx`
- Modified: `src/app/layout.tsx` (SessionProvider wrapper + header)
- Modified: `src/lib/auth.ts` (removed unused getServerSession)
- Modified: `src/actions/login.ts` (fixed Zod v4 compatibility)

#### Verification
- `npm run build` completes successfully
- TypeScript compiles without errors
- Static pages: `/`, `/_not-found`
- Dynamic route: `/api/auth/[...nextauth]`

#### Key Patterns
- Client-side session management with `useSession` hook
- SessionProvider must wrap entire app for useSession to work
- Logout flow: `signOut({ callbackUrl: "/" })` destroys session and redirects
- Auth state display shows user.name with fallback to user.email
- No logout confirmation dialog (MVP simplicity)

#### Gotchas
- NextAuth v5 `signOut` is different from v4 - uses async function with options object
- `useSession` requires SessionProvider in parent component tree
- Zod v4 uses `.issues` instead of `.errors` for validation errors
- Session loading state should be handled to prevent flicker

## Task 8: Login Flow Implementation

### Pattern: NextAuth Credentials Login with Server Action

**Server Action Pattern** (`src/actions/login.ts`):
- Use `signIn("credentials", ...)` from NextAuth configuration
- Validate input with Zod schema before passing to signIn
- Catch `AuthError` to handle invalid credentials gracefully
- Return error object for form display rather than throwing

```typescript
try {
  await signIn("credentials", { email, password, redirectTo: "/" })
  return { success: true }
} catch (error) {
  if (error instanceof AuthError) {
    return { error: "Invalid credentials" }
  }
}
```

**Form Component Pattern** (`src/components/login-form.tsx`):
- Use react-hook-form with zodResolver for client-side validation
- Submit via FormData to server action (compatible with progressive enhancement)
- Handle errors in component state and display in error banner
- Call `router.refresh()` + `router.push("/")` on success

**Auth Configuration** (`src/lib/auth.ts`):
- Credentials provider already configured with bcrypt password verification
- Prisma adapter handles session storage
- JWT session strategy configured
- `pages.signIn: "/login"` routes unauthenticated users

### Key Learnings

1. **signIn() behavior**: When using `redirectTo`, NextAuth handles the redirect automatically on success. But for better error handling, catch the error and return it to the form.

2. **Error handling**: NextAuth throws `AuthError` on authentication failure - catch this specifically to distinguish from other errors.

3. **Form submission**: Using FormData with server action allows both JavaScript and no-JS scenarios.

### Files Created
- `src/actions/login.ts` - Login server action with validation
- `src/components/login-form.tsx` - Login form with react-hook-form
- `src/app/login/page.tsx` - Login page layout

### Wave 2, Task 9: Session Management + Protected Routes

#### getServerSession Helper (NextAuth v5 Pattern)
In NextAuth.js v5 (beta), the `auth` function returned from `NextAuth()` serves as the session getter for server components:
```typescript
export { auth as getServerSession }
```
- No need to import `getServerSession` from next-auth package (it doesn't exist in v5)
- The `auth` function automatically reads session from request context
- Use in Server Components and Server Actions to check authentication

#### useSession Hook Wrapper for Client Components
Created custom hook wrapper in `src/components/auth-provider.tsx`:
- `AuthProvider` component wraps `SessionProvider` from next-auth/react
- `useSession` hook provides session data with loading state handling
- Optional `redirectToLogin` parameter for automatic redirects
- Returns: `session`, `status`, `isLoading`, `isAuthenticated`, `isUnauthenticated`, `update`

#### Protected Route Middleware
Created `src/middleware.ts` with Next.js Edge Middleware:
- Runs on every request before rendering
- Checks session using `await auth()`
- Redirects unauthenticated users to `/login` with callbackUrl
- Redirects authenticated users away from login/signup pages to home
- Matcher excludes: `/api`, `/_next/static`, `/_next/image`, static files

#### Server Component Protection Helper
Created `src/lib/require-auth.ts`:
- `requireAuth()` function for use in Server Components
- Calls `getServerSession()` and redirects if no session
- Accepts optional `callbackUrl` parameter for redirect after login
- Returns session if authenticated

#### Loading State Component
Created `src/components/protected-route.tsx`:
- Client component for wrapping protected client-side routes
- Uses `useSession` hook with `redirectToLogin` option
- Shows loading spinner during session check
- Prevents flash of protected content

#### Layout Integration
Updated `src/app/layout.tsx`:
- Wrapped app with custom `AuthProvider` component
- Provides session context to all client components
- Enables `useSession` hook usage throughout the app

#### Key Insights
- NextAuth v5 uses `auth` function instead of separate `getServerSession`
- Middleware provides route-level protection automatically
- Server components need explicit `requireAuth()` calls for protection
- Client components need `ProtectedRoute` wrapper for loading states
- Always pass `callbackUrl` to preserve user's intended destination after login

#### Files Created
- `src/lib/auth.ts` - Added `getServerSession` export
- `src/components/auth-provider.tsx` - Session provider and useSession hook
- `src/middleware.ts` - Protected route middleware
- `src/lib/require-auth.ts` - Server component protection helper
- `src/components/protected-route.tsx` - Client-side loading state wrapper
- `src/app/layout.tsx` - Updated to use AuthProvider

#### Build Verification
- `npm run build` completes successfully
- TypeScript compiles without errors
- Static pages: `/`, `/login`, `/_not-found`
- Dynamic route: `/api/auth/[...nextauth]`

## Task 7: Sign Up Flow Implementation

### Server Action Pattern for User Registration

Created `src/actions/signup.ts` following the same pattern as login:
- "use server" directive for server action
- Zod schema validation on server-side
- FormData input for progressive enhancement
- bcrypt password hashing before storage
- Duplicate email check with Prisma `findUnique`
- Returns `{ error: string }` or `{ success: true }`

```typescript
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})
```

### Form Component Pattern

Created `src/components/signup-form.tsx`:
- Uses react-hook-form with zodResolver for client-side validation
- Three fields: name, email, password
- Error banner displays server-side errors (duplicate email, etc.)
- Loading state on submit button
- Redirects to `/login` on success (MVP pattern - no auto-login)
- Link to login page for existing users

### Key Implementation Details

1. **Password Hashing**: Used `bcrypt.hash(password, 10)` with 10 salt rounds before storing in database

2. **Duplicate Email Handling**: Check with `prisma.user.findUnique({ where: { email } })` before creating user

3. **Validation Consistency**: Same Zod schema used in both:
   - Client-side (form component) for instant feedback
   - Server-side (server action) for security

4. **Redirect Pattern**: On success, `router.push("/login")` - forces user to log in with new credentials (MVP simplicity, avoids session edge cases)

### Files Created
- `src/actions/signup.ts` - Signup server action with password hashing
- `src/components/signup-form.tsx` - Signup form with validation
- `src/app/signup/page.tsx` - Signup page layout

### Verification
- `npm run build` completes successfully
- TypeScript compiles without errors
- Static pages: `/`, `/login`, `/signup`, `/_not-found`
- Dynamic route: `/api/auth/[...nextauth]`

### Gotchas
- bcrypt is already installed for login flow - no new dependencies needed
- Password minimum length (8 chars) must match between signup form and auth config
- Name field required for signup but optional in database (nullable String)

## Task 11: Setlist.fm API Client + Types

### TypeScript Types Created
Created comprehensive TypeScript types for Setlist.fm API responses:
- `Artist` - Artist information with MBID, name, sort name, image
- `Venue` - Venue details with city, country, coordinates
- `Concert` - Concert/setlist with date, venue, artist, tour info
- `Setlist` - Full setlist with sets and songs
- `SetlistFMAPIResult<T>` - Discriminated union for success/error responses

### API Client Implementation
Created `src/lib/setlistfm.ts` with:
- Base URL: `https://api.setlist.fm/rest/1.0`
- Auth header: `x-api-key` from `SETLIST_FM_API_KEY` environment variable
- Centralized error handling with `handleRequest` helper function
- Three exported functions:
  1. `searchArtists(query: string)` - Search artists by name
  2. `searchConcerts(artistMbid: string)` - Get concerts by artist MBID
  3. `getConcertById(id: string)` - Get specific setlist by ID

### Error Handling Pattern
All API functions return `SetlistFMAPIResult<T>` discriminated union:
```typescript
// Success case
{ success: true; data: T }

// Error case
{ success: false; error: string; code?: number }
```

This pattern allows callers to check `result.success` and handle errors gracefully without try/catch.

### TypeScript Gotcha
Discriminated unions in TypeScript require `type` keyword (not `interface`) when using union syntax:
```typescript
// WRONG - interface doesn't support union
export interface Result<T> { success: true; data: T } | { success: false; error: string }

// CORRECT - type alias with union
export type Result<T> = { success: true; data: T } | { success: false; error: string }
```

### Files Created
- `src/types/setlistfm.ts` - TypeScript type definitions
- `src/lib/setlistfm.ts` - API client module

### Verification
- `npm run build` completes successfully
- TypeScript compiles without errors
- API key validation throws error if `SETLIST_FM_API_KEY` not set

### API Rate Limiting Note
Setlist.fm API has rate limits (not implemented yet - future task):
- Free tier: Limited requests per minute
- Consider implementing caching layer (next task)

## Task 12: Concert Search API Route + Caching

### API Route Implementation

Created `src/app/api/concerts/search/route.ts` with:

**Query Parameters**:
- `artist` (required): Artist name to search for
- `venue` (optional): Venue filter (accepted but not yet implemented)
- `page` (optional): Page number for pagination (default: 1)

**Caching Strategy**:
- Used `unstable_cache` from `next/cache` with tagged revalidation
- Cache revalidation: 1 hour (3600 seconds)
- Cache tags: `["concerts"]` for manual invalidation
- Two cached functions:
  - `searchArtistsCached(query: string)` - caches artist search results
  - `searchConcertsCached(artistMbid: string)` - caches concert search by artist MBID

**Pagination**:
- 10 concerts per page (PER_PAGE constant)
- Response includes pagination metadata: page, perPage, total, pages
- Slices array results based on page number

**Response Format**:
```json
{
  "concerts": [...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 50,
    "pages": 5
  }
}
```

**Error Handling**:
- 400: Missing `artist` parameter
- 400: Invalid `page` parameter (non-integer or < 1)
- 500: API errors from Setlist.fm
- 500: Unexpected errors (catch block)

### Pattern: unstable_cache with Tagged Revalidation

```typescript
const cachedFn = unstable_cache(
  async (param: string) => {
    const result = await externalApi(param);
    return result;
  },
  ["cache-key"],
  { revalidate: 3600, tags: ["concerts"] }
);
```

Key points:
- First argument: function to cache
- Second argument: unique cache key (array of strings)
- Third argument: options object with `revalidate` (seconds) and `tags` (array)
- Tags enable manual cache invalidation via `revalidateTag("concerts")`

### Type Fix

`unstable_cache` expects mutable array for tags, not readonly:
```typescript
// WRONG - causes type error
const CACHE_TAGS = ["concerts"] as const;

// CORRECT
const CACHE_TAGS = ["concerts"];
```

### Files Created
- `src/app/api/concerts/search/route.ts` - API route handler

### Verification
- `npm run build` completes successfully
- TypeScript compiles without errors
- Route registered as dynamic (ƒ) in build output

### Key Patterns
- Search flow: artist name → search artists → get first match → search concerts by MBID
- Caching applied at function level, not route level (fine-grained control)
- Empty results return valid pagination structure with zero counts
- Error messages include context for debugging

### Gotchas
- `unstable_cache` tags must be mutable arrays (no `as const`)
- Setlist.fm API requires two-step search: artist name → MBID → concerts
- API key must be set in `SETLIST_FM_API_KEY` environment variable
- Venue parameter accepted but not yet implemented (future enhancement)
