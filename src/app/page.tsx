import { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { FeatureCards } from "@/components/feature-cards";
import { TrendingSection } from "@/components/trending-section";
import { CallToAction } from "@/components/call-to-action";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Electric Venue - Your Concert Life, Documented",
  description: "Log every gig, rate the vibe, and join a global community of music fanatics.",
  openGraph: {
    title: "Electric Venue - Your Concert Life, Documented",
    description: "Log every gig, rate the vibe, and join a global community of music fanatics.",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <TrendingSection />
      <CallToAction />
      <Footer />
    </>
  );
}
