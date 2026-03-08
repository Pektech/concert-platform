import { Venue } from "@/types/setlistfm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VenueCardProps {
  venue: Venue | null | undefined;
}

export function VenueCard({ venue }: VenueCardProps) {
  if (!venue) {
    return null;
  }

  const { name, city, url } = venue;

  const cityName = city?.name ?? "Unknown City";
  const countryName = city?.country?.name ?? "";
  const countryCode = city?.country?.code ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name || "Unnamed Venue"}</CardTitle>
        <CardDescription>
          {cityName}
          {countryName && `, ${countryName}`}
          {countryCode && ` (${countryCode})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            View venue details →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
