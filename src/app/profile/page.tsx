import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserReviewsList } from "@/components/user-reviews-list"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your concert reviews and activity",
  robots: {
    index: false,
  },
}

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      _count: {
        select: { reviews: true },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
          <CardContent className="relative pt-8 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-500/30">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">
                    {user.name || "Anonymous User"}
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      Member since {joinedDate}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-pink-500/20 text-pink-300 border-pink-500/30"
                    >
                      {user._count.reviews} {user._count.reviews === 1 ? "Review" : "Reviews"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {user._count.reviews}
                </div>
                <p className="text-gray-400 text-sm">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="pt-8 pb-8">
            <UserReviewsList userId={user.id} pageSize={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
