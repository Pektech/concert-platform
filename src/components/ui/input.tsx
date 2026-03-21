import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  React.ComponentPropsWithoutRef<typeof InputPrimitive>
>(({ className, type, ...props }, ref) => {
  return (
    <InputPrimitive
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-lg border border-[#353534] bg-[#1C1B1B] px-3 py-2 text-base text-[#E5E2E1] placeholder:text-[#978D9D]/50 transition-colors outline-none focus-visible:border-[#BB86FC] focus-visible:ring-[3px] focus-visible:ring-[#BB86FC]/30 disabled:pointer-events-none disabled:opacity-50 dark:bg-[#1C1B1B] dark:text-[#E5E2E1] dark:placeholder:text-[#978D9D]/50",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
