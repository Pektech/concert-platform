"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Music, Users, Star } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group/feature-card bg-[var(--surface-container-high)] border-[var(--border)] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="space-y-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover/feature-card:bg-primary/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-headings text-xl font-bold text-[var(--text-primary)] tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-[var(--text-muted)] text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

const features: FeatureCardProps[] = [
  {
    icon: Music,
    title: "Log Your Gigs",
    description: "Never forget a setlist or a mosh pit again. Keep a digital journal of every live music moment you experience.",
  },
  {
    icon: Star,
    title: "Discover the Noise",
    description: "Find upcoming shows and trending artists near you. Get personalized recommendations based on your listening history.",
  },
  {
    icon: Users,
    title: "Join the Pit",
    description: "Follow friends and see what the critics are saying. Share your reviews and connect with fans who share your taste.",
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 md:py-24 bg-[var(--surface-0)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
