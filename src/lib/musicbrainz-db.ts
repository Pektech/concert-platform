/**
 * MusicBrainz Local Database Client
 * 
 * Queries the local MusicBrainz PostgreSQL database directly.
 * Replaces Setlist.fm API for artist and event searches.
 * 
 * Connection: localhost:5432, database: musicbrainz_db
 */

import { Pool } from "pg";

// MusicBrainz database connection pool
// Uses the Docker container's exposed port (5433 on host to avoid conflict with system PostgreSQL)
const MUSICBRAINZ_DB_URL = process.env.MUSICBRAINZ_DB_URL || 
  "postgresql://musicbrainz:musicbrainz@localhost:5433/musicbrainz_db";

// Create a singleton pool for MusicBrainz queries
let mbPool: Pool | null = null;

function getMusicBrainzPool(): Pool {
  if (!mbPool) {
    mbPool = new Pool({
      connectionString: MUSICBRAINZ_DB_URL,
      max: 10, // Connection pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return mbPool;
}

// ============================================================================
// Types
// ============================================================================

export interface MBArtist {
  gid: string;           // UUID - MusicBrainz ID
  name: string;
  sortName: string;
  disambiguation: string | null;  // comment field
  type: string | null;   // "Person", "Group", etc.
  country: string | null;
  beginYear: number | null;
  endYear: number | null;
}

export interface MBEvent {
  gid: string;           // UUID - MusicBrainz ID
  name: string;
  year: number | null;
  month: number | null;
  day: number | null;
  time: string | null;
  cancelled: boolean;
  type: string | null;   // "Concert", "Festival", etc.
  venue: {
    name: string | null;
    coordinates: { lat: number; lng: number } | null;
    area: string | null;  // City/region
  } | null;
  artist: {
    gid: string;
    name: string;
  } | null;
}

export interface MBArtistSearchResult {
  artists: MBArtist[];
  total: number;
}

export interface MBEventSearchResult {
  events: MBEvent[];
  total: number;
}

export interface MBVenue {
  gid: string;
  name: string;
  type: string | null;
  city: string | null;
  country: string | null;
}

export interface MBCity {
  gid: string;
  name: string;
  type: string | null;
  region: string | null;
  country: string | null;
}

export interface MBVenueSearchResult {
  venues: MBVenue[];
  total: number;
}

export interface MBCitySearchResult {
  cities: MBCity[];
  total: number;
}

export type MBResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Search for artists by name using fuzzy matching
 * Uses unaccent + ILIKE for case-insensitive accent-insensitive search
 * 
 * @param query - Artist name or partial name
 * @param limit - Maximum results to return (default: 8)
 */
export async function searchArtists(
  query: string,
  limit: number = 8
): Promise<MBResult<MBArtistSearchResult>> {
  try {
    const pool = getMusicBrainzPool();
    
    // Use unaccent for accent-insensitive search and text search vector
    // MusicBrainz has mb_simple_tsvector for full-text search
    const sql = `
      SELECT 
        a.gid,
        a.name,
        a.sort_name,
        a.comment,
        at.name as type_name,
        ar.name as country,
        a.begin_date_year,
        a.end_date_year
      FROM musicbrainz.artist a
      LEFT JOIN musicbrainz.artist_type at ON a.type = at.id
      LEFT JOIN musicbrainz.area ar ON a.area = ar.id
      WHERE 
        mb_simple_tsvector(a.name) @@ plainto_tsquery('simple', $1)
        OR mb_simple_tsvector(a.sort_name) @@ plainto_tsquery('simple', $1)
        OR LOWER(musicbrainz_unaccent(a.name)) LIKE LOWER(musicbrainz_unaccent($2))
      ORDER BY 
        CASE 
          WHEN LOWER(musicbrainz_unaccent(a.name)) = LOWER(musicbrainz_unaccent($2)) THEN 0
          WHEN LOWER(musicbrainz_unaccent(a.name)) LIKE LOWER(musicbrainz_unaccent($3)) THEN 1
          ELSE 2
        END,
        a.name
      LIMIT $4
    `;
    
    const result = await pool.query(sql, [
      query,                          // $1 - full-text query
      `%${query}%`,                   // $2 - LIKE pattern
      `${query}%`,                    // $3 - starts with pattern
      limit                           // $4 - limit
    ]);
    
    const artists: MBArtist[] = result.rows.map((row) => ({
      gid: row.gid,
      name: row.name,
      sortName: row.sort_name,
      disambiguation: row.comment || null,
      type: row.type_name || null,
      country: row.country || null,
      beginYear: row.begin_date_year,
      endYear: row.end_date_year,
    }));
    
    return {
      success: true,
      data: {
        artists,
        total: result.rows.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MusicBrainz artist search error:", error);
    return {
      success: false,
      error: `Artist search failed: ${message}`,
    };
  }
}

/**
 * Get events/concerts for a specific artist by their MusicBrainz GID
 * 
 * @param artistGid - Artist's MusicBrainz UUID
 * @param limit - Maximum results to return (default: 20)
 */
export async function getArtistEvents(
  artistGid: string,
  limit: number = 20
): Promise<MBResult<MBEventSearchResult>> {
  try {
    const pool = getMusicBrainzPool();
    
    // Join artist -> l_artist_event -> event -> l_event_place -> place -> area
    // Filter to Concert type (id = 1) for now
    const sql = `
      SELECT 
        e.gid,
        e.name,
        e.begin_date_year,
        e.begin_date_month,
        e.begin_date_day,
        e.time,
        e.cancelled,
        et.name as event_type,
        p.name as place_name,
        p.coordinates,
        a.name as area_name,
        ar.gid as artist_gid,
        ar.name as artist_name
      FROM musicbrainz.event e
      JOIN musicbrainz.l_artist_event lae ON e.id = lae.entity1
      JOIN musicbrainz.artist ar ON ar.id = lae.entity0
      LEFT JOIN musicbrainz.event_type et ON e.type = et.id
      LEFT JOIN musicbrainz.l_event_place lep ON e.id = lep.entity0
      LEFT JOIN musicbrainz.place p ON lep.entity1 = p.id
      LEFT JOIN musicbrainz.area a ON p.area = a.id
      WHERE ar.gid = $1
        AND (e.type = 1 OR e.type IS NULL)  -- Concert type or unknown
      ORDER BY e.begin_date_year DESC NULLS LAST, 
               e.begin_date_month DESC NULLS LAST, 
               e.begin_date_day DESC NULLS LAST
      LIMIT $2
    `;
    
    const result = await pool.query(sql, [artistGid, limit]);
    
    const events: MBEvent[] = result.rows.map((row) => ({
      gid: row.gid,
      name: row.name,
      year: row.begin_date_year,
      month: row.begin_date_month,
      day: row.begin_date_day,
      time: row.time,
      cancelled: row.cancelled,
      type: row.event_type || "Concert",
      venue: row.place_name ? {
        name: row.place_name,
        coordinates: row.coordinates ? {
          lat: row.coordinates.x,
          lng: row.coordinates.y,
        } : null,
        area: row.area_name,
      } : null,
      artist: {
        gid: row.artist_gid,
        name: row.artist_name,
      },
    }));
    
    return {
      success: true,
      data: {
        events,
        total: result.rows.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MusicBrainz artist events error:", error);
    return {
      success: false,
      error: `Failed to get artist events: ${message}`,
    };
  }
}

/**
 * Search for events by name
 * 
 * @param query - Event name or partial name
 * @param limit - Maximum results to return (default: 20)
 */
export async function searchEvents(
  query: string,
  limit: number = 20
): Promise<MBResult<MBEventSearchResult>> {
  try {
    const pool = getMusicBrainzPool();
    
    const sql = `
      SELECT 
        e.gid,
        e.name,
        e.begin_date_year,
        e.begin_date_month,
        e.begin_date_day,
        e.time,
        e.cancelled,
        et.name as event_type,
        p.name as place_name,
        p.coordinates,
        a.name as area_name,
        ar.gid as artist_gid,
        ar.name as artist_name
      FROM musicbrainz.event e
      LEFT JOIN musicbrainz.event_type et ON e.type = et.id
      LEFT JOIN musicbrainz.l_event_place lep ON e.id = lep.entity0
      LEFT JOIN musicbrainz.place p ON lep.entity1 = p.id
      LEFT JOIN musicbrainz.area a ON p.area = a.id
      LEFT JOIN musicbrainz.l_artist_event lae ON e.id = lae.entity1
      LEFT JOIN musicbrainz.artist ar ON ar.id = lae.entity0
      WHERE 
        mb_simple_tsvector(e.name) @@ plainto_tsquery('simple', $1)
        OR LOWER(musicbrainz_unaccent(e.name)) LIKE LOWER(musicbrainz_unaccent($2))
      ORDER BY 
        CASE 
          WHEN LOWER(musicbrainz_unaccent(e.name)) = LOWER(musicbrainz_unaccent($3)) THEN 0
          ELSE 1
        END,
        e.begin_date_year DESC NULLS LAST
      LIMIT $4
    `;
    
    const result = await pool.query(sql, [
      query,
      `%${query}%`,
      query,
      limit,
    ]);
    
    const events: MBEvent[] = result.rows.map((row) => ({
      gid: row.gid,
      name: row.name,
      year: row.begin_date_year,
      month: row.begin_date_month,
      day: row.begin_date_day,
      time: row.time,
      cancelled: row.cancelled,
      type: row.event_type || null,
      venue: row.place_name ? {
        name: row.place_name,
        coordinates: row.coordinates ? {
          lat: row.coordinates.x,
          lng: row.coordinates.y,
        } : null,
        area: row.area_name,
      } : null,
      artist: row.artist_gid ? {
        gid: row.artist_gid,
        name: row.artist_name,
      } : null,
    }));
    
    return {
      success: true,
      data: {
        events,
        total: result.rows.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MusicBrainz event search error:", error);
    return {
      success: false,
      error: `Event search failed: ${message}`,
    };
  }
}

/**
 * Search for venues/places by name
 * 
 * @param query - Venue name or partial name
 * @param limit - Maximum results to return (default: 8)
 */
export async function searchVenues(
  query: string,
  limit: number = 8
): Promise<MBResult<MBVenueSearchResult>> {
  try {
    const pool = getMusicBrainzPool();
    
    const sql = `
      SELECT 
        p.gid,
        p.name,
        pt.name as type_name,
        a.name as area_name,
        NULL as country_name
      FROM musicbrainz.place p
      LEFT JOIN musicbrainz.place_type pt ON p.type = pt.id
      LEFT JOIN musicbrainz.area a ON p.area = a.id
      WHERE 
        mb_simple_tsvector(p.name) @@ plainto_tsquery('simple', $1)
        OR LOWER(musicbrainz_unaccent(p.name)) LIKE LOWER(musicbrainz_unaccent($2))
      ORDER BY 
        CASE 
          WHEN LOWER(musicbrainz_unaccent(p.name)) = LOWER(musicbrainz_unaccent($3)) THEN 0
          WHEN LOWER(musicbrainz_unaccent(p.name)) LIKE LOWER(musicbrainz_unaccent($4)) THEN 1
          ELSE 2
        END,
        p.name
      LIMIT $5
    `;
    
    const result = await pool.query(sql, [
      query,
      `%${query}%`,
      query,
      `${query}%`,
      limit,
    ]);
    
    const venues: MBVenue[] = result.rows.map((row) => ({
      gid: row.gid,
      name: row.name,
      type: row.type_name || null,
      city: row.area_name || null,
      country: row.country_name || null,
    }));
    
    return {
      success: true,
      data: {
        venues,
        total: result.rows.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MusicBrainz venue search error:", error);
    return {
      success: false,
      error: `Venue search failed: ${message}`,
    };
  }
}

/**
 * Search for cities/areas by name
 * Filters for settlement-type areas (cities, towns, etc.)
 * 
 * @param query - City name or partial name
 * @param limit - Maximum results to return (default: 8)
 */
export async function searchCities(
  query: string,
  limit: number = 8
): Promise<MBResult<MBCitySearchResult>> {
  try {
    const pool = getMusicBrainzPool();
    
    const sql = `
      SELECT 
        a.gid,
        a.name,
        at.name as type_name,
        NULL as region_name,
        NULL as country_name
      FROM musicbrainz.area a
      LEFT JOIN musicbrainz.area_type at ON a.type = at.id
      WHERE 
        (at.name IN ('City', 'Town', 'Municipality', 'Village', 'Suburb', 'District', 'Settlement')
         OR at.id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
        AND (
          mb_simple_tsvector(a.name) @@ plainto_tsquery('simple', $1)
          OR LOWER(musicbrainz_unaccent(a.name)) LIKE LOWER(musicbrainz_unaccent($2))
        )
      ORDER BY 
        CASE 
          WHEN LOWER(musicbrainz_unaccent(a.name)) = LOWER(musicbrainz_unaccent($3)) THEN 0
          WHEN LOWER(musicbrainz_unaccent(a.name)) LIKE LOWER(musicbrainz_unaccent($4)) THEN 1
          ELSE 2
        END,
        a.name
      LIMIT $5
    `;
    
    const result = await pool.query(sql, [
      query,
      `%${query}%`,
      query,
      `${query}%`,
      limit,
    ]);
    
    const cities: MBCity[] = result.rows.map((row) => ({
      gid: row.gid,
      name: row.name,
      type: row.type_name || null,
      region: row.region_name || null,
      country: row.country_name || null,
    }));
    
    return {
      success: true,
      data: {
        cities,
        total: result.rows.length,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MusicBrainz city search error:", error);
    return {
      success: false,
      error: `City search failed: ${message}`,
    };
  }
}

/**
 * Get full event details by MusicBrainz GID
 * 
 * @param gid - Event's MusicBrainz UUID
 */
export async function getEventByGid(
  gid: string
): Promise<MBResult<MBEvent>> {
  try {
    const pool = getMusicBrainzPool();
    
    const sql = `
      SELECT 
        e.gid,
        e.name,
        e.begin_date_year,
        e.begin_date_month,
        e.begin_date_day,
        e.time,
        e.cancelled,
        et.name as event_type,
        p.name as place_name,
        p.coordinates,
        a.name as area_name,
        ar.gid as artist_gid,
        ar.name as artist_name
      FROM musicbrainz.event e
      LEFT JOIN musicbrainz.event_type et ON e.type = et.id
      LEFT JOIN musicbrainz.l_event_place lep ON e.id = lep.entity0
      LEFT JOIN musicbrainz.place p ON lep.entity1 = p.id
      LEFT JOIN musicbrainz.area a ON p.area = a.id
      LEFT JOIN musicbrainz.l_artist_event lae ON e.id = lae.entity1
      LEFT JOIN musicbrainz.artist ar ON ar.id = lae.entity0
      WHERE e.gid = $1
      LIMIT 1
    `;
    
    const result = await pool.query(sql, [gid]);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: `Event not found: ${gid}`,
      };
    }
    
    const row = result.rows[0];
    const event: MBEvent = {
      gid: row.gid,
      name: row.name,
      year: row.begin_date_year,
      month: row.begin_date_month,
      day: row.begin_date_day,
      time: row.time,
      cancelled: row.cancelled,
      type: row.event_type || null,
      venue: row.place_name ? {
        name: row.place_name,
        coordinates: row.coordinates ? {
          lat: row.coordinates.x,
          lng: row.coordinates.y,
        } : null,
        area: row.area_name,
      } : null,
      artist: row.artist_gid ? {
        gid: row.artist_gid,
        name: row.artist_name,
      } : null,
    };
    
    return {
      success: true,
      data: event,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MusicBrainz get event error:", error);
    return {
      success: false,
      error: `Failed to get event: ${message}`,
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format an event date as a readable string
 */
export function formatEventDate(event: MBEvent): string {
  if (!event.year) return "Unknown date";
  
  const parts: string[] = [];
  parts.push(event.year.toString());
  
  if (event.month) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    parts.unshift(months[event.month - 1]);
  }
  
  if (event.day) {
    parts.unshift(event.day.toString());
  }
  
  return parts.join(" ");
}

/**
 * Close the database connection pool
 * Call this during graceful shutdown
 */
export async function closeMusicBrainzPool(): Promise<void> {
  if (mbPool) {
    await mbPool.end();
    mbPool = null;
  }
}