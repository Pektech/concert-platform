import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchCities } from "@/lib/musicbrainz-db";

const CACHE_REVALIDATION_SECONDS = 3600;
const MAX_RESULTS = 8;

const searchCitiesCached = unstable_cache(
  async (query: string) => {
    return searchCities(query, MAX_RESULTS);
  },
  ["cities-autocomplete-mb"],
  { revalidate: CACHE_REVALIDATION_SECONDS }
);

export interface CityAutocompleteResult {
  id: string;
  name: string;
  region: string | null;
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
    const citySearchResult = await searchCitiesCached(trimmedQuery);

    if (!citySearchResult.success) {
      console.error("City search failed:", citySearchResult.error);
      return NextResponse.json({ results: [] });
    }

    const results: CityAutocompleteResult[] = citySearchResult.data.cities.map((city) => ({
      id: city.gid,
      name: city.name,
      region: city.region,
      country: city.country,
      type: city.type,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("City autocomplete search error:", error);
    return NextResponse.json({ results: [] });
  }
}