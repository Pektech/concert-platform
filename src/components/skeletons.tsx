import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewCardSkeleton() {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
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
  );
}

export function ReviewsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ConcertDetailSkeleton() {
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
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-white/10" />
                    <Skeleton className="h-5 w-24 bg-white/10" />
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
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
                  <Skeleton className="h-5 flex-1 bg-white/10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-6 w-32 bg-white/10" />

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="relative pt-8 pb-8">
            <div className="flex items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-full bg-white/10" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-10 w-64 bg-white/10" />
                <Skeleton className="h-5 w-48 bg-white/10" />
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-32 bg-white/10" />
                  <Skeleton className="h-6 w-24 bg-white/10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="pt-8">
            <ReviewsListSkeleton count={3} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full bg-white/10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48 bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full bg-white/10 rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function ArtistListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </div>
  );
}
