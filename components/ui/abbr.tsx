import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

function Abbr(props: HTMLAttributes<HTMLElement> & { title?: string }) {
  const { title, children, className, ...rest } = props

  if (!title) {
    return (
      <abbr
        {...rest}
        className={cn("inline-block align-baseline not-prose no-underline", className)}
      >
        {children}
      </abbr>
    )
  }

  return (
    <abbr
      {...rest}
      title={title}
      className={cn(
        "inline-block align-baseline not-prose no-underline cursor-help",
        "border-b border-dotted border-muted-foreground/60 hover:border-muted-foreground transition-colors",
        "hover:bg-muted/50 px-0.5 py-0.5 rounded-sm relative group",
        className,
      )}
    >
      {children}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-normal break-words max-w-[90vw] sm:max-w-xs z-50 border">
        {title}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></span>
      </span>
    </abbr>
  )
}

export { Abbr }


