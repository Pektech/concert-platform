## Task 14: Artist Display Components

### Components Created

#### ArtistCard Component (`src/components/artist-card.tsx`)
Displays individual artist information with:
- Artist name as clickable link to artist page (`/artists/${mbid}`)
- Optional image display with graceful fallback
- Disambiguation text (when available)
- Hover effects: ring highlight and image scale animation
- Uses shadcn/ui Card component with size prop support

**Image Handling Pattern**:
```typescript
const hasImage = artist.imageUrl && artist.imageUrl.trim() !== "";

{hasImage ? (
  <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" />
) : (
  <div className="flex items-center justify-center">
    <svg>...</svg> {/* Music note icon fallback */}
  </div>
)}
```

**Key Features**:
- Uses Next.js `Image` component for optimized image loading
- Fallback SVG icon when `imageUrl` is null or empty
- `line-clamp-2` on artist name for consistent card heights
- Group hover states for interactive feedback
- Smooth transition on image scale (300ms)

#### ArtistList Component (`src/components/artist-list.tsx`)
Renders grid of multiple artists:
- Responsive grid: 2 columns (mobile) → 3 (sm) → 4 (md) → 5 (lg)
- Empty state handling with centered message
- Passes through size and className props
- Maps over Artist array with mbid as key

**Grid Pattern**:
```typescript
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {artists.map((artist) => (
    <ArtistCard key={artist.mbid} artist={artist} size={size} />
  ))}
</div>
```

### TypeScript Integration
Both components use the `Artist` type from `src/types/setlistfm.ts`:
```typescript
import type { Artist } from "@/types/setlistfm";

interface ArtistCardProps {
  artist: Artist;
  size?: "default" | "sm";
}
```

### Files Created
- `src/components/artist-card.tsx` - Individual artist display card
- `src/components/artist-list.tsx` - Grid layout for multiple artists

### Verification
- `npm run build` completes successfully
- No TypeScript errors in artist components
- Pre-existing errors unrelated (test types, Skeleton component)

### Key Patterns
- Graceful image fallback prevents broken image icons
- Card-based design matches existing shadcn/ui patterns
- Responsive grid adapts to screen size automatically
- Empty state provides user feedback when no artists exist
- Uses mbid as stable unique key for React lists
- Hover states provide affordance for clickable cards

### Gotchas
- Artist image URLs from Setlist.fm can be null - always check before using
- Empty string images should also trigger fallback (trim check)
- Card component's size prop affects padding and gap spacing
- Next.js Image component requires sizes prop for responsive images

## Task 15: Venue Display Components

### Components Created

#### VenueCard Component (`src/components/venue-card.tsx`)
Displays venue information with:
- Venue name as card title
- City and country as description text
- Optional link to venue details page
- Graceful handling of missing venue data
- Uses shadcn/ui Card component

**Null Safety Pattern**:
```typescript
export function VenueCard({ venue }: VenueCardProps) {
  if (!venue) {
    return null;
  }

  const cityName = city?.name ?? "Unknown City";
  const countryName = city?.country?.name ?? "";
  const countryCode = city?.country?.code ?? "";
}
```

**Key Features**:
- Returns null for null/undefined venue (parent handles empty state)
- Optional chaining (`?.`) for nested city/country properties
- Fallback text for missing city name
- Country displayed with comma separator and code in parentheses
- External link opens in new tab with `rel="noopener noreferrer"`

### TypeScript Integration
Uses the `Venue` type from `src/types/setlistfm.ts`:
```typescript
interface Venue {
  mbid: string | null;
  name: string;
  url: string | null;
  city: {
    name: string;
    country: {
      code: string;
      name: string;
    };
  };
  lat: number | null;
  lng: number | null;
}
```

### Files Created
- `src/components/venue-card.tsx` - Individual venue display card
- `src/components/ui/skeleton.tsx` - Loading skeleton component (required by concert page)

### Verification
- `npm run build` completes successfully
- No TypeScript errors in venue components

### Key Patterns
- Early return for null/undefined props keeps component simple
- Optional chaining prevents runtime errors on nested properties
- Consistent Card-based design matches artist components
- External links use security best practices (noopener noreferrer)

### Gotchas
- Venue.city can be undefined in some API responses - use optional chaining
- Venue.url may be null - only render link when url exists
- Pre-existing TypeScript error in artist-card.tsx: imageUrl type mismatch (fixed)
- Missing skeleton component caused build failure (created it)

## Task 13: Concert Detail Page + Data Fetching

### Page Created

#### Concert Detail Page (`src/app/concerts/[id]/page.tsx`)
Dynamic route page that displays individual concert information:
- Fetches concert data using `getConcertById` from setlist.fm API client
- Displays concert date, venue, artists, and full setlist
- Loading state with skeleton screens
- 404 state for invalid concert IDs
- Error state for API failures
- Responsive layout with gradient background

**Data Fetching Pattern** (Client-side with useEffect):
```typescript
const [state, setState] = useState<ConcertPageState>({
  concert: null,
  loading: true,
  error: null,
  notFound: false,
});

useEffect(() => {
  async function fetchConcert() {
    const result = await getConcertById(concertId);
    
    if (result.success) {
      setState({ concert: result.data, loading: false, error: null, notFound: false });
    } else {
      setState({ concert: null, loading: false, error: result.error, notFound: result.code === 404 });
    }
  }
  fetchConcert();
}, [concertId]);
```

**State Management Pattern**:
Uses a single state object for related concert page state:
```typescript
interface ConcertPageState {
  concert: Setlist | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}
```

### Design Choices

**Visual Theme**: Dark gradient background (slate-900 → purple-900 → slate-900) with:
- Glassmorphism cards (white/5 background, white/10 border, backdrop-blur)
- Purple-to-pink gradient accents for interactive elements
- Emoji icons for visual hierarchy (📅, 📍, 🏙️, 🎸, 🎪, 🎭)
- Numbered setlist items with gradient badge backgrounds

**Layout Structure**:
1. Back navigation link
2. Header card: Artist name, tour, image, date, venue, location
3. Setlist card: Organized by sets/encores with numbered songs
4. External link button to setlist.fm

**Setlist Display Pattern**:
```typescript
{concert.sets.set.map((set, setIndex) => (
  <div key={setIndex}>
    {set.encore && <span>Encore {set.encore}</span>}
    {!set.encore && setIndex === 0 && <span>Main Set</span>}
    <ol>
      {set.song.map((song, songIndex) => (
        <li>{song.name}</li>
      ))}
    </ol>
  </div>
))}
```

### Files Created
- `src/app/concerts/[id]/page.tsx` - Concert detail page with dynamic routing

### Verification
- `npm run build` completes successfully
- Page compiles without TypeScript errors
- Dynamic route recognized by Next.js (ƒ /concerts/[id])

### Key Patterns
- Single state object for related page state (loading, error, notFound, data)
- Separate skeleton component for loading state (cleaner code organization)
- Conditional rendering based on state flags (loading → notFound → error → success)
- Date formatting using `toLocaleDateString` for user-friendly display
- Setlist organized by sets with encore detection

### Gotchas
- Dynamic route folder must be named `[id]` (with brackets) for Next.js routing
- Client-side data fetching requires `"use client"` directive
- `useParams()` hook returns params as object - extract ID with `params.id as string`
- Setlist.fm API returns 404 for invalid IDs - check `result.code === 404` for not found state
- Concert.sets.set can be empty array - handle with conditional rendering
- Artist imageUrl can be null - only render image when it exists

## Task 16: Review Model + Prisma Migrations

### Schema Changes

#### Review Model Added to `prisma/schema.prisma`
```prisma
model Review {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  concertId       String
  concert         Concert  @relation(fields: [concertId], references: [id])
  rating          Int
  text            String?
  setlistHighlights String?
  attended        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

**Field Descriptions**:
- `id`: Unique identifier using cuid() for distributed ID generation
- `userId`: Foreign key reference to User model
- `concertId`: Foreign key reference to Concert model
- `rating`: Integer rating value (likely 1-10 or 1-5 scale)
- `text`: Optional review text content
- `setlistHighlights`: Optional field for highlighting specific songs from setlist
- `attended`: Boolean flag indicating if user actually attended the concert (default: false)
- `createdAt`: Auto-set timestamp on record creation
- `updatedAt`: Auto-updated timestamp on record modification

**Relations**:
- `Review → User`: Many-to-one (multiple reviews per user)
- `Review → Concert`: Many-to-one (multiple reviews per concert)
- Bidirectional relations already exist on User (`reviews`) and Concert (`reviews`) models

### Migration Process

**Command Used**: `npx prisma migrate dev --name add_reviews`

**Output**:
- Migration file created: `prisma/migrations/20260308022903_add_reviews/migration.sql`
- Database schema synchronized
- Prisma client regenerated with new Review type

**Database Setup Required**:
The migration required proper PostgreSQL configuration:
1. Created database `marcus`
2. Created user `user` with password `password`
3. Granted CREATEDB permission for shadow database creation
4. Granted ALL privileges on database and public schema

### Files Generated/Modified
- `prisma/schema.prisma` - Added Review model
- `prisma/migrations/20260308022903_add_reviews/migration.sql` - New migration file
- `node_modules/@prisma/client` - Regenerated with Review type

### Verification
- `npx prisma validate` ✅ Schema validation passed
- `npx prisma generate` ✅ Prisma Client v7.4.2 generated
- Migration applied successfully to PostgreSQL database

### Key Patterns
- Using `cuid()` for IDs provides better distributed generation than UUID
- Optional fields (`String?`) allow flexible review creation
- `@default(false)` on boolean fields provides sensible defaults
- `@updatedAt` automatically manages timestamp updates
- Explicit relation fields with `@relation` directive for clear foreign keys

### Gotchas
- Prisma 7 requires `prisma.config.ts` with datasource URL configuration
- Shadow database creation requires CREATEDB permission on PostgreSQL user
- Environment variables must be exported when running Prisma commands
- DATABASE_URL must be set for `prisma migrate dev` to work
- "user" is a reserved SQL keyword - must be quoted in PostgreSQL commands
- Migration creates shadow database to detect destructive changes safely

## Task 20: Review Display Component

### Component Created

#### ReviewCard Component (`src/components/review-card.tsx`)
Displays individual concert reviews with comprehensive information:

**Features**:
- Star rating display (1-5 stars) with amber color for filled stars
- Attended badge with emerald gradient background
- Setlist highlights section with indigo/purple gradient card
- Author name and formatted date display
- Edit/delete action buttons (visible only to review owner on hover)
- Left border accent that changes color on hover
- Gradient footer divider

**Design Decisions**:
- Uses gradient overlays for visual depth (emerald for attended, indigo for highlights)
- Action buttons appear on hover with opacity transition for cleaner default state
- Star rating uses inline SVG with conditional fill based on rating value
- Date formatted using `Intl.DateTimeFormat` for locale-aware display
- Setlist highlights displayed in styled card with gradient background

**Props Interface**:
```typescript
interface ReviewCardProps {
  review: {
    id: string
    rating: number
    text: string | null
    setlistHighlights: string | null
    attended: boolean
    createdAt: string
    user: { id: string; name: string | null }
  }
  currentUserId?: string
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
}
```

#### Badge Component (`src/components/ui/badge.tsx`)
New shadcn/ui component added for badge displays:

**Variants**: default, secondary, destructive, outline
- Uses `class-variance-authority` for variant management
- Rounded pill shape with border
- Text size: xs (12px)
- Hover states on all variants

**Usage in ReviewCard**:
```typescript
<Badge variant="secondary" className="bg-emerald-500/90 text-emerald-950">
  ✓ Attended
</Badge>
```

### Visual Design Pattern

**Gradient Accents**: Used throughout for modern, polished look:
- Attended badge: `bg-gradient-to-l from-emerald-500/10 to-transparent`
- Setlist card: `bg-gradient-to-br from-indigo-500/5 to-purple-500/5`
- Footer divider: `bg-gradient-to-r from-primary/20 via-primary/10 to-transparent`
- Card left border: `border-l-4 border-l-primary/30 hover:border-l-primary`

**Micro-interactions**:
- Action buttons fade in on card hover: `opacity-0 group-hover/review:opacity-100`
- Left border color transition: `transition-colors duration-300`
- Star rating uses conditional fill for visual feedback

### Build Verification
- `npm run build` succeeds
- Component uses existing shadcn/ui Card and Button components
- Requires lucide-react for Pencil and Trash2 icons (already installed)


## Task 18: Edit Review Flow

### Server Action Created

#### updateReview (`src/actions/update-review.ts`)
Server action that handles review updates with ownership verification:

**Key Features**:
- Requires authentication via `getServerSession()`
- Validates input using Zod schema
- Fetches existing review to verify ownership
- Prevents editing others' reviews with clear error message
- Redirects to concert page after successful update
- Uses `redirect()` from next/navigation for server-side redirects

**Ownership Check Pattern**:
```typescript
const existingReview = await prisma.review.findUnique({
  where: { id },
});

if (!existingReview) {
  return { error: "Review not found" };
}

if (existingReview.userId !== userId) {
  return { error: "You can only edit your own reviews" };
}
```

**Schema Validation**:
```typescript
const updateReviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  setlistHighlights: z.string().optional(),
  attended: z.boolean().optional(),
});
```

### Page Structure

#### Server Component: `src/app/reviews/[id]/edit/page.tsx`
- Fetches review data server-side
- Verifies user owns the review before rendering form
- Redirects to login if not authenticated
- Redirects to home if review doesn't exist
- Redirects to concert page if user doesn't own review
- Passes review data as props to client form component

**Auth Check Pattern**:
```typescript
const session = await getServerSession();

if (!session?.user?.id) {
  redirect("/login");
}

const review = await prisma.review.findUnique({ ... });

if (review.userId !== session.user.id) {
  redirect(`/concerts/${review.concertId}`);
}
```

#### Client Component: `src/app/reviews/[id]/edit/EditReviewForm.tsx`
- Uses react-hook-form with zodResolver for form management
- Pre-fills form with existing review data via `defaultValues`
- Interactive star rating component (1-5 stars)
- Text areas for review text and setlist highlights
- Checkbox for "I attended this concert"
- UsesTransition for pending state during submission
- Error handling with user-friendly messages

**Star Rating Pattern**:
```typescript
{[1, 2, 3, 4, 5].map((star) => (
  <button
    key={star}
    type="button"
    onClick={() => field.onChange(star)}
    className="transition-transform duration-200 hover:scale-110"
  >
    <svg
      className={star <= field.value ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
      fill={star <= field.value ? "currentColor" : "none"}
    >
      ...
    </svg>
  </button>
))}
```

### Design Choices

**Visual Theme**: Matches existing concert pages:
- Dark gradient background (slate-900 → purple-900 → slate-900)
- Glassmorphism cards (white/5 background, white/10 border, backdrop-blur-xl)
- Purple-to-pink gradient buttons with shadow
- Interactive star rating with fill animation
- Smooth transitions on all interactive elements

**Form Layout**:
1. Back navigation link to concert page
2. Card header with edit icon and title
3. Star rating (1-5) with interactive hover effects
4. Text area for review content
5. Text area for setlist highlights
6. Checkbox for attendance confirmation
7. Submit and Cancel buttons side-by-side

### Files Created
- `src/actions/update-review.ts` - Server action for updating reviews
- `src/app/reviews/[id]/edit/page.tsx` - Server component page wrapper
- `src/app/reviews/[id]/edit/EditReviewForm.tsx` - Client form component

### Verification
- `npm run build` completes successfully
- Dynamic route recognized: ƒ /reviews/[id]/edit
- No TypeScript errors

### Key Patterns
- Server component fetches data, client component handles interactions
- Ownership verification happens server-side before form renders
- `redirect()` in server action automatically navigates after success
- `useTransition` for non-blocking pending state
- Form pre-fills with existing data using `defaultValues`
- Zod schema ensures type-safe validation

### Gotchas
- Server component must pass review data as props to client component
- Client components cannot use `redirect()` - must be in server action
- `formData.get()` returns string or null - parse integers and booleans
- Checkbox checked state requires boolean, but FormData gives "on"/undefined
- Star rating needs `fill` attribute for SVG to work properly
- `z.string().cuid()` validates cuid format but not existence in database


## Task 19: Delete Review + Confirmation

### Server Action Created

#### deleteReview Server Action (`src/actions/delete-review.ts`)
Server action that handles review deletion with ownership verification:

**Key Features**:
- Session authentication check using `getServerSession()`
- Ownership verification before allowing deletion
- Hard delete from database (no soft delete)
- Redirect to concert page after successful deletion
- Error handling for edge cases (missing review, unauthorized access)

**Server Action Pattern**:
```typescript
"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function deleteReview(formData: FormData) {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    return { error: "You must be logged in to delete a review" }
  }

  const reviewId = formData.get("id") as string
  const existingReview = await prisma.review.findUnique({ where: { id: reviewId } })

  if (!existingReview) {
    return { error: "Review not found" }
  }

  // Ownership check
  if (existingReview.userId !== session.user.id) {
    return { error: "You can only delete your own reviews" }
  }

  const concertId = existingReview.concertId

  await prisma.review.delete({ where: { id: reviewId } })

  redirect(`/concerts/${concertId}`)
}
```

### Delete Button Component

#### DeleteReviewButton Component (`src/components/delete-review-button.tsx`)
Client component that provides delete functionality with confirmation:

**Key Features**:
- Uses `window.confirm()` for deletion confirmation
- `useTransition` for pending state management
- Destructive variant button with trash icon
- Displays error messages inline
- Disabled state during deletion

**Component Pattern**:
```typescript
"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteReview } from "@/actions/delete-review"

export function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return
    }

    const formData = new FormData()
    formData.append("id", reviewId)

    startTransition(async () => {
      const result = await deleteReview(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}
```

### Files Created
- `src/actions/delete-review.ts` - Delete review server action
- `src/components/delete-review-button.tsx` - Delete button component with confirmation

### Verification
- `npm run build` completes successfully
- No TypeScript errors
- Server action follows same patterns as `update-review.ts`

### Key Patterns
- Ownership verification before any mutation (same as updateReview)
- window.confirm() for simple MVP confirmation dialog
- useTransition for smooth pending state without blocking UI
- Destructive button variant signals dangerous action
- Error state displayed inline below button
- Redirect handled by server action (not client callback)

### Gotchas
- Must verify ownership on server (client checks can be bypassed)
- window.confirm() is blocking but simple for MVP
- useTransition prevents UI freeze during async operation
- formData.append() requires string values
- redirect() only works in server actions, not client components
- Store concertId before delete for redirect after deletion

### Integration Notes
- DeleteReviewButton designed to be used in ReviewCard component (Task 20)
- Should only render when user owns the review (parent component decides visibility)
- Button should be placed alongside Edit button for owner actions


## Task 21: Star Rating Component + Validation

### Components Created

#### StarRating Component (`src/components/star-rating.tsx`)
Display-only component for showing a rating from 1-5 stars:

**Features**:
- Renders 5 stars with filled/empty state based on rating value
- Uses Lucide React `Star` icon for consistent iconography
- Three size variants: sm (w-4 h-4), md (w-5 h-5), lg (w-6 h-6)
- Yellow/gold color for filled stars (yellow-400)
- Gray color for empty stars (gray-300)
- Input validation clamps rating to 1-5 range

**Usage**:
```typescript
import { StarRating } from "@/components/star-rating";

<StarRating rating={4} size="md" />
```

**Implementation Pattern**:
```typescript
export function StarRating({ rating, size = "md", className }: StarRatingProps) {
  const validRating = Math.min(5, Math.max(1, rating));
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= validRating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-300 text-gray-300"
          )}
        />
      ))}
    </div>
  );
}
```

#### StarRatingInput Component (`src/components/star-rating-input.tsx`)
Interactive component for forms with clickable stars:

**Features**:
- Clickable star buttons to select rating (1-5)
- Hover effect shows preview of selection
- Scale animation on hover (hover:scale-110)
- Disabled state support for forms
- Same size variants as StarRating
- Uses `useState` for hover state tracking

**Usage**:
```typescript
import { StarRatingInput } from "@/components/star-rating-input";

<StarRatingInput
  value={rating}
  onChange={(newRating) => setRating(newRating)}
  size="lg"
  disabled={isPending}
/>
```

**Hover State Pattern**:
```typescript
const [hovered, setHovered] = useState<number | null>(null);
const isFilled = hovered ? star <= hovered : star <= validRating;

<button
  onMouseEnter={() => setHovered(star)}
  onMouseLeave={() => setHovered(null)}
  onClick={() => onChange(star)}
>
  <Star className={isFilled ? "fill-yellow-400" : "fill-gray-300"} />
</button>
```

#### ReviewForm Component (`src/components/review-form.tsx`)
Reusable form component using react-hook-form with zod validation:

**Features**:
- Integrates StarRatingInput for rating selection
- Text area for review content
- Text area for setlist highlights
- Checkbox for "I attended this concert"
- Zod schema validation for rating (1-5 required)
- Support for submit/cancel buttons
- Error display support
- Pending state for form submission

**Validation Schema**:
```typescript
const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5, "Rating must be 5 or less"),
  text: z.string().optional(),
  setlistHighlights: z.string().optional(),
  attended: z.boolean().optional(),
});
```

**Props Interface**:
```typescript
interface ReviewFormProps {
  defaultValues?: Partial<ReviewFormValues>;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  submitLabel: string;
  isPending: boolean;
  error?: string | null;
  onCancel?: () => void;
}
```

### Updated Components

#### ReviewCard (`src/components/review-card.tsx`)
- Replaced inline SVG star rating with StarRating component
- Simplified component by removing local StarRating function

#### EditReviewForm (`src/app/reviews/[id]/edit/EditReviewForm.tsx`)
- Replaced inline star rating with ReviewForm component
- Reduced component complexity by extracting form logic

### Files Created
- `src/components/star-rating.tsx` - Display-only star rating
- `src/components/star-rating-input.tsx` - Interactive star rating input
- `src/components/review-form.tsx` - Reusable review form

### Files Updated
- `src/components/review-card.tsx` - Now uses StarRating component
- `src/app/reviews/[id]/edit/EditReviewForm.tsx` - Now uses ReviewForm component

### Verification
- `npm run build` completes successfully
- No TypeScript errors
- Components use consistent styling with existing design system

### Key Patterns
- Separate components for display vs input (single responsibility)
- Lucide icons for consistent iconography across app
- Hover preview in input component improves UX
- Rating validation clamped to 1-5 at component level
- Reusable form component reduces code duplication
- react-hook-form + zod for type-safe form validation

### Gotchas
- StarRatingInput requires `"use client"` directive (uses useState)
- Rating value of 0 shows no filled stars (useful for required field validation)
- Hover state must fall back to actual value when not hovering
- Lucide Star icon uses `fill` and `stroke` for proper coloring
- Button elements in StarRatingInput need `type="button"` to avoid form submission
- Disabled state should apply to both visual and interaction (pointer-events)

### Design Decisions
- Yellow/gold color (yellow-400) for filled stars - matches common rating patterns
- Gray (gray-300) for empty stars - clear visual distinction
- No half-star support for MVP (whole numbers 1-5 only)
- Size variants match existing design system patterns
- Hover scale animation provides tactile feedback
- Form component extracted for reuse in create/edit flows

## Task 17: Review Form + Server Action

### Components Created

#### createReview Server Action (`src/actions/create-review.ts`)
Server action for creating concert reviews with:
- Authentication check using `auth()` from NextAuth
- Zod schema validation for all fields
- Rating validation (1-5 required)
- Optional fields: text, setlistHighlights
- Boolean field: attended (checkbox)
- Links review to authenticated user and concert
- Returns error on failure, success on completion

**Zod Schema Pattern**:
```typescript
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  setlistHighlights: z.string().optional(),
  attended: z.boolean().default(false),
  concertId: z.string(),
})
```

**Authentication Pattern**:
```typescript
const session = await auth()
if (!session?.user?.id) {
  return { error: "You must be logged in" }
}
```

#### StarRatingInput Component (`src/components/star-rating-input.tsx`)
Interactive star rating input with:
- Hover state for preview before selection
- Click to select rating (1-5)
- Visual feedback: yellow stars with drop shadow when filled
- Size variants: sm, md, lg
- Disabled state support
- Displays selected count as text label
- Uses Lucide Star icon

**Interactive Features**:
- `hovered` state for hover preview
- `displayRating = hovered || value` shows hover or selected
- Transform scale on hover for interactivity
- Focus ring for accessibility

#### ReviewFormContainer Component (`src/components/review-form-container.tsx`)
Container component that bridges ReviewForm with server action:
- Manages form state (isPending, error)
- Handles form submission via server action
- Calls `router.refresh()` on success to reload concert page
- Passes error messages to child form
- Uses `useTransition` for pending state

### Form Fields

1. **Star Rating** (required, 1-5)
   - Interactive star input
   - Validation prevents submission without rating

2. **Your Review** (optional textarea)
   - Multi-line text input
   - Placeholder: "Share your experience..."

3. **Setlist Highlights** (optional textarea)
   - Multi-line text input
   - Placeholder: "Which songs stood out..."

4. **Attended Checkbox** (optional boolean)
   - Checkbox with label "I attended this concert"

### Integration

Added `ReviewFormContainer` to concert detail page (`/concerts/[id]`):
- Form appears below setlist display
- Passes `concertId` as prop
- Page refreshes after successful submission

### Key Patterns

**FormData Construction from Form Values**:
```typescript
const formData = new FormData()
formData.append("rating", values.rating.toString())
if (values.text) formData.append("text", values.text)
formData.append("attended", values.attended ? "on" : "off")
formData.append("concertId", concertId)
```

**Server Action with Auth Guard**:
1. Check session with `auth()`
2. Return error if unauthenticated
3. Validate with Zod
4. Create in database with Prisma
5. Return success/error

**Client Component with Server Action**:
1. useForm for validation (zodResolver)
2. Container component manages server action call
3. router.refresh() triggers page reload
4. Pending state shows loading spinner

### Database Schema

Review model already had required fields:
- `rating: Int`
- `text: String?`
- `setlistHighlights: String?`
- `attended: Boolean @default(false)`
- `userId: String` (relation)
- `concertId: String` (relation)


## Task 22: User Profile Page (Public)

### Page Created

#### User Profile Page (`src/app/profile/[id]/page.tsx`)
Dynamic route page displaying public user profile information:

**Features**:
- User avatar with gradient background and first letter initial
- Display name (or "Anonymous User" if name is null)
- User role badge (e.g., "user", "admin")
- Member since date (formatted as "Month Year")
- Statistics: Review count, Attended count, Tracked concerts count
- Detailed statistics section with icons and descriptions
- Empty state when user has no activity
- Back navigation link to home

**Data Fetching Pattern** (Server Component):
```typescript
export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      reviews: { select: { id: true, attended: true } },
      concerts: { select: { id: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const reviewCount = user.reviews.length;
  const attendedCount = user.reviews.filter((r) => r.attended).length;
  const concertsCount = user.concerts.length;
}
```

**Count Calculation Pattern**:
```typescript
// Reviews: total count of reviews array
const reviewCount = user.reviews.length;

// Attended: filter reviews by attended boolean
const attendedCount = user.reviews.filter((r) => r.attended).length;

// Concerts: count from concerts relation
const concertsCount = user.concerts.length;
```

**Avatar Pattern**:
```typescript
<div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
  {user.name?.charAt(0).toUpperCase() ?? user.email.charAt(0).toUpperCase()}
</div>
```

### Design Choices

**Visual Theme**: Matches existing concert pages:
- Dark gradient background (slate-900 → purple-900 → slate-900)
- Glassmorphism cards (white/5 background, white/10 border, backdrop-blur-xl)
- Purple-to-pink gradient for avatar and accents
- Emoji icons for statistics (🎵 Reviews, 🎫 Attended, 🎸 Concerts)
- Badge component for role display with purple variant

**Layout Structure**:
1. Back navigation link
2. Profile card: Avatar, name, role badge, join date, quick stats
3. Statistics card: Detailed breakdown of activity
4. Empty state card (conditional): When no reviews or concerts

**Empty State Pattern**:
```typescript
{reviewCount === 0 && concertsCount === 0 && (
  <Card>
    <CardContent className="pt-6 text-center">
      <div className="text-6xl mb-4">🎭</div>
      <h3 className="text-xl font-bold text-white mb-2">No Activity Yet</h3>
      <p className="text-gray-400 mb-6">
        This user hasn&apos;t reviewed any concerts or added any to their profile yet.
      </p>
      <Link href="/">
        Explore Concerts
      </Link>
    </CardContent>
  </Card>
)}
```

### Static Generation

**generateStaticParams Function**:
```typescript
export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({
    id: user.id,
  }));
}
```

This enables Next.js to pre-generate profile pages for all existing users at build time.

### Files Created
- `src/app/profile/[id]/page.tsx` - User profile page with dynamic routing

### Files Fixed (Pre-existing Issues)
- `src/app/api/concerts/[id]/attended/route.ts` - Fixed Next.js 16 params type (Promise)
- `src/app/reviews/page.tsx` - Fixed auth import (use local auth.ts)
- `src/components/concert-reviews-list.tsx` - Fixed null check on result.data
- `src/app/concerts/[id]/page.tsx` - Fixed state interface (added reviews/reviewsLoading)

### Verification
- `npm run build` completes successfully
- Dynamic route recognized: ƒ /profile/[id]
- No TypeScript errors
- Page is public (no auth required to view)

### Key Patterns
- Server Component fetches all data (no client-side fetching needed)
- `notFound()` from next/navigation for 404 handling
- Optional chaining for safe null access (`user.name?.charAt(0)`)
- Nullish coalescing for fallback values (`??`)
- Filter arrays for conditional counts
- Avatar gradient with first letter fallback
- Empty state with call-to-action
- Static params generation for build-time optimization

### Gotchas
- Next.js 16 requires `params` to be a Promise in dynamic routes: `Promise<{ id: string }>`
- Profile page is public - no authentication check to view other users
- User.name can be null - always provide fallback to email initial
- Empty reviews array is valid - handle gracefully with count of 0
- `notFound()` must be called in async server component
- Avatar initial uses `charAt(0).toUpperCase()` for consistent display
- Badge variant "outline" with custom purple colors for role display

### Design Details

**Stat Card Component** (Internal):
```typescript
function StatCard({ icon, label, value, delay }: { 
  icon: string; 
  label: string; 
  value: number; 
  delay: number 
}) {
  return (
    <div 
      className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}
```

**Profile Skeleton** (For future loading states):
- Included for consistency with other detail pages
- Can be used if client-side interactivity is added later


## Task 24: Browse/Recent Reviews Page

### Page Created

#### Browse Reviews Page (`src/app/reviews/page.tsx`)
A global browse page showing recent reviews from all users with:

**Key Features**:
- Paginated display (20 reviews per page)
- Review cards showing: user avatar, name, rating, concert info, date, text preview
- Links to user profiles, concert pages, and full reviews
- Attended badge for reviews marked as attended
- Setlist highlights preview when available
- Beautiful dark theme with purple/pink gradient aesthetic matching app design

**Pagination Pattern**:
```typescript
const REVIEWS_PER_PAGE = 20;

async function getReviews(page: number) {
  const skip = (page - 1) * REVIEWS_PER_PAGE;
  
  const [reviews, totalReviews] = await Promise.all([
    prisma.review.findMany({
      skip,
      take: REVIEWS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id, name, email } },
        concert: { 
          select: { 
            id, title, date, 
            artist: { select: { name } },
            venue: { select: { name, city } }
          }
        },
      },
    }),
    prisma.review.count(),
  ]);
  
  return { reviews, currentPage: page, totalPages: Math.ceil(totalReviews / REVIEWS_PER_PAGE) };
}
```

**Review Card Layout**:
- User avatar: Gradient circle with first letter initial
- Star rating: Using existing `StarRating` component
- Concert info: Artist name @ Venue name with music icon
- Date badges: Review date and concert date
- Text preview: First 200 characters with ellipsis
- Setlist highlights: Indigo-tinted box with "Setlist Highlights" label
- "Read full review" link with animated chevron

**Pagination Component**:
- Previous/Next buttons with chevron icons
- Disabled state when on first/last page
- Page indicator showing "Page X of Y"
- Uses query params (`?page=2`) for navigation

**Design Pattern - Staggered Animation Ready**:
```typescript
<Card style={{ animationDelay: `${index * 50}ms` }}>
```
This enables future staggered fade-in animations for review cards.

**Server Component Architecture**:
- Page is async server component
- Uses `Suspense` for loading state
- `ReviewsContent` component handles async data fetching
- Redirects invalid page numbers to page 1
- Empty state shows "No reviews yet" message

**Type Safety**:
```typescript
interface ReviewWithRelations {
  id: string;
  rating: number;
  text: string | null;
  setlistHighlights: string | null;
  attended: boolean;
  createdAt: Date;
  user: { id: string; name: string | null; email: string };
  concert: {
    id: string;
    title: string;
    date: Date;
    artist: { name: string };
    venue: { name: string; city: string | null };
  };
}
```

### Fixed Pre-existing Issues

**Next.js 16 Params Type Change**:
Route handlers in Next.js 16 require params to be typed as `Promise`:
```typescript
// Before (Next.js 14/15)
{ params }: { params: { userId: string } }

// After (Next.js 16)
{ params }: { params: Promise<{ userId: string }> }
const { userId } = await params
```

**Button asChild Prop**:
shadcn/ui Button component may not support `asChild` prop depending on version. Use wrapper pattern instead:
```typescript
<Link href="/path">
  <Button>Click me</Button>
</Link>
```

**State Spread Pattern**:
When updating partial state in React, use spread to preserve other fields:
```typescript
setState((prev) => ({
  ...prev,
  concert: result.data,
  loading: false,
}));
```

### Files Modified
- `src/app/reviews/page.tsx` (new)
- `src/app/api/concerts/user/[userId]/reviews/route.ts` (params type fix)
- `src/app/concerts/[id]/page.tsx` (state spread fix)
- `src/components/concert-reviews-list.tsx` (asChild removal)

### Verification
- `npm run build` succeeds
- TypeScript compilation passes
- Route is dynamic (ƒ) - server-rendered on demand
- Pagination uses proper skip/take with Prisma


## Task 26: Attended Check-in Functionality

### Server Action Pattern

Created `src/actions/toggle-attended.ts` using the existing User-Concert many-to-many relation:

**Key Implementation**:
```typescript
export async function toggleAttended(concertId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be logged in to check in" }
  }

  const existingRelation = await prisma.user.findUnique({
    where: { id: userId },
    select: { concerts: { where: { id: concertId } } }
  })

  const isAttending = existingRelation?.concerts.some((c) => c.id === concertId)

  if (isAttending) {
    await prisma.user.update({
      where: { id: userId },
      data: { concerts: { disconnect: { id: concertId } } }
    })
    return { success: true, attended: false }
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { concerts: { connect: { id: concertId } } }
    })
    return { success: true, attended: true }
  }
}
```

### API Endpoint Pattern

Created `src/app/api/concerts/[id]/attended/route.ts` with GET and POST methods:
- **GET**: Returns `{ attended: boolean }` for current user's attendance status
- **POST**: Toggles attendance and returns updated status

**Authentication**: Uses `auth()` from `@/lib/auth` to get session

### Concert Page Integration

Updated `src/app/concerts/[id]/page.tsx`:
- Added `attended` and `checkingAttendance` state fields
- Added `useEffect` to check attendance status on page load
- Added `handleToggleAttendance` function for button click
- Added Button component with conditional styling:
  - Green (emerald) when checked in
  - Purple outline when not checked in
  - Disabled during loading state

### Button Styling Pattern

```typescript
<Button
  onClick={handleToggleAttendance}
  disabled={state.checkingAttendance}
  variant={state.attended ? "default" : "outline"}
  className={state.attended 
    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
    : "border-purple-500 text-purple-300 hover:bg-purple-500/20"
  }
>
  {state.checkingAttendance ? "Loading..." : state.attended ? "✓ Checked In" : "○ Check In"}
</Button>
```

### Database Schema

The User-Concert many-to-many relation (already in schema):
```prisma
model User {
  concerts  Concert[] @relation("UserConcerts")
}

model Concert {
  users  User[] @relation("UserConcerts")
}
```

### User Profile Count

The attended count automatically updates via the relation - user's profile can query:
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { _count: { select: { concerts: true } } }
})
```

### Review Badge Already Present

The `ReviewCard` component already shows an "Attended" badge (top-right corner) when `review.attended === true`:
- Uses emerald gradient background
- Shows "✓ Attended" text
- Positioned absolutely in top-right

### Build Fix Applied

Fixed TypeScript error in `src/components/concert-reviews-list.tsx`:
- Added null coalescing: `const reviews = result.data ?? []`
- Removed `asChild` prop from Button (not supported by current button implementation)
- Wrapped Button inside Link instead

### Files Created/Modified

1. **Created**: `src/actions/toggle-attended.ts`
2. **Created**: `src/app/api/concerts/[id]/attended/route.ts`
3. **Modified**: `src/app/concerts/[id]/page.tsx`
4. **Fixed**: `src/components/concert-reviews-list.tsx`


## Task 23: Profile Page Reviews List - Learnings

### Pattern: User Reviews List Component
- Created `UserReviewsList` component with pagination support
- Fetches reviews via API route `/api/concerts/user/[userId]/reviews`
- API returns: reviews array, total count, page info
- Each review includes concert info (artist, venue, date, location)

### Design Patterns Used
- Card-based list layout with hover effects
- Gradient borders (border-l-4) for visual hierarchy
- Empty state with engaging emoji and CTA button
- Pagination controls with previous/next buttons
- Skeleton loading states for better UX

### API Route Structure
- Uses query params: `limit`, `offset`
- Prisma query with nested includes for concert, artist, venue
- Returns: { reviews, total, page, totalPages }

### TypeScript Fix
- Moved `fetchReviews` out of useEffect into `useCallback` for reusability
- Required importing `useCallback` from React

### Button Component Note
- shadcn/ui Button doesn't support `asChild` prop
- Use `<Link><Button>...</Button></Link>` pattern instead of `<Button asChild><Link>...</Link></Button>`

### Files Created
- `src/components/user-reviews-list.tsx` - Reviews list with pagination
- `src/app/api/concerts/user/[userId]/reviews/route.ts` - API endpoint
- `src/app/profile/page.tsx` - Profile page with reviews

### Files Modified
- `src/components/user-nav.tsx` - Added profile link
- `src/components/concert-reviews-list.tsx` - Fixed asChild button issue

## Task 25: Concert-Attached Reviews List

### Implementation Summary

Added a reviews list to the concert detail page that displays all reviews for a specific concert, shows the review count, and provides a "Write Review" button for authenticated users.

### Files Created/Modified

#### New Server Action: `src/actions/get-reviews-by-concert.ts`
Fetches reviews for a specific concert from the database:
- Uses `prisma.review.findMany()` with `where: { concertId }`
- Includes user data (id, name) for display
- Orders by `createdAt: "desc"` (newest first)
- Returns formatted review objects with ISO date strings
- Handles errors gracefully with success/error response pattern

**Pattern**:
```typescript
export async function getReviewsByConcertId(concertId: string) {
  const reviews = await prisma.review.findMany({
    where: { concertId },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  // Return formatted data
}
```

#### New Route: `src/app/concerts/[id]/review/new/page.tsx`
Dedicated page for writing concert reviews:
- Uses client component with `ReviewForm` component
- Handles form submission via `createReview` server action
- Redirects to concert page on success
- Includes back navigation to concert detail
- Matches existing edit review page pattern

#### Modified: `src/app/concerts/[id]/page.tsx`
Updated concert detail page to display reviews:
- Added `useSession` hook to get current user ID
- Added reviews state to `ConcertPageState` interface
- Added `useEffect` to fetch reviews on mount
- Added reviews list UI with:
  - Review count badge (gradient pill design)
  - "Write Review" button (authenticated users only)
  - Loading state with skeletons
  - Empty state with call-to-action
  - Reviews list using `ReviewCard` component
  - Edit redirect for user's own reviews

### Design Decisions

1. **Client-side reviews fetching**: Reviews are fetched client-side via useEffect rather than server-side to keep the concert page as a client component (preserves existing attendance functionality)

2. **Review count badge**: Used gradient pill design matching the site's purple/pink theme for visual consistency

3. **Write Review button placement**: Appears in the reviews card header for authenticated users, and in the empty state as a prominent CTA

4. **Edit functionality**: Users can edit their own reviews by clicking the pencil icon (appears on hover), which navigates to `/reviews/[id]/edit`

5. **Empty state handling**: Different messaging for authenticated vs unauthenticated users:
   - Authenticated: "Be the first to share your experience!"
   - Unauthenticated: "Sign in to be the first to review this concert"

### UI Components Used

- **ReviewCard**: Reused existing component for consistent review display
- **Skeleton**: Loading state placeholders
- **Button**: shadcn/ui button with gradient styling
- **Card/CardHeader/CardTitle/CardContent**: shadcn/ui card structure
- **Link**: Next.js navigation

### Authentication Pattern

Used `useSession` hook from `@/components/auth-provider`:
```typescript
const { session } = useSession();
const currentUserId = session?.user?.id as string | undefined;
```

This provides client-side session access without requiring server component conversion.

### Key Learnings

1. **shadcn/ui Button doesn't support asChild by default**: The Button component needs to be wrapped with Link rather than using `asChild` prop (which requires `Slot` composition)

2. **State management for nested data**: Added reviews array to existing ConcertPageState interface to keep all page state in one place

3. **Client component constraints**: Keeping the concert page as a client component (for attendance toggle) means reviews must also be fetched client-side

4. **ReviewCard integration**: The existing ReviewCard component already supported all needed props (review, currentUserId, onEdit), making integration straightforward

### Build Verification

Build passes successfully:
```
npm run build
✓ Compiled successfully
✓ Generating static pages
```

### Future Improvements (Not Implemented - Out of Scope)

- Review sorting (by rating, date, helpfulness)
- Review filtering (by rating, attended status)
- Pagination for concerts with many reviews
- Review helpfulness voting
- Review reply threads
- Delete review confirmation dialog
