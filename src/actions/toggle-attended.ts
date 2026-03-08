"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function toggleAttended(concertId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return {
        error: "You must be logged in to check in",
      }
    }

    const userId = session.user.id

    const existingRelation = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        concerts: {
          where: { id: concertId },
        },
      },
    })

    const isAttending = existingRelation?.concerts.some((c) => c.id === concertId)

    if (isAttending) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          concerts: {
            disconnect: { id: concertId },
          },
        },
      })
      return { success: true, attended: false }
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          concerts: {
            connect: { id: concertId },
          },
        },
      })
      return { success: true, attended: true }
    }
  } catch (error) {
    console.error("Toggle attended error:", error)
    return {
      error: "An error occurred while updating your attendance. Please try again.",
    }
  }
}
