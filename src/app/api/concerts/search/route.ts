import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchArtists, getArtistEvents, formatEventDate } from "@/lib/musicbrainz-db";

const CACHE_REVALIDATION_SECONDS = 3600;
const CACHE_TAGS = ["concerts"];
const DEFAULT_PAGE = 1;
const PER_PAGE = 10;

const getArtistEventsCached = unstable_cache(
  async (artistGid: string) => {
    return getArtistEvents(artistGid, 100);
  },
  ["artist-events-mb"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

const searchArtistsCached = unstable_cache(
  async (query: string) => {
    return searchArtists(query, 1);
  },
  ["artists-search-mb"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

interface ConcertResult {
  id: string;
  gid: string;
  name: string;
  date: string;
  venue: {
    name: string | null;
    city: string | null;
    country: string | null;
  };
  artist: {
    gid: string;
    name: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artistQuery = searchParams.get("artist");
    const pageParam = searchParams.get("page");

    if (!artistQuery) {
      return NextResponse.json(
        { error: "Missing required parameter: artist" },
        { status: 400 }
      );
    }

    const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter: must be a positive integer" },
        { status: 400 }
      );
    }

    let artistGid: string;
    let artistName: string;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(artistQuery)) {
      artistGid = artistQuery;
      artistName = "Artist";
    } else {
      const artistSearchResult = await searchArtistsCached(artistQuery);

      if (!artistSearchResult.success) {
        return NextResponse.json(
          { error: `Artist search failed: ${artistSearchResult.error}` },
          { status: 500 }
        );
      }

      if (artistSearchResult.data.artists.length === 0) {
        return NextResponse.json({
          concerts: [],
          pagination: {
            page: 1,
            perPage: PER_PAGE,
            total: 0,
            pages: 0,
          },
        });
      }

      const artist = artistSearchResult.data.artists[0];
      artistGid = artist.gid;
      artistName = artist.name;
    }

    const eventsResult = await getArtistEventsCached(artistGid);

    if (!eventsResult.success) {
      return NextResponse.json(
        { error: `Concert search failed: ${eventsResult.error}` },
        { status: 500 }
      );
    }

    if (eventsResult.data.events.length === 0) {
      return NextResponse.json({
        concerts: [],
        pagination: {
          page: 1,
          perPage: PER_PAGE,
          total: 0,
          pages: 0,
        },
      });
    }

    const totalConcerts = eventsResult.data.events.length;
    const totalPages = Math.ceil(totalConcerts / PER_PAGE);
    const startIndex = (page - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    const paginatedEvents = eventsResult.data.events.slice(startIndex, endIndex);

    const concerts: ConcertResult[] = paginatedEvents.map((event) => ({
      id: event.gid,
      gid: event.gid,
      name: event.name || "Concert",
      date: formatEventDate(event),
      venue: {
        name: event.venue?.name || null,
        city: event.venue?.area || null,
        country: null,
      },
      artist: {
        gid: artistGid,
        name: event.artist?.name || artistName,
      },
    }));

    return NextResponse.json({
      concerts,
      pagination: {
        page,
        perPage: PER_PAGE,
        total: totalConcerts,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Concert search error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}