"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StarRating } from "@/components/star-rating"
import { Calendar, MapPin, Music, ChevronLeft, ChevronRight } from "lucide-react"

interface UserReview {
  id: string
  rating: number
  text: string | null
  setlistHighlights: string | null
  attended: boolean
  createdAt: string
  concert: {
    id: string
    title: string
    date: string
    location: string | null
    artist: {
      name: string
    }
    venue: {
      name: string
    }
  }
}

interface UserReviewsListProps {
  userId: string
  pageSize?: number
}

function formatConcertDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function UserReviewsList({ userId, pageSize = 5 }: UserReviewsListProps) {
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const offset = (currentPage - 1) * pageSize
      const response = await fetch(
        `/api/concerts/user/${userId}/reviews?limit=${pageSize}&offset=${offset}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data = await response.json()
      setReviews(data.reviews)
      setTotalReviews(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [userId, currentPage, pageSize])

  useEffect(() => {
    if (userId) {
      fetchReviews()
    }
  }, [userId, fetchReviews])

  const totalPages = Math.ceil(totalReviews / pageSize)
  const hasMore = currentPage < totalPages
  const hasLess = currentPage > 1

  if (loading) {
    return <ReviewsListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Reviews</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button
          onClick={() => {
            setLoading(true)
            fetchReviews()
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-7xl mb-6 animate-bounce">🎵</div>
        <h3 className="text-2xl font-bold text-white mb-3">No Reviews Yet</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          You haven&apos;t reviewed any concerts yet. Start exploring concerts and share your
          experiences with the community!
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 shadow-lg shadow-purple-500/25 transition-all duration-300">
            Explore Concerts
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🎤</span>
          My Reviews
          <Badge
            variant="secondary"
            className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-2"
          >
            {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
          </Badge>
        </h2>
      </div>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <ReviewListItem key={review.id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={!hasLess}
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasMore}
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ReviewListItem({ review }: { review: UserReview }) {
  const concertDate = formatConcertDate(review.concert.date)
  const textPreview = review.text
    ? review.text.length > 200
      ? review.text.substring(0, 200) + "..."
      : review.text
    : null

  return (
    <Card className="group/review relative overflow-hidden border-l-4 border-l-purple-500/50 hover:border-l-purple-400 transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10">
      {review.attended && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-emerald-500/10 to-transparent px-3 py-1.5">
            <Badge
              variant="secondary"
              className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-500/90 font-semibold text-xs shadow-sm"
            >
              ✓ Attended
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <Link href={`/concerts/${review.concert.id}`} className="block group/link">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={review.rating} size="sm" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover/link:text-purple-300 transition-colors duration-200 truncate">
                {review.concert.artist.name}
              </h3>
              {review.concert.title !== review.concert.artist.name && (
                <p className="text-sm text-purple-300 truncate">{review.concert.title}</p>
              )}
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{concertDate}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md">
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate max-w-[200px]">{review.concert.venue.name}</span>
          </div>
          {review.concert.location && (
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate max-w-[150px]">{review.concert.location}</span>
            </div>
          )}
        </div>

        {textPreview && (
          <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg p-3 border border-purple-500/20">
            <p className="text-sm text-gray-300 leading-relaxed">{textPreview}</p>
          </div>
        )}

        {review.setlistHighlights && review.setlistHighlights.trim() !== "" && (
          <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-lg p-3 border border-indigo-500/20">
            <p className="text-xs font-semibold text-indigo-400 mb-1.5 uppercase tracking-wide">
              Setlist Highlights
            </p>
            <p className="text-sm text-indigo-200 line-clamp-2 leading-relaxed">
              {review.setlistHighlights}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent" />
          <Link
            href={`/concerts/${review.concert.id}`}
            className="ml-4 text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors duration-200 flex items-center gap-1.5"
          >
            View Concert
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

function ReviewsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded bg-white/10" />
        <Skeleton className="h-8 w-32 bg-white/10" />
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-24 bg-white/10" />
                  <Skeleton className="h-5 w-48 bg-white/10" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-32 bg-white/10 rounded-md" />
                <Skeleton className="h-8 w-40 bg-white/10 rounded-md" />
                <Skeleton className="h-8 w-28 bg-white/10 rounded-md" />
              </div>
              <Skeleton className="h-20 w-full bg-white/10 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
