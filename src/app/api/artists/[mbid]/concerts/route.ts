import { NextRequest, NextResponse } from "next/server";
import { getArtistEvents } from "@/lib/musicbrainz-db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mbid: string }> }
) {
  try {
    const { mbid } = await params;

    if (!mbid) {
      return NextResponse.json({ error: "Artist MBID is required" }, { status: 400 });
    }

    // Get events from local MusicBrainz database
    const result = await getArtistEvents(mbid, 100);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    const concerts = (result.data.events || []).map((event) => ({
      id: event.gid,
      date: event.year && event.month && event.day ? `${event.year}-${String(event.month).padStart(2, "0")}-${String(event.day).padStart(2, "0")}` : undefined,
      venue: {
        name: event.venue?.name || "Unknown Venue",
        city: {
          name: event.venue?.area || "Unknown City",
        },
      },
      tour: undefined,
    }));

    return NextResponse.json({ concerts });
  } catch (error) {
    console.error("Error fetching artist concerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch concerts" },
      { status: 500 }
    );
  }
}