"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createReview } from "@/actions/create-review"
import { ReviewForm } from "@/components/review-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConcertReviewFormPageProps {
  params: {
    id: string
  }
}

export default function ConcertReviewFormPage({ params }: ConcertReviewFormPageProps) {
  const router = useRouter()
  const concertId = params.id
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: {
    rating: number
    text?: string
    setlistHighlights?: string
    attended?: boolean
  }) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("rating", values.rating.toString())
      if (values.text) formData.append("text", values.text)
      if (values.setlistHighlights) formData.append("setlistHighlights", values.setlistHighlights)
      formData.append("attended", values.attended ? "on" : "off")
      formData.append("concertId", concertId)

      const result = await createReview(formData)

      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/concerts/${concertId}`)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href={`/concerts/${concertId}`}
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
              <span className="text-3xl">✍️</span>
              <CardTitle className="text-2xl font-bold text-white">Write a Review</CardTitle>
            </div>
            <p className="text-gray-400 text-sm">Share your experience at this concert</p>
          </CardHeader>
          <CardContent>
            <ReviewForm
              onSubmit={handleSubmit}
              submitLabel="Submit Review"
              isPending={isPending}
              error={error}
              defaultValues={{
                rating: 0,
                title: "",
                text: "",
                setlistHighlights: "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
