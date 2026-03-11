"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
  id: string;
  name: string;
  subtitle?: string | null;
  isFuzzyMatch?: boolean;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: AutocompleteOption) => void;
  onManualAdd?: () => void;
  placeholder?: string;
  apiEndpoint: string;
  transformResults: (data: unknown) => AutocompleteOption[];
  hasDirectMatch: (results: AutocompleteOption[], query: string) => boolean;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function AutocompleteInput({
  value,
  onChange,
  onSelect,
  onManualAdd,
  placeholder = "Search...",
  apiEndpoint,
  transformResults,
  hasDirectMatch,
  disabled = false,
  className,
  autoFocus = false,
}: AutocompleteInputProps) {
  const [results, setResults] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSearchCompleted(false);
      return;
    }

    setIsLoading(true);
    setSearchCompleted(false);
    try {
      const response = await fetch(`${apiEndpoint}?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const options = transformResults(data);
      setResults(options);
      setIsOpen(true);
      setSearchCompleted(true);
    } catch (error) {
      console.error("Autocomplete search error:", error);
      setResults([]);
      setSearchCompleted(true);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, transformResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) {
        search(value);
      } else {
        setResults([]);
        setIsOpen(false);
        setSearchCompleted(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, search]);

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
    const showManualOption = onManualAdd && searchCompleted && results.length === 0 && value.trim();
    const totalItems = results.length + (showManualOption ? 1 : 0);

    if (!isOpen && value.trim()) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        return;
      }
    }

    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        if (highlightedIndex < results.length) {
          const result = results[highlightedIndex];
          onSelect(result);
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else if (showManualOption && highlightedIndex === results.length) {
          onManualAdd?.();
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectResult = (result: AutocompleteOption) => {
    onSelect(result);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleManualAddClick = () => {
    onManualAdd?.();
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const showManualOption = onManualAdd && searchCompleted && results.length === 0 && value.trim();
  const showNoResults = searchCompleted && results.length === 0 && value.trim() && !onManualAdd;
  const showSearchAnyway = results.length > 0 && onManualAdd && !hasDirectMatch(results, value);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value && setIsOpen(true)}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "h-12 text-lg bg-white/5 border-white/20 text-white placeholder:text-gray-500",
            className
          )}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-lg overflow-hidden shadow-xl z-50 max-h-[300px] overflow-y-auto">
          {isLoading && !searchCompleted ? (
            <div className="p-6 text-center">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Searching...</p>
            </div>
          ) : (
            <>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className={cn(
                    "w-full p-4 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0",
                    index === highlightedIndex && "bg-purple-500/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{result.name}</p>
                    {result.isFuzzyMatch && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400">
                        Close match
                      </span>
                    )}
                  </div>
                  {result.subtitle && (
                    <p className="text-gray-400 text-sm">{result.subtitle}</p>
                  )}
                </button>
              ))}

              {showNoResults && (
                <div className="p-4 text-center text-gray-400">
                  No results found
                </div>
              )}

              {showManualOption && (
                <button
                  onClick={handleManualAddClick}
                  className={cn(
                    "w-full p-4 text-left hover:bg-white/10 transition-colors flex items-center gap-3 border-t border-white/10",
                    highlightedIndex === results.length && "bg-purple-500/20"
                  )}
                >
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-purple-300">Add &quot;{value}&quot; manually</span>
                </button>
              )}

              {showSearchAnyway && (
                <button
                  onClick={handleManualAddClick}
                  className={cn(
                    "w-full p-4 text-left hover:bg-white/10 transition-colors flex items-center gap-3 border-t border-white/10",
                    highlightedIndex === results.length && "bg-purple-500/20"
                  )}
                >
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-purple-300">Add &quot;{value}&quot; as is</span>
                </button>
              )}

              {results.length > 0 && (
                <div className="px-4 py-2 bg-slate-900/50 border-t border-white/5 text-xs text-gray-500 flex justify-between">
                  <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
                  <span>Use ↑↓ to navigate, Enter to select</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}