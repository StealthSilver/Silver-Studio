"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { useHeroRevealHeld } from "@/context/hero-reveal-held-context";
import { useNarrowViewport } from "@/lib/use-narrow-viewport";
import { cn } from "@/lib/utils";

export const HERO_TILE_COUNT = 5;

/** Subtle width variety only — all neutral / grayscale. */
const NEUTRAL_HERO_LAYOUT = [
  {
    headline: ["w-[88%]", "w-[62%]"] as const,
    lines: ["w-full", "w-[92%]", "w-[68%]"] as const,
    ctas: ["flex-[1.2]", "flex-1"] as const,
  },
  {
    headline: ["w-[82%]", "w-[58%]"] as const,
    lines: ["w-[96%]", "w-[78%]", "w-[55%]"] as const,
    ctas: ["flex-1", "flex-[1.15]"] as const,
  },
  {
    headline: ["w-[90%]", "w-[54%]"] as const,
    lines: ["w-full", "w-[85%]", "w-[72%]"] as const,
    ctas: ["flex-[1.25]", "flex-1"] as const,
  },
  {
    headline: ["w-[85%]", "w-[66%]"] as const,
    lines: ["w-[98%]", "w-[88%]", "w-[60%]"] as const,
    ctas: ["flex-1", "flex-1"] as const,
  },
  {
    headline: ["w-[79%]", "w-[70%]"] as const,
    lines: ["w-full", "w-[80%]", "w-[64%]"] as const,
    ctas: ["flex-[1.1]", "flex-[1.05]"] as const,
  },
] as const;

function tileStackZ(index: number): number {
  return 10 + index;
}

function GlassWebTile({ index, accent }: { index: number; accent?: boolean }) {
  const mock = NEUTRAL_HERO_LAYOUT[index % HERO_TILE_COUNT];

  return (
    <div
      className={cn(
        "relative flex w-[13rem] flex-col overflow-hidden rounded-2xl max-sm:w-[10.75rem] sm:w-[16.5rem]",
        accent
          ? "h-[17rem] max-sm:h-[14rem] sm:h-[19.5rem]"
          : "h-[16rem] max-sm:h-[13.25rem] sm:h-[18.5rem]",
        "backdrop-blur-xl",
        "border shadow-md transition-[box-shadow,border-color] duration-300",
        accent
          ? cn(
              "border-border/90",
              "shadow-[0_10px_36px_-12px_rgb(15_23_42/0.1),0_4px_14px_-6px_rgb(100_116_139/0.1),inset_0_1px_0_rgb(255_255_255/0.8)]",
              "bg-gradient-to-b from-card/88 via-secondary/50 to-border/35",
              "dark:border-border/55 dark:shadow-[0_8px_30px_-8px_rgb(186_198_215/0.12)]",
              "dark:from-muted/52 dark:via-card/38 dark:to-background/58",
            )
          : cn(
              "border-border/78",
              "shadow-[0_4px_28px_-10px_rgb(15_23_42/0.06),0_2px_8px_-4px_rgb(15_23_42/0.04)]",
              "bg-gradient-to-b from-card/62 via-card/38 to-secondary/22",
              "dark:border-border/42",
              "dark:from-card/48 dark:via-muted/32 dark:to-background/60",
              "dark:shadow-[0_4px_28px_-6px_rgb(0_0_0/0.5)]",
            ),
      )}
    >
      {/* Light-only: faint sky tint (pairs with Final CTA / work-section blues). */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-0 rounded-[inherit] dark:hidden",
          "bg-[linear-gradient(185deg,rgb(236_243_251_/_0.42)_0%,transparent_38%,rgb(228_238_251_/_0.32)_100%),radial-gradient(ellipse_72%_58%_at_50%_52%,rgb(154_182_212_/_0.09)_0%,transparent_62%)]",
        )}
      />
      {/* Browser chrome */}
      <div
        className={cn(
          "relative z-[1] flex shrink-0 items-center gap-2 border-b border-border/65 px-2.5 py-2 sm:px-3 sm:py-2.5 dark:border-border/48",
          "bg-card/50 dark:bg-muted/58",
        )}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="size-2 rounded-full bg-foreground/[0.12] dark:bg-foreground/[0.2]"
              aria-hidden
            />
          ))}
        </div>
        <div className="ms-0.5 h-2 flex-1 rounded-full bg-foreground/[0.08] dark:bg-foreground/[0.14]" />
      </div>

      {/* Mini landing hero — neutral glass only */}
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 backdrop-blur-[2px]",
            accent
              ? "bg-gradient-to-br from-slate-400/[0.07] via-transparent to-sky-200/[0.06] dark:from-border/35 dark:to-border/22"
              : "bg-gradient-to-br from-slate-500/[0.055] via-transparent to-sky-100/[0.05] dark:from-border/25 dark:to-border/14",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute -left-6 top-2 size-[4.5rem] rounded-full blur-2xl",
            accent
              ? "bg-zinc-300/[0.26] dark:bg-border/28"
              : "bg-zinc-500/[0.08] dark:bg-border/18",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-5 bottom-8 size-[5rem] rounded-full blur-2xl",
            accent
              ? "bg-slate-300/[0.22] dark:bg-border/26"
              : "bg-zinc-400/[0.07] dark:bg-border/16",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-[0.12]",
            accent
              ? "via-zinc-400/28 dark:via-border/22"
              : "via-white/35 dark:via-border/18",
          )}
          aria-hidden
        />

        <div className="relative z-[1] flex flex-1 flex-col justify-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
          <div className="space-y-2 opacity-[0.52] dark:opacity-[0.14]">
            <div
              className={cn(
                "h-2.5 rounded-md sm:h-3",
                accent
                  ? "bg-zinc-400/58 shadow-[0_0_18px_rgb(63_63_70/0.11)] dark:bg-border/45 dark:shadow-[0_0_20px_rgb(0_0_0/0.2)]"
                  : "bg-zinc-500/68 shadow-[0_0_16px_rgb(63_63_70/0.12)] dark:bg-border/42 dark:shadow-[0_0_20px_rgb(0_0_0/0.2)]",
                mock.headline[0],
              )}
            />
            <div
              className={cn(
                "h-2 rounded-md sm:h-2.5",
                accent
                  ? "bg-zinc-400/45 shadow-[0_0_14px_rgb(63_63_70/0.09)] dark:bg-border/32 dark:shadow-[0_0_16px_rgb(0_0_0/0.15)]"
                  : "bg-zinc-500/55 shadow-[0_0_12px_rgb(63_63_70/0.1)] dark:bg-border/30 dark:shadow-[0_0_16px_rgb(0_0_0/0.15)]",
                mock.headline[1],
              )}
            />
          </div>

          <div className="space-y-1.5 opacity-[0.5] dark:opacity-[0.09]">
            {mock.lines.map((w, row) => (
              <div
                key={row}
                className={cn(
                  "h-1 rounded-full",
                  accent
                    ? "bg-zinc-400/55 dark:bg-border/40"
                    : "bg-zinc-500/62 dark:bg-border/36",
                  w,
                )}
              />
            ))}
          </div>

          <div className="mt-1 flex gap-2 opacity-[0.48] dark:opacity-[0.1] sm:mt-1.5 sm:gap-2.5">
            <div
              className={cn(
                "h-7 rounded-lg shadow-sm sm:h-8",
                accent
                  ? "bg-zinc-300/90 ring-1 ring-zinc-400/35 dark:bg-muted/72 dark:ring-border/45"
                  : "bg-zinc-300/95 ring-1 ring-zinc-400/45 dark:bg-muted/72 dark:ring-border/42",
                mock.ctas[0],
              )}
            />
            <div
              className={cn(
                "h-7 rounded-lg shadow-sm sm:h-8",
                accent
                  ? "bg-zinc-200/85 ring-1 ring-zinc-300/40 dark:bg-muted/62 dark:ring-border/38"
                  : "bg-zinc-200/92 ring-1 ring-zinc-400/42 dark:bg-muted/62 dark:ring-border/35",
                mock.ctas[1],
              )}
            />
          </div>

          <div className="pointer-events-none mt-auto flex items-end justify-center gap-1 pt-2 opacity-[0.45] dark:opacity-[0.12]">
            <div
              className={cn(
                "h-1 w-8 rounded-full",
                accent ? "bg-zinc-400/70 dark:bg-border/45" : "bg-zinc-500/58 dark:bg-border/40",
              )}
            />
            <div
              className={cn(
                "h-1 w-3 rounded-full",
                accent ? "bg-zinc-400/45 dark:bg-border/30" : "bg-zinc-500/45 dark:bg-border/28",
              )}
            />
            <div
              className={cn(
                "h-1 w-5 rounded-full",
                accent ? "bg-zinc-400/55 dark:bg-border/34" : "bg-zinc-500/52 dark:bg-border/32",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type HeroTilesReveal = {
  baseStep: number;
  staggerMs: number;
  duration: number;
  instant: boolean;
};

function HeroTileDraggable({
  index,
  reveal,
}: {
  index: number;
  reveal?: HeroTilesReveal;
}) {
  const reduceMotion = useReducedMotion();
  const narrowViewport = useNarrowViewport();
  const revealHeld = useHeroRevealHeld();
  const [hovered, setHovered] = useState(false);
  const stackZ = tileStackZ(index);
  const accent = index === 3 || hovered;
  const freezeReveal =
    reveal && !reveal.instant && revealHeld;

  /** Drag + `touch-none` steal vertical scroll on phones — keep transform motion, disable drag. */
  const allowDrag = reduceMotion !== true && !narrowViewport;

  return (
    <motion.div
      className={cn(
        "relative shrink-0 select-none first:ml-0",
        allowDrag
          ? "cursor-grab touch-none active:cursor-grabbing"
          : "cursor-default touch-pan-y",
        "-ml-[9.5rem] max-sm:-ml-[7.35rem] sm:-ml-[12.5rem]",
      )}
      style={{
        zIndex: stackZ,
      }}
      initial={
        reveal
          ? reveal.instant
            ? false
            : { opacity: 0, filter: "blur(12px)", y: 22 }
          : false
      }
      animate={
        reveal
          ? freezeReveal
            ? { opacity: 0, filter: "blur(12px)", y: 22 }
            : { opacity: 1, filter: "blur(0px)", y: 0 }
          : undefined
      }
      transition={
        reveal
          ? {
              delay:
                reveal.instant || freezeReveal
                  ? 0
                  : ((reveal.baseStep + index) * reveal.staggerMs) / 1000,
              duration:
                reveal.instant || freezeReveal ? 0 : reveal.duration,
              ease: "easeInOut",
            }
          : undefined
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={
        !allowDrag
          ? undefined
          : {
              y: -12,
              scale: 1.03,
              transition: { type: "spring", stiffness: 380, damping: 24 },
            }
      }
      whileTap={!allowDrag ? undefined : { scale: 0.98 }}
      whileDrag={
        !allowDrag
          ? undefined
          : {
              scale: 1.04,
              zIndex: 40,
              cursor: "grabbing",
            }
      }
      drag={allowDrag}
      dragSnapToOrigin
      dragElastic={0.16}
      dragTransition={{
        bounceStiffness: 340,
        bounceDamping: 20,
      }}
    >
      <div
        className={cn(
          "relative isolate pb-0.5",
          index === 3 && "-translate-y-2 sm:-translate-y-3",
        )}
      >
        <GlassWebTile index={index} accent={accent} />
      </div>
    </motion.div>
  );
}

export function HeroTiles({
  className,
  reveal,
}: {
  className?: string;
  reveal?: HeroTilesReveal;
}) {
  return (
    <figure
      className={cn(
        "relative m-0 overflow-x-visible overflow-y-visible",
        className,
      )}
      aria-label="Interactive glass webpage tiles"
    >
      <figcaption className="sr-only">
        Five wide neutral glass tiles in an overlapping stack. Hover, tap, or
        drag a tile; it springs back when released.
      </figcaption>
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-1/2 z-0 h-8 w-[min(100%,28rem)]",
          "-translate-x-1/2 scale-y-[0.3] rounded-[50%]",
          "bg-[var(--hero-glass-ground)] blur-xl sm:w-[min(100%,36rem)]",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "hero-tiles-root relative z-[1] flex min-w-min items-end justify-center",
          "py-8 pl-6 pr-4 max-md:py-6 max-md:pl-4 max-md:pr-3 sm:py-10 sm:pl-10 sm:pr-6",
        )}
      >
        <div className="flex min-w-min items-end">
          {Array.from({ length: HERO_TILE_COUNT }, (_, i) => (
            <HeroTileDraggable key={i} index={i} reveal={reveal} />
          ))}
        </div>
      </div>
    </figure>
  );
}
