import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/users/[id]/follow - Toggle follow (create or delete)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: followingId } = await params
    const followerId = session.user.id

    // Prevent self-following
    if (followerId === followingId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: followingId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if follow already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow - delete the record
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      })
      
      // Get updated counts
      const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({ where: { followingId } }),
        prisma.follow.count({ where: { followerId } }),
      ])
      
      return NextResponse.json({ 
        following: false,
        followersCount,
        followingCount,
      })
    } else {
      // Follow - create the record
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      })
      
      // Get updated counts
      const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({ where: { followingId } }),
        prisma.follow.count({ where: { followerId } }),
      ])
      
      return NextResponse.json({ 
        following: true,
        followersCount,
        followingCount,
      }, { status: 201 })
    }
  } catch (error) {
    console.error("Toggle follow error:", error)
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    )
  }
}
