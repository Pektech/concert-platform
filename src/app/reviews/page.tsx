import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth as getServerSession } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/star-rating";
import { ChevronLeft, ChevronRight, Music, User, Calendar } from "lucide-react";

const REVIEWS_PER_PAGE = 20;

interface ReviewWithRelations {
  id: string;
  rating: number;
  text: string | null;
  setlistHighlights: string | null;
  attended: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  concert: {
    id: string;
    title: string;
    date: Date;
    artist: {
      name: string;
    };
    venue: {
      name: string;
      city: string | null;
    };
  };
}

interface ReviewsPageState {
  reviews: ReviewWithRelations[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
}

async function getReviews(page: number): Promise<ReviewsPageState> {
  const skip = (page - 1) * REVIEWS_PER_PAGE;

  const [reviews, totalReviews] = await Promise.all([
    prisma.review.findMany({
      skip,
      take: REVIEWS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        concert: {
          select: {
            id: true,
            title: true,
            date: true,
            artist: {
              select: {
                name: true,
              },
            },
            venue: {
              select: {
                name: true,
                city: true,
              },
            },
          },
        },
      },
    }),
    prisma.review.count(),
  ]);

  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

  return {
    reviews,
    currentPage: page,
    totalPages,
    totalReviews,
  };
}

function ReviewsList({ reviews }: { reviews: ReviewWithRelations[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
        <p className="text-gray-400">Be the first to share your concert experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: ReviewWithRelations; index: number }) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const concertDate = new Date(review.concert.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const textPreview = review.text
    ? review.text.length > 200
      ? review.text.substring(0, 200) + "..."
      : review.text
    : null;

  return (
    <Card
      className="group/review relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover/review:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <Link
                href={`/profiles/${review.user.id}`}
                className="block w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow duration-300"
              >
                {review.user.name?.charAt(0).toUpperCase() || review.user.email.charAt(0).toUpperCase()}
              </Link>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={review.rating} size="sm" />
                {review.attended && (
                  <Badge className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-500/90 font-semibold text-xs shadow-sm">
                    ✓ Attended
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Link
                  href={`/profiles/${review.user.id}`}
                  className="font-semibold text-white hover:text-purple-300 transition-colors duration-200"
                >
                  {review.user.name || "Anonymous"}
                </Link>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{formattedDate}</span>
              </div>

              <Link
                href={`/concerts/${review.concert.id}`}
                className="block group/concert"
              >
                <div className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-200">
                  <Music className="w-4 h-4" />
                  <span className="font-medium">
                    {review.concert.artist.name}
                  </span>
                  <span className="text-gray-500">@</span>
                  <span className="font-medium">
                    {review.concert.venue.name}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {concertDate}
                </span>
                {review.concert.venue.city && (
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {review.concert.venue.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {(textPreview || review.setlistHighlights) && (
          <div className="pl-16 space-y-3">
            {textPreview && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {textPreview}
              </p>
            )}

            {review.setlistHighlights && review.setlistHighlights.trim() !== "" && (
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-500/20">
                <p className="text-xs font-semibold text-indigo-400 mb-1.5 uppercase tracking-wide">
                  Setlist Highlights
                </p>
                <p className="text-sm text-indigo-200 whitespace-pre-wrap leading-relaxed line-clamp-2">
                  {review.setlistHighlights}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pl-16 mt-4 pt-4 border-t border-white/10">
          <Link
            href={`/concerts/${review.concert.id}`}
            className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition-colors duration-200 font-medium"
          >
            Read full review
            <ChevronRight className="w-4 h-4 group-hover/review:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-24 h-4 bg-white/10" />
                  <Skeleton className="w-16 h-4 bg-white/10" />
                </div>
                <Skeleton className="w-48 h-4 bg-white/10" />
                <Skeleton className="w-full h-16 bg-white/10" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Link
        href={currentPage > 1 ? `/reviews?page=${currentPage - 1}` : "/reviews"}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage > 1
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Link>

      <span className="text-gray-400 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={currentPage < totalPages ? `/reviews?page=${currentPage + 1}` : `/reviews?page=${totalPages}`}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage < totalPages
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

async function ReviewsContent({ initialPage }: { initialPage: number }) {
  const data = await getReviews(initialPage);

  if (data.reviews.length === 0 && initialPage > 1) {
    redirect("/reviews");
  }

  return (
    <>
      <ReviewsList reviews={data.reviews} />
      <Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
    </>
  );
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const currentPage = page < 1 ? 1 : page;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors duration-200 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <span className="text-5xl">🎸</span>
                Recent Reviews
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Discover concert experiences from the community
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsContent initialPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
