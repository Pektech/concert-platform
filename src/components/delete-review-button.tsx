"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteReview } from "@/actions/delete-review"

interface DeleteReviewButtonProps {
  reviewId: string
}

export function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return
    }

    const formData = new FormData()
    formData.append("id", reviewId)

    startTransition(async () => {
      const result = await deleteReview(formData)
      
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="gap-1"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete"}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </>
  )
}
