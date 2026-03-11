import { describe, it, expect } from "vitest";
import {
  levenshteinDistance,
  isFuzzyMatch,
  filterAndSortResults,
  hasDirectMatch,
} from "@/lib/artist-filter";
import type { AutocompleteResult } from "@/app/api/concerts/autocomplete/route";

describe("levenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshteinDistance("Radiohead", "Radiohead")).toBe(0);
  });

  it("returns 1 for single character difference", () => {
    expect(levenshteinDistance("Radiohead", "Radiohed")).toBe(1);
  });

  it("returns 2 for two character differences", () => {
    expect(levenshteinDistance("Beatles", "Beate")).toBe(2);
  });

  it("is case-insensitive", () => {
    expect(levenshteinDistance("RADIOHEAD", "radiohead")).toBe(0);
    expect(levenshteinDistance("Radiohead", "RADIOHED")).toBe(1);
  });

  it("handles empty strings", () => {
    expect(levenshteinDistance("", "test")).toBe(4);
    expect(levenshteinDistance("test", "")).toBe(4);
    expect(levenshteinDistance("", "")).toBe(0);
  });

  it("handles insertions", () => {
    expect(levenshteinDistance("cat", "cats")).toBe(1);
  });

  it("handles deletions", () => {
    expect(levenshteinDistance("cats", "cat")).toBe(1);
  });

  it("handles substitutions", () => {
    expect(levenshteinDistance("cat", "bat")).toBe(1);
  });
});

describe("isFuzzyMatch", () => {
  it("returns true for exact match", () => {
    expect(isFuzzyMatch("Radiohead", "Radiohead")).toBe(true);
  });

  it("returns true for case-insensitive exact match", () => {
    expect(isFuzzyMatch("RADIOHEAD", "radiohead")).toBe(true);
  });

  it("returns true for substring match", () => {
    expect(isFuzzyMatch("Radio", "Radiohead")).toBe(true);
    expect(isFuzzyMatch("head", "Radiohead")).toBe(true);
  });

  it("returns true for Levenshtein distance ≤2", () => {
    expect(isFuzzyMatch("Radiohed", "Radiohead")).toBe(true);
    expect(isFuzzyMatch("Beatls", "Beatles")).toBe(true);
  });

  it("returns false for Levenshtein distance >2", () => {
    expect(isFuzzyMatch("Radiohead", "Beatles")).toBe(false);
    expect(isFuzzyMatch("Abcd", "Wxyz")).toBe(false);
  });

  it("returns false for very different lengths (no substring match)", () => {
    expect(isFuzzyMatch("XYZABC", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe(false);
  });

  it("handles whitespace", () => {
    expect(isFuzzyMatch("  Radiohead  ", "Radiohead")).toBe(true);
  });
});

const createMockArtist = (
  name: string,
  mbid: string,
  subtitle: string = "Artist"
): AutocompleteResult => ({
  id: `artist-${mbid}`,
  type: "artist",
  name,
  subtitle,
  url: `/artists/${mbid}`,
});

const createMockConcert = (
  name: string,
  id: string
): AutocompleteResult => ({
  id: `concert-${id}`,
  type: "concert",
  name,
  subtitle: "Venue, City",
  url: `/concerts/${id}`,
});

describe("filterAndSortResults", () => {
  it("returns empty array for empty input", () => {
    expect(filterAndSortResults([], "test")).toEqual([]);
  });

  it("returns original results for empty query", () => {
    const results = [createMockArtist("Radiohead", "1")];
    const filtered = filterAndSortResults(results, "");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Radiohead");
  });

  it("preserves original order when no boosts apply", () => {
    const results = [
      createMockArtist("Artist A", "1"),
      createMockArtist("Artist B", "2"),
      createMockArtist("Artist C", "3"),
    ];
    const filtered = filterAndSortResults(results, "xyz");
    expect(filtered[0].name).toBe("Artist A");
    expect(filtered[1].name).toBe("Artist B");
    expect(filtered[2].name).toBe("Artist C");
  });

  it("boosts verified artists to top", () => {
    const results = [
      createMockArtist("Regular Artist", "1"),
      createMockArtist("Verified Artist", "2", "American rock band"),
      createMockArtist("Another Artist", "3"),
    ];
    const verifiedMbids = new Set(["2"]);

    const filtered = filterAndSortResults(results, "Artist", verifiedMbids);

    expect(filtered[0].name).toBe("Verified Artist");
    expect(filtered[0].isVerified).toBe(true);
  });

  it("boosts fuzzy matches to top", () => {
    const results = [
      createMockArtist("Beatles", "1"),
      createMockArtist("Rolling Stones", "2"),
      createMockArtist("Led Zeppelin", "3"),
    ];

    const filtered = filterAndSortResults(results, "Beatls");

    expect(filtered[0].name).toBe("Beatles");
    expect(filtered[0].isFuzzyMatch).toBe(true);
  });

  it("combines verified and fuzzy match boosts", () => {
    const results = [
      createMockArtist("Radiohead", "1"),
      createMockArtist("Radiohed Tribute", "2", "American tribute band"),
    ];
    const verifiedMbids = new Set(["1"]);

    const filtered = filterAndSortResults(results, "Radiohed", verifiedMbids);

    expect(filtered[0].name).toBe("Radiohead");
    expect(filtered[0].isVerified).toBe(true);
    expect(filtered[0].isFuzzyMatch).toBe(true);
  });

  it("detects simulated verified artists from disambiguation", () => {
    const results = [
      createMockArtist("Unknown Band", "1"),
      createMockArtist("Famous Band", "2", "Grammy award winning"),
      createMockArtist("Another Band", "3"),
    ];

    const filtered = filterAndSortResults(results, "Band");

    expect(filtered[0].name).toBe("Famous Band");
    expect(filtered[0].isVerified).toBe(true);
  });

  it("only marks artists as verified, not concerts", () => {
    const results = [
      createMockConcert("Radiohead Concert", "1"),
      createMockArtist("Radiohead", "2", "British rock band"),
    ];

    const filtered = filterAndSortResults(results, "Radiohead");

    const artistResult = filtered.find((r) => r.type === "artist");
    const concertResult = filtered.find((r) => r.type === "concert");

    expect(artistResult?.isVerified).toBe(true);
    expect(concertResult?.isVerified).toBeUndefined();
  });

  it("handles mixed artist and concert results", () => {
    const results = [
      createMockArtist("The Beatles", "1"),
      createMockConcert("The Beatles - Jan 15, 2024", "c1"),
      createMockArtist("Beetles Band", "2"),
    ];

    const filtered = filterAndSortResults(results, "Beatles");

    expect(filtered[0].name).toBe("The Beatles");
    expect(filtered[0].isFuzzyMatch).toBe(true);
  });
});

describe("hasDirectMatch", () => {
  it("returns true for exact match", () => {
    const results = [createMockArtist("Radiohead", "1")];
    expect(hasDirectMatch(results, "Radiohead")).toBe(true);
  });

  it("returns true for case-insensitive match", () => {
    const results = [createMockArtist("Radiohead", "1")];
    expect(hasDirectMatch(results, "RADIOHEAD")).toBe(true);
  });

  it("returns true for substring match", () => {
    const results = [createMockArtist("Radiohead", "1")];
    expect(hasDirectMatch(results, "Radio")).toBe(true);
  });

  it("returns true for fuzzy match within distance 2", () => {
    const results = [createMockArtist("Beatles", "1")];
    expect(hasDirectMatch(results, "Beatls")).toBe(true);
  });

  it("returns false when no match exists", () => {
    const results = [
      createMockArtist("Radiohead", "1"),
      createMockArtist("Beatles", "2"),
    ];
    expect(hasDirectMatch(results, "Metallica")).toBe(false);
  });

  it("returns false for empty results", () => {
    expect(hasDirectMatch([], "test")).toBe(false);
  });

  it("returns false for empty query", () => {
    const results = [createMockArtist("Radiohead", "1")];
    expect(hasDirectMatch(results, "")).toBe(false);
  });
});