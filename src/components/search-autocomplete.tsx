"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AutocompleteResult } from "@/app/api/concerts/autocomplete/route";
import {
  filterAndSortResults,
  hasDirectMatch,
  type FilteredResult,
} from "@/lib/artist-filter";

export function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FilteredResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSearchAnyway, setShowSearchAnyway] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setShowSearchAnyway(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/concerts/autocomplete?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      const rawResults: AutocompleteResult[] = data.results || [];

      const filteredResults = filterAndSortResults(rawResults, searchQuery);
      setResults(filteredResults);
      setShowSearchAnyway(rawResults.length > 0 && !hasDirectMatch(rawResults, searchQuery));
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowSearchAnyway(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        search(query);
      } else {
        setResults([]);
        setIsOpen(false);
        setShowSearchAnyway(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const result = results[highlightedIndex];
      if (result) {
        window.location.href = result.url;
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = () => {
    setIsOpen(false);
    setQuery("");
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search artists or concerts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className="h-12 text-base bg-background/80 backdrop-blur-sm border-2 focus:border-primary/70 transition-all duration-300 shadow-lg shadow-black/5"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
          <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-muted-foreground/30 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">↵</span>
          </kbd>
        </div>
      </div>

      {isOpen && (
        <Card
          className="absolute top-full left-0 right-0 mt-2 p-0 overflow-hidden shadow-2xl shadow-black/20 border-2 border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ zIndex: 50 }}
        >
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 && !isLoading && query && (
              <div className="p-6 text-center text-muted-foreground">
                <p className="text-sm">No results found</p>
                <p className="text-xs mt-1">Try searching for a different artist</p>
              </div>
            )}

            {results.map((result, index) => (
              <Link
                key={result.id}
                href={result.url}
                onClick={handleSelect}
                className={cn(
                  "group flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-200 border-b border-border/50 last:border-b-0",
                  index === highlightedIndex && "bg-primary/5"
                )}
              >
                {result.type === "artist" && result.imageUrl && (
                  <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={result.imageUrl}
                      alt={result.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="48px"
                    />
                  </div>
                )}

                {result.type === "artist" && !result.imageUrl && (
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                    <svg
                      className="w-6 h-6 text-primary/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                  </div>
                )}

                {result.type === "concert" && (
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                      {result.type === "artist" ? "Artist" : "Concert"}
                    </span>
                    {result.isVerified && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                    {result.isFuzzyMatch && !result.isVerified && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Close match
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
                    {result.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {result.subtitle}
                  </p>
                </div>

                <svg
                  className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}

            {showSearchAnyway && (
              <Link
                href={`/concerts/search?artist=${encodeURIComponent(query)}`}
                onClick={handleSelect}
                className="group flex items-center justify-center gap-2 p-4 hover:bg-muted/50 transition-colors border-t border-border/50"
              >
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                  Add &quot;{query}&quot; as is
                </span>
              </Link>
            )}
          </div>

          {results.length > 0 && (
            <div className="px-4 py-2 bg-muted/30 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
              <span>
                {results.length} result{results.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[10px] opacity-70">
                Use ↑↓ to navigate, Enter to select
              </span>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
