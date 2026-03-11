/**
 * Client-side filtering for venue and city search autocomplete
 *
 * FILTERING STRATEGY:
 * ===================
 * 1. Fuzzy Match Boost: If query closely matches name (Levenshtein distance ≤2),
 *    boost to top of results
 *    - Case-insensitive matching
 *    - Handles typos and minor spelling variations
 *
 * 2. Original API Order: Results maintain original order from API for non-boosted items
 *
 * ALGORITHM:
 * - Score each result: fuzzy match (50 points if distance ≤2)
 * - Sort by score (descending), then by original position
 * - Return reordered results with no additional API calls
 */

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
 * Check if a name has a fuzzy match with the query
 * Returns true if Levenshtein distance is ≤2
 */
export function isFuzzyMatch(query: string, name: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedname = name.toLowerCase().trim();

  // Exact match is always a fuzzy match
  if (normalizedQuery === normalizedname) {
    return true;
  }

  // Check if query is a substring (partial match)
  if (normalizedname.includes(normalizedQuery)) {
    return true;
  }

  // Calculate distance - but only if lengths are close enough
  // to avoid false positives with very different strings
  const lengthDiff = Math.abs(normalizedQuery.length - normalizedname.length);
  if (lengthDiff > 2) {
    return false;
  }

  const distance = levenshteinDistance(normalizedQuery, normalizedname);
  return distance <= 2;
}

// ============================================================================
// Venue Types
// ============================================================================

export interface VenueResult {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  type: string | null;
}

export interface FilteredVenueResult extends VenueResult {
  isFuzzyMatch?: boolean;
}

interface ScoredVenueResult {
  result: FilteredVenueResult;
  score: number;
  originalIndex: number;
}

/**
 * Filter and sort venue autocomplete results
 *
 * @param results - Raw results from the API
 * @param query - User's search query
 * @returns Filtered and sorted results with metadata
 */
export function filterAndSortVenueResults(
  results: VenueResult[],
  query: string
): FilteredVenueResult[] {
  if (!results.length || !query.trim()) {
    return results.map((r) => ({ ...r }));
  }

  // Score and mark each result
  const scoredResults: ScoredVenueResult[] = results.map((result, index) => {
    let score = 0;
    const filtered: FilteredVenueResult = { ...result };

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
 * Check if any venue result has an exact or fuzzy match with the query
 * Used to determine if "Add manually" button should be shown
 */
export function hasDirectVenueMatch(
  results: VenueResult[],
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

// ============================================================================
// City Types
// ============================================================================

export interface CityResult {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
}

export interface FilteredCityResult extends CityResult {
  isFuzzyMatch?: boolean;
}

interface ScoredCityResult {
  result: FilteredCityResult;
  score: number;
  originalIndex: number;
}

/**
 * Filter and sort city autocomplete results
 *
 * @param results - Raw results from the API
 * @param query - User's search query
 * @returns Filtered and sorted results with metadata
 */
export function filterAndSortCityResults(
  results: CityResult[],
  query: string
): FilteredCityResult[] {
  if (!results.length || !query.trim()) {
    return results.map((r) => ({ ...r }));
  }

  // Score and mark each result
  const scoredResults: ScoredCityResult[] = results.map((result, index) => {
    let score = 0;
    const filtered: FilteredCityResult = { ...result };

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
 * Check if any city result has an exact or fuzzy match with the query
 * Used to determine if "Add manually" button should be shown
 */
export function hasDirectCityMatch(
  results: CityResult[],
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