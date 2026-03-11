import { Metadata } from "next";
import { SearchAutocomplete } from "@/components/search-autocomplete";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover concerts, track your attendance, and share reviews",
  openGraph: {
    title: "Concert Platform - Home",
    description: "Discover concerts, track your attendance, and share reviews",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              ConcertVibe
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track concerts you&apos;ve seen. Save those you want to see. Tell your friends what&apos;s good.
          </p>
        </section>

        <section className="flex justify-center">
          <SearchAutocomplete />
        </section>

        <section className="text-center space-y-4 pt-8">
          <p className="text-sm text-muted-foreground">
            Search for artists or concerts to get started
          </p>
        </section>
      </div>
    </div>
  );
}
