import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="text-7xl mb-6">🎵</div>
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 shadow-lg shadow-purple-500/25 transition-all duration-300">
                ← Back to Home
              </Button>
            </Link>
            <Link href="/reviews">
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 py-6"
              >
                Browse Reviews
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
