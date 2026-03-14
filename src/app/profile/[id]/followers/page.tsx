export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { FollowButton } from "@/components/follow-button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FollowersPageProps {
  params: Promise<{ id: string }>
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { id } = await params
  const session = await auth()
  const currentUserId = session?.user?.id

  // Get the profile owner
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Get followers with pagination (limit to 100 for performance)
  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              followers: true,
              reviews: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
    take: 100, // Limit for performance
  })

  const isOwnProfile = currentUserId === id

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href={`/profile/${id}`}>
          <Button variant="ghost" className="text-purple-300 hover:text-purple-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            {user.name}&apos;s Followers
          </h1>
          <p className="text-purple-300">
            {user._count.followers} {user._count.followers === 1 ? 'follower' : 'followers'}
          </p>
        </div>

        {/* Followers List */}
        {followers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No followers yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers.map((follow) => (
              <div
                key={follow.followerId}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <Link
                  href={`/profile/${follow.follower.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-purple-300">
                        {follow.follower.name?.charAt(0).toUpperCase() ?? '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {follow.follower.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {follow.follower._count.reviews} reviews • {follow.follower._count.followers} followers
                      </p>
                    </div>
                  </div>
                </Link>

                {!isOwnProfile && currentUserId && (
                  <FollowButton
                    userId={follow.follower.id}
                    initialFollowing={false}
                    currentUserId={currentUserId}
                    isOwnProfile={currentUserId === follow.follower.id}
                    size="sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
