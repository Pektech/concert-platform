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

