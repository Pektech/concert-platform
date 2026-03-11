"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getConcertById } from "@/lib/setlistfm";
import type { Setlist } from "@/types/setlistfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getReviewsByConcertId } from "@/actions/get-reviews-by-concert";
import { ReviewCard } from "@/components/review-card";
import { useSession } from "@/components/auth-provider";

interface LocalConcert {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  price: number | null;
  imageUrl: string | null;
  artist: {
    id: string;
    name: string;
    bio: string | null;
    genre: string | null;
    imageUrl: string | null;
  };
  venue: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    capacity: number | null;
  };
  isLocal: true;
}

interface UnifiedConcert {
  id: string;
  title: string;
  artistName: string;
  artistImageUrl: string | null;
  venueName: string;
  venueCity: string;
  venueCountry: string;
  date: Date;
  tour?: string;
  setlist: Array<{ name: string }>;
  externalUrl?: string;
  isLocal: boolean;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  text: string | null;
  setlistHighlights: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
}

interface ConcertPageState {
  concert: UnifiedConcert | null;
  loading: boolean;
  error: string | null;
  attended: boolean;
  checkingAttendance: boolean;
  reviews: Review[];
  reviewsLoading: boolean;
}

function normalizeSetlistFmConcert(setlist: Setlist): UnifiedConcert {
  return {
    id: setlist.id,
    title: setlist.tour || setlist.artist.name,
    artistName: setlist.artist.name,
    artistImageUrl: setlist.artist.imageUrl || null,
    venueName: setlist.venue.name,
    venueCity: setlist.venue.city.name,
    venueCountry: setlist.venue.city.country.name,
    date: new Date(setlist.date),
    tour: setlist.tour,
    setlist: setlist.sets.set.flatMap(s => s.song.map(song => ({ name: song.name }))),
    externalUrl: setlist.externalUrl,
    isLocal: false,
  };
}

function normalizeLocalConcert(concert: LocalConcert): UnifiedConcert {
  return {
    id: concert.id,
    title: concert.title,
    artistName: concert.artist.name,
    artistImageUrl: concert.artist.imageUrl,
    venueName: concert.venue.name,
    venueCity: concert.venue.city || "Unknown",
    venueCountry: "",
    date: new Date(concert.date),
    setlist: [],
    isLocal: true,
  };
}

export default function ConcertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const concertId = params.id as string;
  const { session, status } = useSession();
  const currentUserId = session?.user?.id as string | undefined;
  const isSessionLoading = status === "loading";
  
  const [state, setState] = useState<ConcertPageState>({
    concert: null,
    loading: true,
    error: null,
    attended: false,
    checkingAttendance: false,
    reviews: [],
    reviewsLoading: true,
  });

  useEffect(() => {
    async function fetchConcert() {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      try {
        const localResponse = await fetch(`/api/concerts/local/${concertId}`);
        if (localResponse.ok) {
          const localData = await localResponse.json();
          if (localData.success && localData.data) {
            setState((prev) => ({
              ...prev,
              concert: normalizeLocalConcert(localData.data),
              loading: false,
              reviewsLoading: true,
            }));
            return;
          }
        }

        const result = await getConcertById(concertId);
        if (result.success) {
          setState((prev) => ({
            ...prev,
            concert: normalizeSetlistFmConcert(result.data),
            loading: false,
            reviewsLoading: true,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            concert: null,
            loading: false,
            error: "Concert not found",
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          concert: null,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load concert",
        }));
      }
    }

    fetchConcert();
  }, [concertId]);

  useEffect(() => {
    async function checkAttendance() {
      setState((prev) => ({ ...prev, checkingAttendance: true }));
      
      try {
        const response = await fetch(`/api/concerts/${concertId}/attended`);
        const data = await response.json();
        setState((prev) => ({ ...prev, attended: data.attended, checkingAttendance: false }));
      } catch (error) {
        console.error("Failed to check attendance:", error);
        setState((prev) => ({ ...prev, checkingAttendance: false }));
      }
    }

    if (!state.loading && state.concert) {
      checkAttendance();
    }
  }, [concertId, state.loading, state.concert]);

  useEffect(() => {
    async function fetchReviews() {
      if (!state.loading && state.concert) {
        const result = await getReviewsByConcertId(concertId);
        if (result.success) {
          setState((prev) => ({ ...prev, reviews: result.data || [], reviewsLoading: false }));
        } else {
          setState((prev) => ({ ...prev, reviewsLoading: false }));
        }
      }
    }

    fetchReviews();
  }, [concertId, state.loading, state.concert]);

  const handleToggleAttendance = async () => {
    setState((prev) => ({ ...prev, checkingAttendance: true }));
    
    try {
      const response = await fetch(`/api/concerts/${concertId}/attended`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        setState((prev) => ({ ...prev, attended: data.attended, checkingAttendance: false }));
      } else {
        console.error("Failed to toggle attendance");
        setState((prev) => ({ ...prev, checkingAttendance: false }));
      }
    } catch (error) {
      console.error("Toggle attendance error:", error);
      setState((prev) => ({ ...prev, checkingAttendance: false }));
    }
  };

  if (state.loading) {
    return <ConcertDetailSkeleton />;
  }

  if (state.error || !state.concert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h1 className="text-2xl font-bold text-white mb-2">Concert Not Found</h1>
            <p className="text-gray-400 mb-6">{state.error || "This concert doesn't exist"}</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              ← Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { concert } = state;
  const formattedDate = concert.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">{concert.artistName}</h1>
                {concert.tour && (
                  <p className="text-purple-300 text-lg">{concert.tour} Tour</p>
                )}
                {concert.isLocal && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-violet-500/20 text-violet-300 rounded-full">
                    Local Event
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleToggleAttendance}
                  disabled={state.checkingAttendance}
                  variant={state.attended ? "default" : "outline"}
                  className={state.attended 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  }
                >
                  {state.checkingAttendance ? (
                    "Loading..."
                  ) : state.attended ? (
                    <>✓ Checked In</>
                  ) : (
                    <>○ Check In</>
                  )}
                </Button>
                {concert.artistImageUrl && (
                  <img
                    src={concert.artistImageUrl}
                    alt={concert.artistName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50 shadow-lg shadow-purple-500/20"
                  />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📅</span>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-semibold">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📍</span>
                  <div>
                    <p className="text-gray-400 text-sm">Venue</p>
                    <p className="text-white font-semibold">{concert.venueName}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🏙️</span>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-semibold">
                      {concert.venueCity}{concert.venueCountry && `, ${concert.venueCountry}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!concert.isLocal && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">🎸</span>
                Setlist
              </h2>
            </CardHeader>
            <CardContent>
              {concert.setlist.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No setlist available</p>
              ) : (
                <ol className="space-y-2">
                  {concert.setlist.map((song, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-white font-medium">{song.name}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <CardTitle className="text-xl font-bold text-white">
                  Reviews
                  {state.reviews.length > 0 && (
                    <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                      {state.reviews.length}
                    </span>
                  )}
                </CardTitle>
              </div>
              {isSessionLoading ? (
                <Skeleton className="h-10 w-32 bg-white/10" />
              ) : currentUserId ? (
                <Link href={`/concerts/${concertId}/review/new`}>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 shadow-lg shadow-purple-500/25 transition-all duration-300"
                  >
                    Write Review
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  >
                    Sign in to Review
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {state.reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </div>
            ) : state.reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎵</div>
                <p className="text-gray-400 text-lg mb-2">No reviews yet</p>
                <p className="text-gray-500 text-sm">
                  {currentUserId
                    ? "Be the first to share your experience!"
                    : "Sign in to be the first to review this concert"}
                </p>
                {isSessionLoading ? (
                  <Skeleton className="mt-4 h-10 w-36 mx-auto bg-white/10" />
                ) : currentUserId ? (
                  <Link href={`/concerts/${concertId}/review/new`}>
                    <Button
                      className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 shadow-lg shadow-purple-500/25 transition-all duration-300"
                    >
                      Write Review
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="mt-4 border-purple-500 text-purple-300 hover:bg-purple-500/20"
                    >
                      Sign in to Review
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {state.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={currentUserId}
                    onEdit={currentUserId === review.user.id ? (reviewId) => router.push(`/reviews/${reviewId}/edit`) : undefined}
                    onDelete={undefined}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {concert.externalUrl && (
          <div className="text-center">
            <a
              href={concert.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              View on setlist.fm
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ConcertDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-6 w-32 bg-white/10" />

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-10 w-64 bg-white/10" />
                <Skeleton className="h-6 w-40 bg-white/10" />
              </div>
              <Skeleton className="w-24 h-24 rounded-full bg-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-white/10" />
                    <Skeleton className="h-5 w-40 bg-white/10" />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-white/10" />
                    <Skeleton className="h-5 w-40 bg-white/10" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-white/10" />
                    <Skeleton className="h-5 w-40 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded bg-white/10" />
              <Skeleton className="h-8 w-32 bg-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="h-20 w-full bg-white/10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}