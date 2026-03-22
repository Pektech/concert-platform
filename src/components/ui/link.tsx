"use client"

import * as React from "react"
import NextLink from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const linkVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "text-[#BB86FC] hover:underline hover:underline-offset-2 hover:decoration-2",
        secondary:
          "opacity-70 hover:opacity-100 hover:text-[#BB86FC]",
        nav:
          "opacity-70 hover:opacity-100 hover:text-[#BB86FC] border-b-2 border-transparent hover:border-[#BB86FC]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

function Link({
  className,
  variant = "primary",
  href,
  active,
  children,
  ...props
}: React.ComponentProps<typeof NextLink> &
  VariantProps<typeof linkVariants> & {
    active?: boolean
  }) {
  if (!href) {
    throw new Error("Link component requires an href prop")
  }
  
  return (
    <NextLink
      data-slot="link"
      href={href}
      className={cn(linkVariants({ variant, className }))}
      data-active={active ? "true" : undefined}
      {...props}
    >
      {children}
    </NextLink>
  )
}

const PrimaryLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>((props, ref) => <Link ref={ref} variant="primary" {...props} />)
PrimaryLink.displayName = "PrimaryLink"

const SecondaryLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>((props, ref) => <Link ref={ref} variant="secondary" {...props} />)
SecondaryLink.displayName = "SecondaryLink"

const NavLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    active?: boolean
  }
>(({ active, ...props }, ref) => <Link ref={ref} variant="nav" active={active} {...props} />)
NavLink.displayName = "NavLink"

export { Link, linkVariants, PrimaryLink, SecondaryLink, NavLink }
