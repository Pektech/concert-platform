"use server"

import { prisma } from "@/lib/prisma"

export async function getReviewsByConcertId(concertId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { concertId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        text: review.text,
        setlistHighlights: review.setlistHighlights,
        attended: review.attended,
        createdAt: review.createdAt.toISOString(),
        user: {
          id: review.user.id,
          name: review.user.name,
        },
      })),
    }
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return {
      success: false,
      error: "Failed to load reviews",
    }
  }
}
