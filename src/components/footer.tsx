"use client"

import { NavLink } from "@/components/ui/link"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Github, Twitter, Instagram, Facebook, Music } from "lucide-react"

export function Footer() {
  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Feed" },
    { href: "/reviews", label: "Browse Reviews" },
    { href: "/concerts/search", label: "Search Concerts" },
  ]

  const socialLinks = [
    {
      href: "https://twitter.com",
      label: "Twitter",
      icon: Twitter,
    },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: "https://facebook.com",
      label: "Facebook",
      icon: Facebook,
    },
    {
      href: "https://github.com",
      label: "GitHub",
      icon: Github,
    },
  ]

  return (
    <footer className="w-full border-t border-[#978d9d]/30 bg-[oklch(0.055_0_0)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <NavLink href="/" className="group inline-block mb-4">
              <div className="relative">
                <span className="text-2xl font-bold font-headings bg-gradient-to-r from-[#dab9ff] via-[#d5bcf0] to-[#d4ca38] bg-clip-text text-transparent group-hover:from-[#d4ca38] group-hover:via-[#d5bcf0] group-hover:to-[#dab9ff] transition-all duration-500">
                  ConcertVibe
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#dab9ff] to-[#d4ca38] group-hover:w-full transition-all duration-500" />
              </div>
            </NavLink>
            <p className="text-sm text-[#cdc3d4] mb-4">
              Discover concerts, track your attendance, and share reviews of live music experiences.
            </p>
            <div className="flex items-center gap-2 text-[#978d9d]">
              <Music className="h-4 w-4" />
              <span className="text-xs">Electric Venue</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold font-headings text-[#eedbff] mb-4 uppercase tracking-wide">
              Navigation
            </h3>
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#cdc3d4] hover:text-[#dab9ff] transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold font-headings text-[#eedbff] mb-4 uppercase tracking-wide">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <NavLink
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cdc3d4] hover:text-[#dab9ff] transition-colors"
                  aria-label={social.label}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-[oklch(0.205_0_0)]/50 hover:bg-[oklch(0.205_0_0)] border border-[#978d9d]/30"
                  >
                    <Icon
                      icon={social.icon}
                      size="md"
                      variant="active"
                      className="text-[#dab9ff]"
                    />
                  </Button>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Legal / Info */}
          <div>
            <h3 className="text-sm font-semibold font-headings text-[#eedbff] mb-4 uppercase tracking-wide">
              Electric Venue
            </h3>
            <p className="text-sm text-[#cdc3d4] mb-2">
              © {new Date().getFullYear()} ConcertVibe
            </p>
            <p className="text-xs text-[#978d9d]">
              Powered by MusicBrainz & Setlist.fm
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <NavLink
                href="#"
                className="text-xs text-[#978d9d] hover:text-[#dab9ff] transition-colors"
              >
                Privacy
              </NavLink>
              <span className="text-[#978d9d]/30">•</span>
              <NavLink
                href="#"
                className="text-xs text-[#978d9d] hover:text-[#dab9ff] transition-colors"
              >
                Terms
              </NavLink>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#978d9d]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#978d9d]">
            Built with Electric Venue design system — Encore Noir theme
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#978d9d]">
              Made for music lovers 🎵
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
