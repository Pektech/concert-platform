import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ attended: false });
    }

    const { id: concertId } = await params;
    if (!concertId) {
      return NextResponse.json(
        { error: "Concert ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        concerts: {
          where: { id: concertId },
        },
      },
    });

    const isAttending = user?.concerts.some((c) => c.id === concertId) ?? false;

    return NextResponse.json({ attended: isAttending });
  } catch (error) {
    console.error("Check attendance error:", error);
    return NextResponse.json(
      { error: "Failed to check attendance status" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: concertId } = await params;
    if (!concertId) {
      return NextResponse.json(
        { error: "Concert ID required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const existingRelation = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        concerts: {
          where: { id: concertId },
        },
      },
    });

    const isAttending = existingRelation?.concerts.some((c) => c.id === concertId);

    if (isAttending) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          concerts: {
            disconnect: { id: concertId },
          },
        },
      });
      return NextResponse.json({ attended: false });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          concerts: {
            connect: { id: concertId },
          },
        },
      });
      return NextResponse.json({ attended: true });
    }
  } catch (error) {
    console.error("Toggle attendance error:", error);
    return NextResponse.json(
      { error: "Failed to toggle attendance" },
      { status: 500 }
    );
  }
}
