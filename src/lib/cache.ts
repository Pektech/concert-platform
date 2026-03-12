/**
 * API Cache Utilities
 * 
 * Database-backed caching for Setlist.fm and other external API responses.
 * Provides TTL-based expiration and avoids rate limiting.
 */

import { prisma } from "./prisma";

export interface CacheOptions {
  /** Time-to-live in days (default: 7) */
  ttlDays?: number;
}

/**
 * Get a cached value by key
 * Returns null if not found or expired
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await prisma.apiCache.findUnique({
      where: { key },
    });

    if (!cached) {
      return null;
    }

    // Check if expired
    if (cached.expiresAt < new Date()) {
      // Delete expired cache entry
      await prisma.apiCache.delete({
        where: { key },
      }).catch(() => {
        // Ignore delete errors
      });
      return null;
    }

    return cached.value as T;
  } catch (error) {
    console.error(`[Cache] Error getting cache for key "${key}":`, error);
    return null;
  }
}

/**
 * Set a cached value with TTL
 * @param key - Unique cache key (e.g., "setlist:artist:radiohead")
 * @param value - Data to cache (will be stored as JSON)
 * @param options - Cache options including TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<void> {
  const ttlDays = options.ttlDays ?? 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);

  try {
    await prisma.apiCache.upsert({
      where: { key },
      create: {
        key,
        value: value as object,
        expiresAt,
      },
      update: {
        value: value as object,
        expiresAt,
      },
    });
  } catch (error) {
    console.error(`[Cache] Error setting cache for key "${key}":`, error);
  }
}

/**
 * Delete a cached value by key
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await prisma.apiCache.delete({
      where: { key },
    });
  } catch {
    // Ignore errors if key doesn't exist
  }
}

/**
 * Delete all cached values matching a pattern
 * Note: This uses a LIKE query, so use with caution on large datasets
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  try {
    const result = await prisma.apiCache.deleteMany({
      where: {
        key: {
          contains: pattern,
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error(`[Cache] Error deleting cache pattern "${pattern}":`, error);
    return 0;
  }
}

/**
 * Clear all expired cache entries
 * Run this periodically via cron job or on startup
 */
export async function clearExpiredCache(): Promise<number> {
  try {
    const result = await prisma.apiCache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    console.log(`[Cache] Cleared ${result.count} expired cache entries`);
    return result.count;
  } catch (error) {
    console.error("[Cache] Error clearing expired cache:", error);
    return 0;
  }
}

/**
 * Get or set a cached value with a fetcher function
 * This is the main utility for caching API responses
 * 
 * @example
 * const artist = await getOrSetCache(
 *   `setlist:artist:${mbid}`,
 *   () => fetchArtistFromApi(mbid),
 *   { ttlDays: 30 }
 * );
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache the result
  await setCache(key, data, options);

  return data;
}

/**
 * Cache key generators for consistent key naming
 */
export const cacheKeys = {
  setlistArtist: (mbid: string) => `setlist:artist:${mbid}`,
  setlistConcerts: (mbid: string, page: number = 1) => `setlist:concerts:${mbid}:${page}`,
  setlistSetlist: (id: string) => `setlist:setlist:${id}`,
  searchArtist: (query: string) => `search:artist:${query.toLowerCase().trim()}`,
};