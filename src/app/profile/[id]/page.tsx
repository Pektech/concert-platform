import { notFound } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UserReviewsList } from "@/components/user-reviews-list";
import { FollowButton } from "@/components/follow-button";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true },
  });

  const userName = user?.name ?? "User";
  
  return {
    title: userName,
    description: `Profile of ${userName} on Concert Platform`,
    openGraph: {
      title: `${userName} | Concert Platform`,
      description: `View ${userName}'s concert reviews and activity`,
    },
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      reviews: {
        select: {
          id: true,
        },
      },
      concerts: {
        select: {
          id: true,
        },
      },
      followers: {
        where: {
          followerId: currentUserId,
        },
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const reviewCount = user.reviews.length;
  const concertsCount = user.concerts.length;
  const isFollowing = user.followers.length > 0;
  const isOwnProfile = currentUserId === id;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
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
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-500/30">
                {user.name?.charAt(0).toUpperCase() ?? user.email.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-bold text-white">{user.name ?? "Anonymous User"}</h1>
                <div className="flex items-center flex-wrap gap-3">
                  <Badge variant="outline" className="text-purple-300 border-purple-500/50 bg-purple-500/10">
                    {user.role}
                  </Badge>
                  <span className="text-gray-400 text-sm">Member since {joinDate}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300 pt-2">
                  <Link href={`/profile/${id}/followers`} className="hover:text-white transition-colors">
                    <strong>{user._count.followers}</strong> followers
                  </Link>
                  <Link href={`/profile/${id}/following`} className="hover:text-white transition-colors">
                    <strong>{user._count.following}</strong> following
                  </Link>
                </div>
              </div>
              {!isOwnProfile && currentUserId && (
                <FollowButton
                  userId={id}
                  initialFollowing={isFollowing}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-2 gap-6 pt-4">
              <StatCard
                icon="🎵"
                label="Reviews"
                value={reviewCount}
                delay={0}
              />
              <StatCard
                icon="🎸"
                label="Concerts"
                value={concertsCount}
                delay={100}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="text-3xl mr-3">📊</span>
              Profile Statistics
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <p className="text-white font-semibold">Total Reviews</p>
                    <p className="text-gray-400 text-sm">Reviews written</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-purple-400">{reviewCount}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎪</span>
                  <div>
                    <p className="text-white font-semibold">Tracked Concerts</p>
                    <p className="text-gray-400 text-sm">Concerts in profile</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-purple-400">{concertsCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <UserReviewsList userId={user.id} />

        {reviewCount === 0 && concertsCount === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-white mb-2">No Activity Yet</h3>
              <p className="text-gray-400 mb-6">
                This user hasn&apos;t reviewed any concerts or added any to their profile yet.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Explore Concerts
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, delay }: { icon: string; label: string; value: number; delay: number }) {
  return (
    <div
      className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({
    id: user.id,
  }));
}
