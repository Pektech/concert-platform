import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/reviews/[id]/likers - Get list of users who liked a review
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: reviewId } = await params
    
    // Get pagination params from query string if needed
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    const likers = await prisma.reviewLike.findMany({
      where: { reviewId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            // Don't expose private fields like email or real name
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Format the response to be cleaner
    const formattedLikers = likers.map(like => ({
      id: like.user.id,
      displayName: like.user.displayName,
      likedAt: like.createdAt
    }))

    return NextResponse.json({
      likers: formattedLikers,
      total: formattedLikers.length
    })
  } catch (error) {
    console.error("Get likers error:", error)
    return NextResponse.json(
      { error: "Failed to get likers" },
      { status: 500 }
    )
  }
}
