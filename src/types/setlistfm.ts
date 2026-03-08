/**
 * Setlist.fm API TypeScript Types
 * Based on: https://api.setlist.fm/docs/index.html
 */

export interface SetlistFMAPIResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface Artist {
  mbid: string;
  name: string;
  sortName: string;
  disambiguation: string | null;
  url: string;
  imageUrl: string | null;
}

export interface ArtistSearchResult {
  artists: Artist[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface Venue {
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

export interface Concert {
  id: string;
  externalUrl: string;
  date: string;
  time: string | null;
  venue: Venue;
  artist: {
    mbid: string;
    name: string;
    url: string;
  };
  tour?: string;
  setlistUrl: string;
}

export interface ConcertSearchResult {
  setlists: Concert[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface Track {
  id: string | null;
  name: string;
  duration: string | null;
  mbid: string | null;
  coverArtUrl: string | null;
}

export interface Song {
  name: string;
  mbid: string | null;
  coverArtUrl: string | null;
}

export interface Setlist {
  id: string;
  externalUrl: string;
  date: string;
  artist: {
    mbid: string;
    name: string;
    url: string;
    imageUrl: string | null;
  };
  venue: Venue;
  tour?: string;
  sets: {
    set: Array<{
      song: Song[];
      encore?: number;
    }>;
  };
  tags?: string;
}

export interface SetlistFMAPIError {
  error: string;
  code: number;
  info?: string;
}

export type SetlistFMAPIResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      code?: number;
    };
