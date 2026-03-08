"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="text-7xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h1>
          <p className="text-gray-400 mb-6">
            An unexpected error occurred. Please try again.
          </p>
          {error.message && (
            <div className="mb-6 p-3 bg-black/20 rounded-lg border border-white/10">
              <p className="text-red-400 text-sm font-mono break-words text-left">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 shadow-lg shadow-purple-500/25 transition-all duration-300"
            >
              Try Again
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 py-6"
              >
                ← Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
