"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingInput } from "@/components/star-rating-input";
import { useSession } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import {
  filterAndSortResults,
  type FilteredResult,
} from "@/lib/artist-filter";
import {
  filterAndSortVenueResults,
  filterAndSortCityResults,
  hasDirectVenueMatch,
  hasDirectCityMatch,
} from "@/lib/venue-filter";
import { AutocompleteInput } from "@/components/autocomplete-input";
import { toast } from "sonner";

// Types
interface Artist {
  mbid: string;
  name: string;
  disambiguation?: string | null;
  imageUrl?: string | null;
  isVerified?: boolean;
  isFuzzyMatch?: boolean;
}

interface Concert {
  id: string;
  date: string;
  venue: {
    name: string;
    city: { name: string };
  };
  tour?: string;
}

interface ReviewFormData {
  rating: number;
  title: string;
  text: string;
  setlistHighlights: string;
}

type Step = "artist" | "concert" | "venue" | "review";

interface ManualVenueDetails {
  venueName: string;
  city: string;
  date: string;
}

export default function NewReviewPage() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Multi-step state
  const [step, setStep] = useState<Step>("artist");

  // Artist search state
  const [artistQuery, setArtistQuery] = useState("");
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [artistLoading, setArtistLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Concert picker state
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [concertsLoading, setConcertsLoading] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualVenueDetails, setManualVenueDetails] = useState<ManualVenueDetails>({
    venueName: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Venue autocomplete state
  const [venueQuery, setVenueQuery] = useState("");

  // City autocomplete state
  const [cityQuery, setCityQuery] = useState("");

  // Review form state
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: "",
    text: "",
    setlistHighlights: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Artist search
  const searchArtists = useCallback(async (query: string) => {
    if (!query.trim()) {
      setArtistResults([]);
      return;
    }

    setArtistLoading(true);
    try {
      const response = await fetch(`/api/concerts/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const rawResults = data.results || [];

      const filteredResults = filterAndSortResults(rawResults, query);
      const artists: Artist[] = filteredResults
        .filter((r: FilteredResult) => r.type === "artist")
        .map((r: FilteredResult) => ({
          mbid: r.id.replace("artist-", ""),
          name: r.name,
          disambiguation: r.subtitle,
          imageUrl: r.imageUrl,
          isVerified: r.isVerified,
          isFuzzyMatch: r.isFuzzyMatch,
        }));
      setArtistResults(artists);
    } catch (error) {
      console.error("Artist search error:", error);
      setArtistResults([]);
    } finally {
      setArtistLoading(false);
    }
  }, []);

  // Debounced artist search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (artistQuery && step === "artist") {
        searchArtists(artistQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [artistQuery, step, searchArtists]);

  // Fetch concerts when artist selected
  useEffect(() => {
    if (selectedArtist && step === "concert") {
      setConcertsLoading(true);
      fetch(`/api/artists/${selectedArtist.mbid}/concerts`)
        .then((res) => res.json())
        .then((data) => {
          setConcerts(data.concerts || []);
        })
        .catch((error) => {
          console.error("Concert fetch error:", error);
          setConcerts([]);
        })
        .finally(() => setConcertsLoading(false));
    }
  }, [selectedArtist, step]);

  // Handle artist selection
  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setStep("concert");
  };

  // Handle concert selection
  const handleSelectConcert = (concert: Concert) => {
    setSelectedConcert(concert);
    setIsManualEntry(false);
    setStep("review");
  };

  // Handle manual "Add as is" entry - go to venue details step
  const handleManualEntry = () => {
    setIsManualEntry(true);
    setManualVenueDetails({
      venueName: "",
      city: "",
      date: new Date().toISOString().split("T")[0],
    });
    setStep("venue");
  };

  // Handle venue details submission for manual entry
  const handleVenueDetailsSubmit = () => {
    if (!manualVenueDetails.venueName.trim() || !manualVenueDetails.city.trim()) {
      return;
    }
    setStep("review");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedArtist || formData.rating === 0) {
      return;
    }

    if (!isManualEntry && !selectedConcert) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concertId: isManualEntry ? null : selectedConcert?.id,
          isManualEntry,
          rating: formData.rating,
          title: formData.title || null,
          text: formData.text || null,
          setlistHighlights: formData.setlistHighlights || null,
          artistName: selectedArtist.name,
          artistMbid: selectedArtist.mbid,
          venue: isManualEntry ? manualVenueDetails.venueName : selectedConcert?.venue.name,
          city: isManualEntry ? manualVenueDetails.city : selectedConcert?.venue.city.name,
          concertDate: isManualEntry ? manualVenueDetails.date : selectedConcert?.date,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Review created!");
        router.push(`/reviews/${data.review.id}`);
      } else {
        const status = response.status;
        const text = await response.text();
        let errorMessage = "Failed to create review";
        
        try {
          const error = JSON.parse(text);
          console.error("Review creation failed:", { status, error });
          errorMessage = error.error || error.message || errorMessage;
          
          // Show detailed validation errors
          if (error.details && Array.isArray(error.details)) {
            errorMessage = error.details.map((d: { message: string }) => d.message).join(", ");
          }
        } catch {
          console.error("Review creation failed:", { status, text });
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href="/reviews"
          className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reviews
        </Link>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-sm">
          <StepIndicator step={1} currentStep={step === "artist" ? 1 : step === "concert" || step === "venue" ? 2 : 3} label="Artist" />
          <div className="w-8 h-px bg-gray-700" />
          <StepIndicator step={2} currentStep={step === "concert" || step === "venue" ? 2 : step === "review" ? 3 : 1} label="Concert" />
          {isManualEntry && (
            <>
              <div className="w-8 h-px bg-gray-700" />
              <StepIndicator step={3} currentStep={step === "venue" ? 3 : step === "review" ? 4 : 2} label="Venue" />
            </>
          )}
          <div className="w-8 h-px bg-gray-700" />
          <StepIndicator step={isManualEntry ? 4 : 3} currentStep={isManualEntry ? (step === "review" ? 4 : 3) : (step === "review" ? 3 : 2)} label="Review" />
        </div>

        {/* Step 1: Artist Search */}
        {step === "artist" && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <span className="text-3xl">🎤</span>
                Which artist did you see?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for an artist..."
                  value={artistQuery}
                  onChange={(e) => setArtistQuery(e.target.value)}
                  className="h-12 text-lg bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  autoFocus
                />
                {artistLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {artistResults.length > 0 && (
                <div className="space-y-2">
                  {artistResults.map((artist) => (
                    <button
                      key={artist.mbid}
                      onClick={() => handleSelectArtist(artist)}
                      className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-left flex items-center gap-4"
                    >
                      {artist.imageUrl ? (
                        <img src={artist.imageUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <span className="text-2xl">🎤</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold">{artist.name}</p>
                        {artist.disambiguation && (
                          <p className="text-gray-400 text-sm">{artist.disambiguation}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {artistResults.length === 0 && artistQuery.trim() && !artistLoading && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-400">No artists found for &quot;{artistQuery}&quot;</p>
                  <Button
                    onClick={() => {
                      setSelectedArtist({
                        mbid: "",
                        name: artistQuery.trim(),
                      });
                      setIsManualEntry(true);
                      setManualVenueDetails({
                        venueName: "",
                        city: "",
                        date: new Date().toISOString().split("T")[0],
                      });
                      setStep("venue");
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    Add &quot;{artistQuery}&quot; as artist name
                  </Button>
                  <p className="text-xs text-gray-500">
                    Continue with this artist name
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Concert Picker */}
        {step === "concert" && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <span className="text-3xl">📅</span>
                  Which show?
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedArtist(null);
                    setStep("artist");
                  }}
                  className="text-purple-300 hover:text-purple-200"
                >
                  Change Artist
                </Button>
              </div>
              <p className="text-purple-300">
                {selectedArtist?.name} concerts
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {concertsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full bg-white/10" />
                  ))}
                </div>
) : concerts.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-400">No concerts found for this artist</p>
                  <Button
                    onClick={handleManualEntry}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    Add &quot;{selectedArtist?.name}&quot; as is
                  </Button>
                  <p className="text-xs text-gray-500">
                    Create a review without a specific concert date
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {concerts.map((concert) => (
                    <button
                      key={concert.id}
                      onClick={() => handleSelectConcert(concert)}
                      className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">
                            {new Date(concert.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-gray-400">
                            {concert.venue.name}, {concert.venue.city.name}
                          </p>
                          {concert.tour && (
                            <p className="text-purple-300 text-sm">{concert.tour}</p>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Venue Details (for manual entry) */}
        {step === "venue" && selectedArtist && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <span className="text-3xl">📍</span>
                  Venue Details
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsManualEntry(false);
                    setStep("concert");
                  }}
                  className="text-purple-300 hover:text-purple-200"
                >
                  Back
                </Button>
              </div>
              <p className="text-purple-300">
                Tell us where you saw <span className="font-semibold">{selectedArtist.name}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Venue Name *</label>
                <AutocompleteInput
                  value={venueQuery}
                  onChange={setVenueQuery}
                  onSelect={(option) => {
                    setManualVenueDetails((prev) => ({
                      ...prev,
                      venueName: option.name,
                      city: option.subtitle?.split(", ")[0] || prev.city,
                    }));
                    setVenueQuery(option.name);
                  }}
                  onManualAdd={() => {
                    setManualVenueDetails((prev) => ({
                      ...prev,
                      venueName: venueQuery.trim(),
                    }));
                  }}
                  placeholder="e.g., Madison Square Garden"
                  apiEndpoint="/api/venues/autocomplete"
                  transformResults={(data: unknown) => {
                    const typed = data as { results: Array<{ id: string; name: string; city: string | null; country: string | null }> };
                    const filtered = filterAndSortVenueResults(
                      typed.results.map((v) => ({
                        id: v.id,
                        name: v.name,
                        city: v.city,
                        country: v.country,
                        type: null,
                      })),
                      venueQuery
                    );
                    return filtered.map((v) => ({
                      id: v.id,
                      name: v.name,
                      subtitle: v.city ? `${v.city}${v.country ? `, ${v.country}` : ""}` : null,
                      isFuzzyMatch: v.isFuzzyMatch,
                    }));
                  }}
                  hasDirectMatch={(results, query) => hasDirectVenueMatch(
                    results.map((r) => ({ id: r.id, name: r.name, city: null, country: null, type: null })),
                    query
                  )}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">City *</label>
                <AutocompleteInput
                  value={cityQuery}
                  onChange={setCityQuery}
                  onSelect={(option) => {
                    setManualVenueDetails((prev) => ({
                      ...prev,
                      city: option.name,
                    }));
                    setCityQuery(option.name);
                  }}
                  onManualAdd={() => {
                    setManualVenueDetails((prev) => ({
                      ...prev,
                      city: cityQuery.trim(),
                    }));
                  }}
                  placeholder="e.g., New York"
                  apiEndpoint="/api/cities/autocomplete"
                  transformResults={(data: unknown) => {
                    const typed = data as { results: Array<{ id: string; name: string; region: string | null; country: string | null }> };
                    const filtered = filterAndSortCityResults(
                      typed.results.map((c) => ({
                        id: c.id,
                        name: c.name,
                        region: c.region,
                        country: c.country,
                        type: null,
                      })),
                      cityQuery
                    );
                    return filtered.map((c) => ({
                      id: c.id,
                      name: c.name,
                      subtitle: c.country || null,
                      isFuzzyMatch: c.isFuzzyMatch,
                    }));
                  }}
                  hasDirectMatch={(results, query) => hasDirectCityMatch(
                    results.map((r) => ({ id: r.id, name: r.name, region: null, country: null, type: null })),
                    query
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Date (optional)</label>
                <Input
                  type="date"
                  value={manualVenueDetails.date}
                  onChange={(e) => setManualVenueDetails((prev) => ({ ...prev, date: e.target.value }))}
                  className="h-12 bg-white/5 border-white/20 text-white"
                />
              </div>

              <Button
                onClick={handleVenueDetailsSubmit}
                disabled={!manualVenueDetails.venueName.trim() || !manualVenueDetails.city.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 disabled:opacity-50"
              >
                Continue to Review
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4 (or 3): Write Review */}
        {step === "review" && selectedArtist && (selectedConcert || isManualEntry) && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <span className="text-3xl">✍️</span>
                  Write your review
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (isManualEntry) {
                      setStep("venue");
                    } else {
                      setSelectedConcert(null);
                      setStep("concert");
                    }
                  }}
                  className="text-purple-300 hover:text-purple-200"
                >
                  {isManualEntry ? "Change Venue" : "Change Concert"}
                </Button>
              </div>
              <div className="text-purple-300">
                <span className="font-semibold">{selectedArtist.name}</span>
                {isManualEntry ? (
                  <>
                    <span className="mx-2">•</span>
                    <span>{manualVenueDetails.venueName}, {manualVenueDetails.city}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(manualVenueDetails.date).toLocaleDateString()}</span>
                  </>
                ) : selectedConcert ? (
                  <>
                    <span className="mx-2">•</span>
                    <span>{new Date(selectedConcert.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedConcert.venue.name}</span>
                  </>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Rating *</label>
                <StarRatingInput
                  value={formData.rating}
                  onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
                  size="lg"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Review Title (optional)</label>
                <Input
                  type="text"
                  placeholder="Give your review a headline..."
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Review</label>
                <Textarea
                  placeholder="Share your experience at the show..."
                  value={formData.text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
                  className="min-h-[150px] bg-white/5 border-white/20 text-white placeholder:text-gray-500 resize-none"
                />
              </div>

              {/* Setlist Highlights */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Setlist Highlights (optional)</label>
                <Textarea
                  placeholder="Which songs stood out?"
                  value={formData.setlistHighlights}
                  onChange={(e) => setFormData((prev) => ({ ...prev, setlistHighlights: e.target.value }))}
                  className="min-h-[80px] bg-white/5 border-white/20 text-white placeholder:text-gray-500 resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={formData.rating === 0 || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish Review"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Step indicator component
function StepIndicator({ step, currentStep, label }: { step: number; currentStep: number; label: string }) {
  const isActive = step === currentStep;
  const isComplete = step < currentStep;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
          isActive && "bg-purple-500 text-white",
          isComplete && "bg-green-500 text-white",
          !isActive && !isComplete && "bg-gray-700 text-gray-400"
        )}
      >
        {isComplete ? "✓" : step}
      </div>
      <span className={cn("text-sm", isActive ? "text-white" : "text-gray-500")}>{label}</span>
    </div>
  );
}