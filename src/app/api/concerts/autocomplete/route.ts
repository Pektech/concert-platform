import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchArtists } from "@/lib/setlistfm";
import type { Artist, Concert } from "@/types/setlistfm";
import { searchConcerts } from "@/lib/setlistfm";

const CACHE_REVALIDATION_SECONDS = 3600;
const CACHE_TAGS = ["concerts-autocomplete"];
const MAX_RESULTS = 8;

const searchArtistsCached = unstable_cache(
  async (query: string) => {
    const result = await searchArtists(query);
    return result;
  },
  ["artists-autocomplete"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

const searchConcertsCached = unstable_cache(
  async (artistMbid: string) => {
    const result = await searchConcerts(artistMbid);
    return result;
  },
  ["concerts-by-artist-autocomplete"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

export interface AutocompleteResult {
  id: string;
  type: "artist" | "concert";
  name: string;
  subtitle: string;
  url: string;
  imageUrl?: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const trimmedQuery = query.trim();

    const artistSearchResult = await searchArtistsCached(trimmedQuery);

    if (!artistSearchResult.success) {
      console.error("Artist search failed:", artistSearchResult.error);
      return NextResponse.json({ results: [] });
    }

    const results: AutocompleteResult[] = [];

    if (artistSearchResult.data.artists && artistSearchResult.data.artists.length > 0) {
      const artists = artistSearchResult.data.artists.slice(0, MAX_RESULTS);
      artists.forEach((artist: Artist) => {
        results.push({
          id: `artist-${artist.mbid}`,
          type: "artist",
          name: artist.name,
          subtitle: artist.disambiguation || "Artist",
          url: `/artists/${artist.mbid}`,
          imageUrl: artist.imageUrl,
        });
      });
    }

    if (results.length > 0 && results[0].type === "artist") {
      const topArtistMbid = (results[0] as any).id.replace("artist-", "");
      const concertSearchResult = await searchConcertsCached(topArtistMbid);

      if (concertSearchResult.success && concertSearchResult.data.setlists) {
        const concerts = concertSearchResult.data.setlists.slice(0, MAX_RESULTS - results.length);
        concerts.forEach((concert: Concert) => {
          const date = new Date(concert.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          results.push({
            id: `concert-${concert.id}`,
            type: "concert",
            name: `${concert.artist.name} - ${date}`,
            subtitle: `${concert.venue.name}, ${concert.venue.city.name}`,
            url: `/concerts/${concert.id}`,
          });
        });
      }
    }

    return NextResponse.json({ results: results.slice(0, MAX_RESULTS) });
  } catch (error) {
    console.error("Autocomplete search error:", error);
    return NextResponse.json({ results: [] });
  }
}
