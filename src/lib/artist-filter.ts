/**
 * Client-side filtering for artist search autocomplete
 *
 * FILTERING STRATEGY:
 * ===================
 * 1. Verified Artist Priority: Artists marked as verified appear at the top
 *    - Currently simulated based on disambiguation patterns (can be replaced with real API data)
 *
 * 2. Fuzzy Match Boost: If query closely matches artist name (Levenshtein distance ≤2),
 *    boost to top of results
 *    - Case-insensitive matching
 *    - Handles typos and minor spelling variations
 *
 * 3. Original API Order: Results maintain original order from API for non-boosted items
 *
 * ALGORITHM:
 * - Score each result: verified (100 points) + fuzzy match (50 points if distance ≤2)
 * - Sort by score (descending), then by original position
 * - Return reordered results with no additional API calls
 */

import type { AutocompleteResult } from "@/app/api/concerts/autocomplete/route";

/**
 * Calculate Levenshtein distance between two strings
 * Used to determine fuzzy match quality
 */
export function levenshteinDistance(a: string, b: string): number {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= aLower.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bLower.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= aLower.length; i++) {
    for (let j = 1; j <= bLower.length; j++) {
      if (aLower[i - 1] === bLower[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[aLower.length][bLower.length];
}

/**
 * Check if an artist has a fuzzy match with the query
 * Returns true if Levenshtein distance is ≤2
 */
export function isFuzzyMatch(query: string, artistName: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedArtist = artistName.toLowerCase().trim();

  // Exact match is always a fuzzy match
  if (normalizedQuery === normalizedArtist) {
    return true;
  }

  // Check if query is a substring (partial match)
  if (normalizedArtist.includes(normalizedQuery)) {
    return true;
  }

  // Calculate distance - but only if lengths are close enough
  // to avoid false positives with very different strings
  const lengthDiff = Math.abs(normalizedQuery.length - normalizedArtist.length);
  if (lengthDiff > 2) {
    return false;
  }

  const distance = levenshteinDistance(normalizedQuery, normalizedArtist);
  return distance <= 2;
}

/**
 * Extended result type with client-side metadata
 */
export interface FilteredResult extends AutocompleteResult {
  isVerified?: boolean;
  isFuzzyMatch?: boolean;
}

interface ScoredResult {
  result: FilteredResult;
  score: number;
  originalIndex: number;
}

/**
 * Filter and sort autocomplete results
 *
 * @param results - Raw results from the API
 * @param query - User's search query
 * @param verifiedMbids - Optional set of verified artist MBIDs (can be fetched from DB/API)
 * @returns Filtered and sorted results with metadata
 */
export function filterAndSortResults(
  results: AutocompleteResult[],
  query: string,
  verifiedMbids: Set<string> = new Set()
): FilteredResult[] {
  if (!results.length || !query.trim()) {
    return results.map((r) => ({ ...r }));
  }

  // Score and mark each result
  const scoredResults: ScoredResult[] = results.map((result, index) => {
    let score = 0;
    const filtered: FilteredResult = { ...result };

    // Check verified status (for artists only)
    if (result.type === "artist") {
      const mbid = result.id.replace("artist-", "");
      filtered.isVerified = verifiedMbids.has(mbid);

      // Simulated verification based on disambiguation
      // In production, this would come from a verified artists database
      if (!filtered.isVerified && result.subtitle) {
        // Artists with common disambiguations are often well-known
        const knownPatterns = [
          /american/i,
          /british/i,
          /grammy/i,
          /award/i,
          /legendary/i,
          /rock.*band/i,
          /metal.*band/i,
        ];
        filtered.isVerified = knownPatterns.some((p) => p.test(result.subtitle));
      }

      if (filtered.isVerified) {
        score += 100;
      }
    }

    // Check fuzzy match
    filtered.isFuzzyMatch = isFuzzyMatch(query, result.name);
    if (filtered.isFuzzyMatch) {
      score += 50;
    }

    return {
      result: filtered,
      score,
      originalIndex: index,
    };
  });

  // Sort: by score (descending), then by original position
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.originalIndex - b.originalIndex;
  });

  return scoredResults.map((sr) => sr.result);
}

/**
 * Check if any result has an exact or fuzzy match with the query
 * Used to determine if "Search anyway" button should be shown
 */
export function hasDirectMatch(
  results: AutocompleteResult[],
  query: string
): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return false;
  }

  return results.some((result) => {
    const normalizedName = result.name.toLowerCase().trim();
    return (
      normalizedName === normalizedQuery ||
      normalizedName.includes(normalizedQuery) ||
      isFuzzyMatch(query, result.name)
    );
  });
}