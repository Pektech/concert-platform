import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReviewSchema = z.object({
  concertId: z.string().nullable(),
  isManualEntry: z.boolean().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional().nullable(),
  text: z.string().max(10000).optional().nullable(),
  setlistHighlights: z.string().max(2000).optional().nullable(),
  // Cached concert data
  artistName: z.string(),
  artistMbid: z.string().optional(),
  venue: z.string(),
  city: z.string().optional().nullable(),
  concertDate: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createReviewSchema.parse(body);

    let concertId = validated.concertId;

    // Handle manual entry - create minimal concert/artist/venue records
    if (validated.isManualEntry && !concertId) {
      // Find or create artist
      let artist = await prisma.artist.findFirst({
        where: { name: validated.artistName },
      });

      if (!artist) {
        artist = await prisma.artist.create({
          data: {
            name: validated.artistName,
          },
        });
      }

      // Find or create venue
      let venue = await prisma.venue.findFirst({
        where: { name: validated.venue },
      });

      if (!venue) {
        venue = await prisma.venue.create({
          data: {
            name: validated.venue,
            city: validated.city || null,
          },
        });
      }

      // Create a minimal concert for this manual entry
      const concert = await prisma.concert.create({
        data: {
          title: `${validated.artistName} - Manual Entry`,
          date: new Date(validated.concertDate),
          artistId: artist.id,
          venueId: venue.id,
        },
      });

      concertId = concert.id;
    }

    if (!concertId) {
      return NextResponse.json(
        { error: "Concert ID is required" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this concert
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        concertId: concertId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this concert" },
        { status: 400 }
      );
    }

    // Create the review with cached concert data
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        concertId: concertId,
        rating: validated.rating,
        title: validated.title,
        text: validated.text,
        setlistHighlights: validated.setlistHighlights,
        artistName: validated.artistName,
        venue: validated.venue,
        city: validated.city,
        concertDate: new Date(validated.concertDate),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("=== REVIEW CREATION ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    if (error instanceof z.ZodError) {
      console.error("Zod issues:", error.issues);
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create review", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}