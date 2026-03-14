import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ReviewCard } from "@/components/review-card"
import { Users, Music2 } from "lucide-react"
import Link from "next/link"

export default async function FeedPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const currentUserId = session.user.id

  // Get reviews from users that current user follows
  const followedReviews = await prisma.review.findMany({
    where: {
      user: {
        followers: {
          some: {
            followerId: currentUserId,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      likes: {
        where: {
          userId: currentUserId,
        },
        select: {
          id: true,
        },
        take: 1, // Only need to know if user liked, not all likes
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  // Get total count of followed users
  const followedCount = await prisma.follow.count({
    where: {
      followerId: currentUserId,
    },
  })

  // Format reviews with like data
  const formattedReviews = followedReviews.map((review) => ({
    ...review,
    likeCount: review._count.likes,
    isLikedByUser: review.likes.length > 0,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Music2 className="w-10 h-10 text-purple-400" />
              Your Feed
            </h1>
            <p className="text-purple-300">
              Reviews from {followedCount} {followedCount === 1 ? 'person' : 'people'} you follow
            </p>
          </div>

          {followedCount === 0 && (
            <Link href="/reviews">
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                Find Users to Follow
              </button>
            </Link>
          )}
        </div>

        {/* Feed Content */}
        {formattedReviews.length === 0 ? (
          <div className="text-center py-16">
            {followedCount === 0 ? (
              <>
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Not following anyone yet
                </h2>
                <p className="text-gray-400 mb-6">
                  Follow other users to see their reviews in your feed
                </p>
                <Link href="/reviews">
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Browse Reviews
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Music2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  No reviews yet
                </h2>
                <p className="text-gray-400">
                  The users you follow haven&apos;t written any reviews yet
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {formattedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
