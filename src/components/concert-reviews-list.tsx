import { getReviewsByConcertId } from "@/actions/get-reviews-by-concert"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

interface ConcertReviewsListProps {
  concertId: string
}

export async function ConcertReviewsList({ concertId }: ConcertReviewsListProps) {
  const session = await auth()
  const currentUserId = session?.user?.id

  const result = await getReviewsByConcertId(concertId)

  if (!result.success || !result.data) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-3">💬</span>
            Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">Failed to load reviews</p>
        </CardContent>
      </Card>
    )
  }

  const reviews = result.data ?? []
  const reviewCount = reviews.length

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <CardTitle className="text-xl font-bold text-white">
              Reviews
              {reviewCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                  {reviewCount}
                </span>
              )}
            </CardTitle>
          </div>
          {currentUserId && (
            <Link href={`/concerts/${concertId}/review/new`}>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 shadow-lg shadow-purple-500/25 transition-all duration-300"
              >
                Write Review
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviewCount === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎵</div>
            <p className="text-gray-400 text-lg mb-2">No reviews yet</p>
            <p className="text-gray-500 text-sm">
              {currentUserId
                ? "Be the first to share your experience!"
                : "Sign in to be the first to review this concert"}
            </p>
            {currentUserId && (
              <Link href={`/concerts/${concertId}/review/new`}>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 shadow-lg shadow-purple-500/25 transition-all duration-300"
                >
                  Write Review
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={currentUserId}
                onEdit={currentUserId === review.user.id ? (reviewId) => redirect(`/reviews/${reviewId}/edit`) : undefined}
                onDelete={undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
