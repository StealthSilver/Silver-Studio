"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const LOGO_DARK = "/Logos/silverui-d.svg";
const LOGO_LIGHT = "/Logos/silverui-l.svg";

export const PAGE_LOADER_EXIT_DURATION_MS = 760;

type PageLoaderProps = {
  phase: "running" | "exiting";
  /** 0–100; may be fractional for smooth lerp to match the fill. */
  progress: number;
  onExitComplete: () => void;
  exitDurationMs?: number;
};

export function PageLoader({
  phase,
  progress,
  onExitComplete,
  exitDurationMs = PAGE_LOADER_EXIT_DURATION_MS,
}: PageLoaderProps) {
  const reduceMotion = useReducedMotion();
  const didReportExit = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlScrollbarGutter: html.style.scrollbarGutter,
      bodyOverflow: body.style.overflow,
    };
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "auto";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.scrollbarGutter = prev.htmlScrollbarGutter;
      body.style.overflow = prev.bodyOverflow;
    };
  }, []);

  const pctRounded = Math.min(100, Math.round(progress));
  const fillUnit = Math.min(1, Math.max(0, progress / 100));

  return (
    <motion.div
      className="fixed inset-0 z-[240] flex flex-col items-center justify-center overflow-hidden bg-background"
      role="progressbar"
      aria-label="Loading Silver Studios"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pctRounded}
      aria-valuetext={`${pctRounded} percent`}
      aria-busy={phase === "running"}
      initial={false}
      animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
      transition={{
        duration: exitDurationMs / 1000,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={() => {
        if (phase !== "exiting" || didReportExit.current) return;
        didReportExit.current = true;
        onExitComplete();
      }}
      style={{ willChange: "transform" }}
    >
      {/* Ambient depth — light */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 dark:hidden",
          "bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgb(186_204_224_/_0.45)_0%,transparent_58%)]",
          "opacity-90",
        )}
      />
      {/* Ambient depth — dark */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 hidden dark:block",
          "bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(71_85_105_/_0.35)_0%,transparent_55%)]",
          "opacity-[0.85]",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_100%,var(--muted)_0%,transparent_55%)] opacity-40 dark:opacity-25"
      />

      <div className="relative flex flex-col items-center gap-10 px-8 sm:gap-12">
        <motion.div
          className="relative size-[5.75rem] sm:size-[6.75rem] md:size-[7.5rem]"
          initial={false}
          animate={
            phase === "running" && reduceMotion !== true
              ? { scale: [1, 1.04, 1], opacity: [0.92, 1, 0.92] }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: 2.8,
            repeat: phase === "running" && reduceMotion !== true ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <Image
            src={LOGO_LIGHT}
            alt=""
            width={216}
            height={216}
            priority
            className="size-full object-contain dark:hidden"
          />
          <Image
            src={LOGO_DARK}
            alt=""
            width={216}
            height={216}
            priority
            className="hidden size-full object-contain dark:block"
          />
        </motion.div>

        <div className="flex w-[min(18.5rem,82vw)] flex-col gap-4">
          <div
            className={cn(
              "relative h-[5px] w-full overflow-hidden rounded-full",
              "bg-muted/55 shadow-inner ring-1 ring-border/55",
              "dark:bg-muted/35 dark:ring-border/40",
            )}
            aria-hidden
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 w-full origin-left rounded-full",
                "bg-gradient-to-r from-primary via-primary to-primary/80",
                "shadow-[0_0_20px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                "dark:from-white dark:via-white dark:to-white/75",
                "dark:shadow-[0_0_22px_rgb(255_255_255_/_0.16)]",
              )}
              style={{ transform: `scaleX(${fillUnit})` }}
            />
          </div>
          <p className="text-center text-[0.7rem] font-semibold tabular-nums tracking-[0.32em] text-muted-foreground uppercase sm:text-xs">
            <span className="text-foreground">{pctRounded}</span>
            <span className="opacity-70">%</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
