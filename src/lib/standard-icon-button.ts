import { cn } from "@/lib/utils";

/**
 * Icon-sized control (footer social, testimonial arrows, etc.) — matches
 * outline chips: border-border, bg-background, shadow-sm, hover:bg-accent.
 */
export const STANDARD_ICON_BUTTON_CLASS = cn(
  "inline-flex size-10 shrink-0 items-center justify-center rounded-[4px]",
  "border border-border bg-background text-foreground shadow-sm",
  "transition-[color,background-color,border-color,box-shadow,transform] duration-200",
  "hover:border-border hover:bg-accent",
  "active:scale-[0.98] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);
