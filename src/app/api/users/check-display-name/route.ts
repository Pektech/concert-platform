import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/users/check-display-name?displayName=username
// Checks if a display name is available (display names are unique)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const displayName = searchParams.get("displayName")

    if (!displayName || displayName.trim().length === 0) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      )
    }

    if (displayName.length > 50) {
      return NextResponse.json(
        { error: "Display name must be 50 characters or less" },
        { status: 400 }
      )
    }

    // Check if display name already exists (stored as 'name' in DB)
    const existing = await prisma.user.findUnique({
      where: { name: displayName.trim() },
    })

    return NextResponse.json({
      available: !existing,
      displayName: displayName.trim(),
    })
  } catch (error) {
    console.error("Display name check failed:", error)
    return NextResponse.json(
      { error: "Failed to check display name availability" },
      { status: 500 }
    )
  }
}
