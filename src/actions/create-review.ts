"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  text: z.string().optional(),
  setlistHighlights: z.string().optional(),
  concertId: z.string(),
})

export async function createReview(formData: FormData) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return {
        error: "You must be logged in to leave a review",
      }
    }

    const parsed = reviewSchema.safeParse({
      rating: Number(formData.get("rating")),
      text: formData.get("text") || undefined,
      setlistHighlights: formData.get("setlistHighlights") || undefined,
      concertId: formData.get("concertId"),
    })

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      }
    }

    const { rating, text, setlistHighlights, concertId } = parsed.data

    // Get concert details for cached fields
    const concert = await prisma.concert.findUnique({
      where: { id: concertId },
      include: {
        artist: true,
        venue: true,
      },
    })

    if (!concert) {
      return { error: "Concert not found" }
    }

    // Create the review with cached concert data
    await prisma.review.create({
      data: {
        rating,
        text,
        setlistHighlights,
        userId: session.user.id,
        concertId,
        // Cached concert data
        artistName: concert.artist.name,
        venue: concert.venue.name,
        city: concert.venue.city,
        concertDate: concert.date,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Review creation error:", error)
    return {
      error: "An error occurred while creating your review. Please try again.",
    }
  }
}
