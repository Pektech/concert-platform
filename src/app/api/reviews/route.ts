import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getEventByGid } from "@/lib/musicbrainz-db";

const createReviewSchema = z.object({
  concertId: z.string().nullable(),
  isManualEntry: z.boolean().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional().nullable(),
  text: z.string().max(10000).optional().nullable(),
  setlistHighlights: z.string().max(2000).optional().nullable(),
  artistName: z.string(),
  artistMbid: z.string().optional(),
  venue: z.string(),
  city: z.string().optional().nullable(),
  concertDate: z.string(),
});

const MUSICBRAINZ_GID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isMusicBrainzGid(id: string | null): id is string {
  return id !== null && MUSICBRAINZ_GID_PATTERN.test(id);
}

async function findOrCreateConcertFromMusicBrainz(
  eventGid: string,
  artistName: string,
  venueName: string,
  cityName: string | null,
  concertDate: string
): Promise<string> {
  let artist = await prisma.artist.findFirst({
    where: { name: artistName },
  });

  let venue = await prisma.venue.findFirst({
    where: { name: venueName },
  });

  if (!artist) {
    artist = await prisma.artist.create({
      data: { name: artistName },
    });
  }

  if (!venue) {
    venue = await prisma.venue.create({
      data: {
        name: venueName,
        city: cityName || null,
      },
    });
  }

  const existingConcert = await prisma.concert.findFirst({
    where: {
      artistId: artist.id,
      venueId: venue.id,
      date: new Date(concertDate),
    },
  });

  if (existingConcert) {
    return existingConcert.id;
  }

  const concert = await prisma.concert.create({
    data: {
      title: `${artistName} - ${concertDate}`,
      date: new Date(concertDate),
      artistId: artist.id,
      venueId: venue.id,
    },
  });

  return concert.id;
}

export async function POST(request: NextRequest) {
  console.log("=== REVIEW API CALLED ===");
  console.log("Request headers:", Object.fromEntries(request.headers));
  
  try {
    const session = await auth();
    console.log("Session result:", session ? { userId: session.user?.id, hasSession: true } : { hasSession: false });

    if (!session?.user?.id) {
      console.log("Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createReviewSchema.parse(body);

    let concertId = validated.concertId;

    if (validated.isManualEntry && !concertId) {
      let artist = await prisma.artist.findFirst({
        where: { name: validated.artistName },
      });

      if (!artist) {
        artist = await prisma.artist.create({
          data: { name: validated.artistName },
        });
      }

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

      const concert = await prisma.concert.create({
        data: {
          title: `${validated.artistName} - Manual Entry`,
          date: new Date(validated.concertDate),
          artistId: artist.id,
          venueId: venue.id,
        },
      });

      concertId = concert.id;
    } else if (isMusicBrainzGid(concertId)) {
      concertId = await findOrCreateConcertFromMusicBrainz(
        concertId,
        validated.artistName,
        validated.venue,
        validated.city || null,
        validated.concertDate
      );
    }

    if (!concertId) {
      return NextResponse.json(
        { error: "Concert ID is required" },
        { status: 400 }
      );
    }

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