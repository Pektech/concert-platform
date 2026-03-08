/**
 * Setlist.fm API Client
 * API Documentation: https://api.setlist.fm/docs/index.html
 */

import type {
  ArtistSearchResult,
  ConcertSearchResult,
  Setlist,
  SetlistFMAPIResult,
} from "@/types/setlistfm";

const BASE_URL = "https://api.setlist.fm/rest/1.0";

function getAuthHeaders(): HeadersInit {
  const apiKey = process.env.SETLIST_FM_API_KEY;

  console.log("SETLIST_FM_API_KEY exists:", !!apiKey);

  if (!apiKey) {
    throw new Error("SETLIST_FM_API_KEY environment variable is not set");
  }

  return {
    "x-api-key": apiKey,
    "Accept": "application/json",
  };
}

async function handleRequest<T>(
  url: string,
): Promise<SetlistFMAPIResult<T>> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.info || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        code: response.status,
      } as unknown as SetlistFMAPIResult<T>;
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Request failed: ${message}`,
    } as unknown as SetlistFMAPIResult<T>;
  }
}

/**
 * Search for artists by name
 * @param query - Artist name or partial name
 * @returns Search results or error
 */
export async function searchArtists(
  query: string,
): Promise<SetlistFMAPIResult<ArtistSearchResult>> {
  const url = `${BASE_URL}/search/artists?query=${encodeURIComponent(query)}`;
  return handleRequest<ArtistSearchResult>(url);
}

/**
 * Search for concerts by artist MBID
 * @param artistMbid - MusicBrainz artist ID
 * @returns Search results or error
 */
export async function searchConcerts(
  artistMbid: string,
): Promise<SetlistFMAPIResult<ConcertSearchResult>> {
  const url = `${BASE_URL}/search/setlists?artistMbid=${encodeURIComponent(artistMbid)}`;
  return handleRequest<ConcertSearchResult>(url);
}

/**
 * Get a specific concert/setlist by ID
 * @param id - Setlist ID
 * @returns Setlist details or error
 */
export async function getConcertById(
  id: string,
): Promise<SetlistFMAPIResult<Setlist>> {
  const url = `${BASE_URL}/setlists/${encodeURIComponent(id)}`;
  return handleRequest<Setlist>(url);
}
