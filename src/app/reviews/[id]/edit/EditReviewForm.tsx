"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateReview } from "@/actions/update-review";
import { ReviewForm } from "@/components/review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditReviewPageProps {
  review: {
    id: string;
    rating: number;
    title: string | null;
    text: string | null;
    setlistHighlights: string | null;
    concertId: string;
  };
}

export default function EditReviewPage({ review }: EditReviewPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: { rating: number; title?: string; text?: string; setlistHighlights?: string }) {
    startTransition(async () => {
      setError(null);

      try {
        const formData = new FormData();
        formData.set("id", review.id);
        formData.set("rating", values.rating.toString());
        formData.set("title", values.title ?? "");
        formData.set("text", values.text ?? "");
        formData.set("setlistHighlights", values.setlistHighlights ?? "");

        const result = await updateReview(formData);

        if (result?.error) {
          setError(result.error);
        } else {
          router.refresh();
        }
      } catch {
        setError("An error occurred. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href={`/concerts/${review.concertId}`}
          className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Concert
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✏️</span>
          <CardTitle className="text-2xl font-bold text-white">Edit Your Review</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ReviewForm
          defaultValues={{
            rating: review.rating,
            title: review.title ?? "",
            text: review.text ?? "",
            setlistHighlights: review.setlistHighlights ?? "",
          }}
          onSubmit={onSubmit}
          submitLabel="Update Review"
          isPending={isPending}
          error={error}
          onCancel={() => router.back()}
        />
      </CardContent>
        </Card>
      </div>
    </div>
  );
}
