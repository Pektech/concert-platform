import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchArtists, getArtistEvents, formatEventDate } from "@/lib/musicbrainz-db";

const CACHE_REVALIDATION_SECONDS = 3600;
const CACHE_TAGS = ["concerts-autocomplete"];
const MAX_RESULTS = 8;

const searchArtistsCached = unstable_cache(
  async (query: string) => {
    return searchArtists(query, MAX_RESULTS);
  },
  ["artists-autocomplete-mb"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

const getArtistEventsCached = unstable_cache(
  async (artistGid: string) => {
    return getArtistEvents(artistGid, MAX_RESULTS);
  },
  ["artist-events-autocomplete-mb"],
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

    if (artistSearchResult.data.artists.length > 0) {
      artistSearchResult.data.artists.forEach((artist) => {
        results.push({
          id: `artist-${artist.gid}`,
          type: "artist",
          name: artist.name,
          subtitle: artist.disambiguation || artist.type || "Artist",
          url: `/artists/${artist.gid}`,
          imageUrl: null,
        });
      });
    }

    if (results.length > 0 && results[0].type === "artist") {
      const topArtistGid = results[0].id.replace("artist-", "");
      const eventsResult = await getArtistEventsCached(topArtistGid);

      if (eventsResult.success && eventsResult.data.events.length > 0) {
        const events = eventsResult.data.events.slice(0, MAX_RESULTS - results.length);
        events.forEach((event) => {
          const dateStr = formatEventDate(event);
          const venueStr = event.venue 
            ? `${event.venue.name}${event.venue.area ? `, ${event.venue.area}` : ""}`
            : "Unknown venue";
          
          results.push({
            id: `concert-${event.gid}`,
            type: "concert",
            name: `${event.name || "Concert"} - ${dateStr}`,
            subtitle: venueStr,
            url: `/concerts/${event.gid}`,
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