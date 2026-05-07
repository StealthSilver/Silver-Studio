"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export const HERO_REVEAL_STAGGER_MS = 52;
export const HERO_REVEAL_DURATION_S = 0.42;
export const HERO_REVEAL_EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function splitHeroWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function FadeRevealSpan({
  stepIndex,
  staggerMs = HERO_REVEAL_STAGGER_MS,
  duration = HERO_REVEAL_DURATION_S,
  instant,
  className,
  children,
}: {
  stepIndex: number;
  staggerMs?: number;
  duration?: number;
  instant: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.span
      className={cn("inline-block", className)}
      initial={instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: instant ? 0 : duration,
        delay: instant ? 0 : (stepIndex * staggerMs) / 1000,
        ease: [...HERO_REVEAL_EASE],
      }}
    >
      {children}
    </motion.span>
  );
}
