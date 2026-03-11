import { NextRequest, NextResponse } from "next/server";
import { searchConcerts } from "@/lib/setlistfm";
import { getOrSetCache, cacheKeys } from "@/lib/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mbid: string }> }
) {
  try {
    const { mbid } = await params;

    if (!mbid) {
      return NextResponse.json({ error: "Artist MBID is required" }, { status: 400 });
    }

    // Use cache-through pattern
    const result = await getOrSetCache(
      cacheKeys.setlistConcerts(mbid),
      async () => {
        const response = await searchConcerts(mbid);
        if (!response.success) {
          throw new Error(response.error);
        }
        return response.data;
      },
      { ttlDays: 7 }
    );

    const concerts = (result.setlists || []).map((setlist) => ({
      id: setlist.id,
      date: setlist.date,
      venue: {
        name: setlist.venue.name,
        city: {
          name: setlist.venue.city.name,
        },
      },
      tour: setlist.tour || undefined,
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