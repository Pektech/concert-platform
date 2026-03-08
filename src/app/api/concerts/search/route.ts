import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchArtists, searchConcerts } from "@/lib/setlistfm";
import type { Concert } from "@/types/setlistfm";

const CACHE_REVALIDATION_SECONDS = 3600;
const CACHE_TAGS = ["concerts"];
const DEFAULT_PAGE = 1;
const PER_PAGE = 10;

const searchConcertsCached = unstable_cache(
  async (artistMbid: string) => {
    const result = await searchConcerts(artistMbid);
    return result;
  },
  ["concerts-by-artist"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

const searchArtistsCached = unstable_cache(
  async (query: string) => {
    const result = await searchArtists(query);
    return result;
  },
  ["artists-search"],
  { revalidate: CACHE_REVALIDATION_SECONDS, tags: CACHE_TAGS }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artistQuery = searchParams.get("artist");
    const venueQuery = searchParams.get("venue");
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

    const artistSearchResult = await searchArtistsCached(artistQuery);

    if (!artistSearchResult.success) {
      return NextResponse.json(
        { error: `Artist search failed: ${artistSearchResult.error}` },
        { status: 500 }
      );
    }

    if (!artistSearchResult.data.artists || artistSearchResult.data.artists.length === 0) {
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
    const artistMbid = artist.mbid;

    const concertSearchResult = await searchConcertsCached(artistMbid);

    if (!concertSearchResult.success) {
      return NextResponse.json(
        { error: `Concert search failed: ${concertSearchResult.error}` },
        { status: 500 }
      );
    }

    if (!concertSearchResult.data.setlists || concertSearchResult.data.setlists.length === 0) {
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

    const totalConcerts = concertSearchResult.data.setlists.length;
    const totalPages = Math.ceil(totalConcerts / PER_PAGE);
    const startIndex = (page - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    const paginatedConcerts = concertSearchResult.data.setlists.slice(startIndex, endIndex);

    const concerts: Concert[] = paginatedConcerts.map((concert) => ({
      ...concert,
      artist: {
        mbid: artist.mbid,
        name: artist.name,
        url: artist.url,
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
