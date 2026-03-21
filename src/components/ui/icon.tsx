import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconVariants = cva("shrink-0 transition-colors", {
  variants: {
    variant: {
      inactive: "text-[#978D9D]",
      active: "text-[#BB86FC]",
      error: "text-[#CF6679]",
    },
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    variant: "inactive",
    size: "md",
  },
})

interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref">,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon
}

function Icon({
  className,
  variant = "inactive",
  size = "md",
  icon: IconComponent,
  ...props
}: IconProps) {
  return (
    <IconComponent
      data-slot="icon"
      className={cn(iconVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Icon, iconVariants }
export type { IconProps }
