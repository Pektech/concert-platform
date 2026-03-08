import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Artist } from "@/types/setlistfm";

interface ArtistCardProps {
  artist: Artist;
  size?: "default" | "sm";
}

export function ArtistCard({ artist, size = "default" }: ArtistCardProps) {
  const hasImage = artist.imageUrl && artist.imageUrl.trim() !== "";

  return (
    <Card size={size} className="group/artist-card hover:ring-2 hover:ring-primary/50 transition-all duration-200">
      <CardContent className="p-0">
        <Link href={`/artists/${artist.mbid}`} className="block">
          <div className="aspect-square relative bg-muted overflow-hidden">
            {hasImage && artist.imageUrl ? (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                className="object-cover group-hover/artist-card:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-1/2 h-1/2 text-muted-foreground/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-base line-clamp-2 group-hover/artist-card:text-primary transition-colors">
              {artist.name}
            </h3>
            {artist.disambiguation && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {artist.disambiguation}
              </p>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
