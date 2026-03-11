import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/reviews/[id]/like - Toggle like (create or delete)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: reviewId } = await params
    const userId = session.user.id

    // Check if like already exists
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    })

    if (existingLike) {
      // Unlike - delete the like
      await prisma.reviewLike.delete({
        where: {
          userId_reviewId: {
            userId,
            reviewId,
          },
        },
      })
    } else {
      // Like - create the like
      await prisma.reviewLike.create({
        data: {
          userId,
          reviewId,
        },
      })
    }

    // Get updated like count
    const likeCount = await prisma.reviewLike.count({
      where: { reviewId },
    })

    return NextResponse.json({
      liked: !existingLike,
      likeCount,
    })
  } catch (error) {
    console.error("Toggle like error:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

// GET /api/reviews/[id]/like - Get like status and count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: reviewId } = await params
    const session = await auth()

    const [likeCount, userLike] = await Promise.all([
      prisma.reviewLike.count({
        where: { reviewId },
      }),
      session?.user?.id
        ? prisma.reviewLike.findUnique({
            where: {
              userId_reviewId: {
                userId: session.user.id,
                reviewId,
              },
            },
          })
        : null,
    ])

    return NextResponse.json({
      likeCount,
      isLiked: !!userLike,
    })
  } catch (error) {
    console.error("Get like status error:", error)
    return NextResponse.json(
      { error: "Failed to get like status" },
      { status: 500 }
    )
  }
}
