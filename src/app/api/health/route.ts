import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check if tables are accessible
    const [reviewCount, userCount] = await Promise.all([
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "Review"`,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`
    ])
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      tables: {
        reviews: Number((reviewCount as any)[0].count),
        users: Number((userCount as any)[0].count)
      }
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 503 })
  }
}
