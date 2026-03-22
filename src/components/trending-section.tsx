"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

interface TrendingConcert {
  id: string
  artist: string
  venue: string
  date: string
  location: string
  imageUrl: string
}

interface TrendingSectionProps {
  concerts?: TrendingConcert[]
}

const defaultConcerts: TrendingConcert[] = [
  {
    id: "1",
    artist: "Electric Dreams Tour",
    venue: "Nora En Pure",
    date: "London O2",
    location: "London, UK",
    imageUrl: "/design/concert-1.jpg",
  },
  {
    id: "2",
    artist: "Void of Silence",
    venue: "The Knife",
    date: "Hackney, London",
    location: "London, UK",
    imageUrl: "/design/concert-2.jpg",
  },
  {
    id: "3",
    artist: "Solar Flare Live",
    venue: "Arlo Parks",
    date: "NYC",
    location: "New York, USA",
    imageUrl: "/design/concert-3.jpg",
  },
  {
    id: "4",
    artist: "Pulse Frequency",
    venue: "ODESZA",
    date: "Tokyo",
    location: "Tokyo, Japan",
    imageUrl: "/design/concert-4.jpg",
  },
]

export function TrendingSection({ concerts = defaultConcerts }: TrendingSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-[var(--surface-container-lowest)]">
      <div className="container mx-auto px-6">
<div className="mb-8 md:mb-12">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="font-headings text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-3">
        TRENDING NOW
      </h2>
      <p className="font-sans text-[var(--text-muted)] text-base md:text-lg leading-relaxed max-w-2xl">
        The most discussed shows on Electric Venue right now.
      </p>
    </div>
    <Link href="/concerts/search" className="hidden md:flex items-center gap-2 text-[#BB86FC] hover:text-[#DAB9FF] transition-colors font-semibold">
      <span>Explore All</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {concerts.map((concert) => (
            <Link
              key={concert.id}
              href={`/concerts/${concert.id}`}
              className="group/trending-card block h-full"
            >
              <Card className="h-full bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/5 border-[var(--border)] hover:border-[var(--primary)]/30 overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={concert.imageUrl}
                    alt={`${concert.artist} live at ${concert.venue}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/trending-card:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-container)]/90 via-[var(--surface-container)]/20 to-transparent" />
                </div>

                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="font-headings text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight line-clamp-1 group-hover/trending-card:text-[var(--primary)] transition-colors duration-300">
                    {concert.artist}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">{concert.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{concert.date}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-xs text-[var(--outline)] font-medium">
                      {concert.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
