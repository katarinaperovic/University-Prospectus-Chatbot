import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-[#800020] focus-visible:ring-[#800020]/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-xl border-2 bg-transparent px-4 py-3 text-base shadow-md transition-all duration-300 outline-none focus-visible:ring-[3px] focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-[#800020]/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
