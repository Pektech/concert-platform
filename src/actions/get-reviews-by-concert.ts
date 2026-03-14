"use server"

import { prisma } from "@/lib/prisma"
import type { Review, User } from "@prisma/client"

type ReviewWithUser = Review & {
  user: Pick<User, "id" | "name">
}

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
    }) as ReviewWithUser[]

    return {
      success: true,
      data: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        text: review.text,
        setlistHighlights: review.setlistHighlights,
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
