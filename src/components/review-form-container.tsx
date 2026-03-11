"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createReview } from "@/actions/create-review"
import { ReviewForm } from "@/components/review-form"

interface ReviewFormContainerProps {
  concertId: string
}

export function ReviewFormContainer({ concertId }: ReviewFormContainerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: {
    rating: number
    title?: string
    text?: string
    setlistHighlights?: string
  }) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("rating", values.rating.toString())
      if (values.title) formData.append("title", values.title)
      if (values.text) formData.append("text", values.text)
      if (values.setlistHighlights) formData.append("setlistHighlights", values.setlistHighlights)
      formData.append("concertId", concertId)

      const result = await createReview(formData)

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
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
  )
}
