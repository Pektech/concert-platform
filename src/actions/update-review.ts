"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"

const updateReviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  setlistHighlights: z.string().optional(),
  attended: z.boolean().optional(),
})

export async function updateReview(formData: FormData) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return {
        error: "You must be logged in to update a review",
      }
    }

    const parsed = updateReviewSchema.safeParse({
      id: formData.get("id"),
      rating: parseInt(formData.get("rating") as string, 10),
      text: formData.get("text"),
      setlistHighlights: formData.get("setlistHighlights"),
      attended: formData.get("attended") === "on",
    })

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      }
    }

    const { id, rating, text, setlistHighlights, attended } = parsed.data
    const userId = session.user.id

    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview) {
      return {
        error: "Review not found",
      }
    }

    if (existingReview.userId !== userId) {
      return {
        error: "You can only edit your own reviews",
      }
    }

    await prisma.review.update({
      where: { id },
      data: {
        rating,
        text: text ?? null,
        setlistHighlights: setlistHighlights ?? null,
        attended,
      },
    })

    const concert = await prisma.concert.findUnique({
      where: { id: existingReview.concertId },
    })
    
    if (concert) {
      redirect(`/concerts/${concert.id}`)
    }
    
    redirect("/")
  } catch (error) {
    console.error("Update review error:", error)
    return {
      error: "An error occurred. Please try again.",
    }
  }
}
