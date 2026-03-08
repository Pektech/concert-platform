"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function deleteReview(formData: FormData) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return {
        error: "You must be logged in to delete a review",
      }
    }

    const reviewId = formData.get("id") as string

    if (!reviewId) {
      return {
        error: "Review ID is required",
      }
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview) {
      return {
        error: "Review not found",
      }
    }

    if (existingReview.userId !== session.user.id) {
      return {
        error: "You can only delete your own reviews",
      }
    }

    const concertId = existingReview.concertId

    await prisma.review.delete({
      where: { id: reviewId },
    })

    redirect(`/concerts/${concertId}`)
  } catch (error) {
    console.error("Delete review error:", error)
    return {
      error: "An error occurred. Please try again.",
    }
  }
}
