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
