"use client"

import { PrimaryButton } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E] via-[#1a0f2e]/30 to-[#0E0E0E]" />
      
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#BB86FC]/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#DAB9FF]/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headings text-4xl md:text-5xl lg:text-6xl font-bold text-[#E5E2E1] leading-tight tracking-tight mb-6">
            READY TO LOG YOUR NEXT
            <br />
            <span className="text-[#BB86FC]">CORE MEMORY?</span>
          </h2>

          <p className="font-sans text-lg md:text-xl text-[#978D9D] mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 500,000+ music fans tracking their sonic journey.
          </p>

          <div className="flex justify-center">
            <PrimaryButton
              className="text-lg px-10 py-5 h-auto rounded-md bg-[#BB86FC] text-[#0E0E0E] hover:bg-[#DAB9FF] hover:shadow-[0_0_32px_rgba(187,134,252,0.7)] transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              CREATE YOUR ACCOUNT
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  )
}
