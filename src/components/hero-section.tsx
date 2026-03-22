"use client"

import Image from "next/image"
import { Button, PrimaryButton } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/design/background.png"
          alt="Concert crowd with lights"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#0E0E0E]/90 via-[#0E0E0E]/70 via-[#0E0E0E]/50 to-transparent" />

      {/* Laser light effects */}
      <div className="absolute inset-0 z-1 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1 h-[400px] bg-gradient-to-b from-[#BB86FC]/40 to-transparent transform -skew-x-12 blur-sm" />
        <div className="absolute top-0 left-1/3 w-1 h-[500px] bg-gradient-to-b from-[#DAB9FF]/30 to-transparent transform -skew-x-6 blur-sm" />
        <div className="absolute top-0 right-1/4 w-1 h-[450px] bg-gradient-to-b from-[#BB86FC]/35 to-transparent transform skew-x-12 blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
        {/* Stats badge */}
        <div className="mb-6 px-4 py-2 rounded-full border border-[#BB86FC]/30 bg-[#BB86FC]/10 backdrop-blur-sm">
          <p className="text-sm font-sans text-[#BB86FC] tracking-wide">
            100+ GIGS LOGGED THIS MONTH
          </p>
        </div>

        <h1 className="font-headings text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#E5E2E1] leading-tight tracking-tight mb-6">
          YOUR CONCERT LIFE,
          <br />
          <span className="text-[#DAB9FF] italic">DOCUMENTED.</span>
        </h1>

        <p className="font-sans text-lg md:text-xl text-[#978D9D] mb-10 max-w-2xl leading-relaxed">
          Log every gig, rate the vibe, and join a global community of music fanatics.
        </p>

        <div className="flex flex-wrap items-center gap-4 justify-center">
          <PrimaryButton
            className="text-base px-8 py-4 h-auto font-semibold transition-all duration-300 hover:!shadow-[0_0_40px_4px_rgba(187,134,252,1)]!"
          >
            GET STARTED - IT&apos;S FREE
          </PrimaryButton>
          <Button
            variant="secondary"
            className="text-base px-8 py-4 h-auto font-semibold border-2 border-[#BB86FC] text-[#BB86FC] hover:!bg-[#BB86FC] hover:!text-[#0E0E0E] hover:!shadow-[0_0_40px_4px_rgba(187,134,252,1)]! transition-all duration-300"
          >
            View Trending
          </Button>
        </div>
      </div>

      {/* Extended gradient fade - adjusted to not wash out buttons */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-[var(--surface-0)] via-[var(--surface-0)]/60 to-transparent z-2" />
      
      {/* Additional soft fade layer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[var(--surface-0)] to-transparent z-3" />
    </section>
  )
}
