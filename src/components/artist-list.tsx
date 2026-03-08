import type { Artist } from "@/types/setlistfm";
import { ArtistCard } from "./artist-card";

interface ArtistListProps {
  artists: Artist[];
  size?: "default" | "sm";
  className?: string;
}

export function ArtistList({ artists, size = "default", className = "" }: ArtistListProps) {
  if (artists.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No artists found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      {artists.map((artist) => (
        <ArtistCard key={artist.mbid} artist={artist} size={size} />
      ))}
    </div>
  );
}
