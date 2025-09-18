import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type HorizontalRowSize = "xs" | "sm" | "md" | "lg" | "xl" | "full"
type HorizontalRowAlign = "left" | "center" | "right"

interface HorizontalRowProps extends HTMLAttributes<HTMLHRElement> {
  size?: HorizontalRowSize
  align?: HorizontalRowAlign
}

const sizeToClass: Record<HorizontalRowSize, string> = {
  xs: "w-16",
  sm: "w-24",
  md: "w-1/3",
  lg: "w-1/2",
  xl: "w-11/12",
  full: "w-full",
}

const alignToClass: Record<HorizontalRowAlign, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
}

function HorizontalRow(props: HorizontalRowProps) {
  const { size = "xl", align = "center", className, ...rest } = props

  return (
    <hr
      {...rest}
      className={cn(
        "border-t border-muted-foreground/30 my-12",
        sizeToClass[size],
        alignToClass[align],
        className,
      )}
    />
  )
}

export { HorizontalRow }
