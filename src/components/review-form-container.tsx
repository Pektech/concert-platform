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
        text: "",
        setlistHighlights: "",
        attended: false,
      }}
    />
  )
}
