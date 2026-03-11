import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const concert = await prisma.concert.findUnique({
      where: { id },
      include: {
        artist: true,
        venue: true,
      },
    });

    if (!concert) {
      return NextResponse.json(
        { error: "Concert not found", code: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: concert.id,
        title: concert.title,
        description: concert.description,
        date: concert.date.toISOString(),
        location: concert.location,
        price: concert.price ? Number(concert.price) : null,
        imageUrl: concert.imageUrl,
        artist: {
          id: concert.artist.id,
          name: concert.artist.name,
          bio: concert.artist.bio,
          genre: concert.artist.genre,
          imageUrl: concert.artist.imageUrl,
        },
        venue: {
          id: concert.venue.id,
          name: concert.venue.name,
          address: concert.venue.address,
          city: concert.venue.city,
          capacity: concert.venue.capacity,
        },
        isLocal: true,
      },
    });
  } catch (error) {
    console.error("Error fetching local concert:", error);
    return NextResponse.json(
      { error: "Failed to fetch concert" },
      { status: 500 }
    );
  }
}