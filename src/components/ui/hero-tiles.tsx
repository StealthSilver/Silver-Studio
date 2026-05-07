"use client";

import { motion, useReducedMotion } from "motion/react";

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
        "relative flex w-[13rem] flex-col overflow-hidden rounded-2xl sm:w-[16.5rem]",
        accent
          ? "h-[17rem] sm:h-[19.5rem]"
          : "h-[16rem] sm:h-[18.5rem]",
        "backdrop-blur-xl",
        "border shadow-md transition-[box-shadow,border-color] duration-300",
        accent
          ? cn(
              "border-zinc-300/85",
              "shadow-[0_10px_36px_-12px_rgb(63_63_70/0.16),0_4px_14px_-6px_rgb(100_116_139/0.12),inset_0_1px_0_rgb(255_255_255/0.75)]",
              "bg-gradient-to-b from-white/80 via-zinc-50/45 to-zinc-200/28",
              "dark:border-zinc-400/42 dark:shadow-[0_8px_30px_-8px_rgb(186_198_215/0.14)]",
              "dark:from-zinc-700/[0.48] dark:via-zinc-800/[0.26] dark:to-zinc-950/[0.52]",
            )
          : cn(
              "border-zinc-200/75",
              "shadow-[0_4px_28px_-10px_rgb(39_39_42/0.08),0_2px_8px_-4px_rgb(82_82_91/0.05)]",
              "bg-gradient-to-b from-white/58 via-white/32 to-zinc-100/[0.14]",
              "dark:border-zinc-600/35",
              "dark:from-zinc-800/[0.45] dark:via-zinc-900/[0.32] dark:to-zinc-950/[0.55]",
              "dark:shadow-[0_4px_28px_-6px_rgb(0_0_0/0.5)]",
            ),
      )}
    >
      {/* Browser chrome */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-zinc-200/60 px-2.5 py-2 sm:px-3 sm:py-2.5 dark:border-zinc-700/45",
          "bg-white/48 dark:bg-zinc-900/[0.55]",
        )}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="size-2 rounded-full bg-zinc-600/20 dark:bg-zinc-300/22"
              aria-hidden
            />
          ))}
        </div>
        <div className="ms-0.5 h-2 flex-1 rounded-full bg-zinc-600/12 dark:bg-zinc-300/14" />
      </div>

      {/* Mini landing hero — neutral glass only */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 backdrop-blur-[2px]",
            accent
              ? "bg-gradient-to-br from-zinc-400/[0.09] via-transparent to-slate-400/[0.06] dark:from-zinc-400/[0.1] dark:to-slate-500/[0.07]"
              : "bg-gradient-to-br from-zinc-500/[0.07] via-transparent to-zinc-400/[0.05] dark:from-zinc-400/[0.05] dark:to-zinc-500/[0.04]",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute -left-6 top-2 size-[4.5rem] rounded-full blur-2xl",
            accent
              ? "bg-zinc-300/[0.26] dark:bg-zinc-300/[0.1]"
              : "bg-zinc-500/[0.08] dark:bg-zinc-400/[0.06]",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-5 bottom-8 size-[5rem] rounded-full blur-2xl",
            accent
              ? "bg-slate-300/[0.22] dark:bg-slate-400/[0.09]"
              : "bg-zinc-400/[0.07] dark:bg-zinc-500/[0.06]",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-[0.12]",
            accent
              ? "via-zinc-400/28 dark:via-zinc-400/12"
              : "via-white/35 dark:via-zinc-400/12",
          )}
          aria-hidden
        />

        <div className="relative z-[1] flex flex-1 flex-col justify-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
          <div className="space-y-2 opacity-[0.52] dark:opacity-[0.14]">
            <div
              className={cn(
                "h-2.5 rounded-md sm:h-3",
                accent
                  ? "bg-zinc-400/58 shadow-[0_0_18px_rgb(63_63_70/0.11)] dark:bg-zinc-500/35 dark:shadow-[0_0_20px_rgb(0_0_0/0.2)]"
                  : "bg-zinc-500/68 shadow-[0_0_16px_rgb(63_63_70/0.12)] dark:bg-zinc-500/35 dark:shadow-[0_0_20px_rgb(0_0_0/0.2)]",
                mock.headline[0],
              )}
            />
            <div
              className={cn(
                "h-2 rounded-md sm:h-2.5",
                accent
                  ? "bg-zinc-400/45 shadow-[0_0_14px_rgb(63_63_70/0.09)] dark:bg-zinc-500/28 dark:shadow-[0_0_16px_rgb(0_0_0/0.15)]"
                  : "bg-zinc-500/55 shadow-[0_0_12px_rgb(63_63_70/0.1)] dark:bg-zinc-500/28 dark:shadow-[0_0_16px_rgb(0_0_0/0.15)]",
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
                    ? "bg-zinc-400/55 dark:bg-zinc-500/38"
                    : "bg-zinc-500/62 dark:bg-zinc-500/38",
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
                  ? "bg-zinc-300/90 ring-1 ring-zinc-400/35 dark:bg-zinc-600/42 dark:ring-zinc-500/30"
                  : "bg-zinc-300/95 ring-1 ring-zinc-400/45 dark:bg-zinc-600/42 dark:ring-zinc-500/30",
                mock.ctas[0],
              )}
            />
            <div
              className={cn(
                "h-7 rounded-lg shadow-sm sm:h-8",
                accent
                  ? "bg-zinc-200/85 ring-1 ring-zinc-300/40 dark:bg-zinc-700/38 dark:ring-zinc-600/28"
                  : "bg-zinc-200/92 ring-1 ring-zinc-400/42 dark:bg-zinc-700/38 dark:ring-zinc-600/28",
                mock.ctas[1],
              )}
            />
          </div>

          <div className="pointer-events-none mt-auto flex items-end justify-center gap-1 pt-2 opacity-[0.45] dark:opacity-[0.12]">
            <div
              className={cn(
                "h-1 w-8 rounded-full",
                accent ? "bg-zinc-400/70 dark:bg-zinc-500/40" : "bg-zinc-500/58 dark:bg-zinc-500/40",
              )}
            />
            <div
              className={cn(
                "h-1 w-3 rounded-full",
                accent ? "bg-zinc-400/45 dark:bg-zinc-500/28" : "bg-zinc-500/45 dark:bg-zinc-500/28",
              )}
            />
            <div
              className={cn(
                "h-1 w-5 rounded-full",
                accent ? "bg-zinc-400/55 dark:bg-zinc-500/32" : "bg-zinc-500/52 dark:bg-zinc-500/32",
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

export function HeroTiles({
  className,
  reveal,
}: {
  className?: string;
  reveal?: HeroTilesReveal;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <figure
      className={cn("relative m-0 overflow-x-auto overflow-y-visible", className)}
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
          "py-8 pl-6 pr-4 sm:py-10 sm:pl-10 sm:pr-6",
        )}
      >
        <div className="flex min-w-min items-end">
          {Array.from({ length: HERO_TILE_COUNT }, (_, i) => {
            const stackZ = tileStackZ(i);

            return (
              <motion.div
                key={i}
                className={cn(
                  "relative shrink-0 cursor-grab first:ml-0 active:cursor-grabbing",
                  "-ml-[9.5rem] sm:-ml-[12.5rem]",
                )}
                style={{
                  zIndex: stackZ,
                }}
                initial={
                  reveal
                    ? reveal.instant
                      ? false
                      : { opacity: 0 }
                    : false
                }
                animate={reveal ? { opacity: 1 } : undefined}
                transition={
                  reveal
                    ? {
                        opacity: {
                          delay: reveal.instant
                            ? 0
                            : ((reveal.baseStep + i) * reveal.staggerMs) / 1000,
                          duration: reveal.instant ? 0 : reveal.duration,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      }
                    : undefined
                }
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -12,
                        scale: 1.03,
                        transition: { type: "spring", stiffness: 380, damping: 24 },
                      }
                }
                whileTap={
                  reduceMotion ? { scale: 0.99 } : { scale: 0.98 }
                }
                whileDrag={
                  reduceMotion
                    ? undefined
                    : {
                        scale: 1.04,
                        zIndex: 40,
                        cursor: "grabbing",
                      }
                }
                drag={reduceMotion ? false : true}
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
                    i === 3 && "-translate-y-2 sm:-translate-y-3",
                  )}
                >
                  <GlassWebTile index={i} accent={i === 3} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
