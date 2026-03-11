import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchVenues } from "@/lib/musicbrainz-db";

const CACHE_REVALIDATION_SECONDS = 3600;
const MAX_RESULTS = 8;

const searchVenuesCached = unstable_cache(
  async (query: string) => {
    return searchVenues(query, MAX_RESULTS);
  },
  ["venues-autocomplete-mb"],
  { revalidate: CACHE_REVALIDATION_SECONDS }
);

export interface VenueAutocompleteResult {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  type: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const trimmedQuery = query.trim();
    const venueSearchResult = await searchVenuesCached(trimmedQuery);

    if (!venueSearchResult.success) {
      console.error("Venue search failed:", venueSearchResult.error);
      return NextResponse.json({ results: [] });
    }

    const results: VenueAutocompleteResult[] = venueSearchResult.data.venues.map((venue) => ({
      id: venue.gid,
      name: venue.name,
      city: venue.city,
      country: venue.country,
      type: venue.type,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Venue autocomplete search error:", error);
    return NextResponse.json({ results: [] });
  }
}