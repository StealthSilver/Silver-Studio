"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { motion, type UseInViewOptions } from "motion/react";

import { useHeroRevealHeld } from "@/context/hero-reveal-held-context";
import { useSplashGateActive } from "@/context/splash-interactive-context";
import { cn } from "@/lib/utils";

/**
 * Matches testimonial quote timing: `transition.delay = 0.02 * wordIndex` (seconds).
 */
export const HERO_REVEAL_STAGGER_MS = 20;
/** Matches testimonial quote word `duration`. */
export const HERO_REVEAL_DURATION_S = 0.2;

const DEFAULT_SECTION_VIEWPORT: UseInViewOptions = {
  once: true,
  amount: "some",
};

export function splitHeroWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** Word-by-word blur resolve — same values as testimonials quote copy. */
export function BlurRevealWordsInline({
  text,
  staggerMs = HERO_REVEAL_STAGGER_MS,
  startDelayMs = 0,
  reduced,
  className,
  holdUntilSplashDismissed = false,
}: {
  text: string;
  staggerMs?: number;
  startDelayMs?: number;
  reduced: boolean;
  className?: string;
  /** Navbar: freeze until `/` splash completes; hero omits — uses {@link HeroRevealHeldProvider}. */
  holdUntilSplashDismissed?: boolean;
}) {
  const heroHeld = useHeroRevealHeld();
  const splashHeld = holdUntilSplashDismissed && useSplashGateActive();
  const words = useMemo(() => splitHeroWords(text), [text]);
  const frozen = !reduced && (heroHeld || splashHeld);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <>
      {words.map((word, wordIndex) => (
        <motion.span
          key={`${text}-w-${wordIndex}-${word}`}
          initial={{
            filter: "blur(10px)",
            opacity: 0,
            y: 5,
          }}
          animate={
            frozen
              ? { filter: "blur(10px)", opacity: 0, y: 5 }
              : { filter: "blur(0px)", opacity: 1, y: 0 }
          }
          transition={{
            duration: frozen ? 0 : HERO_REVEAL_DURATION_S,
            ease: "easeInOut",
            delay: frozen
              ? 0
              : (startDelayMs + wordIndex * staggerMs) / 1000,
          }}
          className={cn("inline-block", className)}
        >
          {word}
          {wordIndex < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </>
  );
}

/** Single layout chunk (logo lockup, button, etc.) — same blur resolve as testimonial copy. */
export function BlurRevealBlock({
  delaySec,
  instant,
  className,
  children,
  y = 6,
  blurPx = 10,
  holdUntilSplashDismissed = false,
}: {
  delaySec: number;
  instant: boolean;
  className?: string;
  children: ReactNode;
  y?: number;
  blurPx?: number;
  holdUntilSplashDismissed?: boolean;
}) {
  const heroHeld = useHeroRevealHeld();
  const splashHeld = holdUntilSplashDismissed && useSplashGateActive();
  const frozen = !instant && (heroHeld || splashHeld);

  return (
    <motion.span
      className={className}
      initial={
        instant ? false : { opacity: 0, filter: `blur(${blurPx}px)`, y }
      }
      animate={
        instant
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : frozen
            ? { opacity: 0, filter: `blur(${blurPx}px)`, y }
            : { opacity: 1, filter: "blur(0px)", y: 0 }
      }
      transition={{
        duration: instant || frozen ? 0 : HERO_REVEAL_DURATION_S,
        delay: instant || frozen ? 0 : delaySec,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}

const wordRevealItemVariants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
    y: 5,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: { duration: HERO_REVEAL_DURATION_S, ease: "easeInOut" as const },
  },
};

/**
 * Testimonial-style word blur stagger, triggered once when the container scrolls into view.
 * Sections below the fold use this instead of mount-time `animate={true}` resolves.
 */
export function BlurRevealWordsInView({
  text,
  reduced,
  staggerMs = HERO_REVEAL_STAGGER_MS,
  startDelayMs = 0,
  className,
  viewport = DEFAULT_SECTION_VIEWPORT,
}: {
  text: string;
  reduced: boolean;
  staggerMs?: number;
  startDelayMs?: number;
  className?: string;
  viewport?: Omit<UseInViewOptions, "root">;
}) {
  const words = useMemo(() => splitHeroWords(text), [text]);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const staggerChildren = staggerMs / 1000;
  const delayChildren = startDelayMs / 1000;

  return (
    <motion.span
      className="inline"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren, delayChildren },
        },
      }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={`${text}-wv-${wordIndex}-${word}`}
          variants={wordRevealItemVariants}
          className={cn("inline-block", className)}
        >
          {word}
          {wordIndex < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** Single blur resolve when scrolled into view (numbers, badges, chips). */
export function BlurRevealBlockInView({
  reduced,
  delaySec,
  className,
  children,
  y = 6,
  blurPx = 10,
  viewport = DEFAULT_SECTION_VIEWPORT,
}: {
  reduced: boolean;
  delaySec: number;
  className?: string;
  children: ReactNode;
  y?: number;
  blurPx?: number;
  viewport?: Omit<UseInViewOptions, "root">;
}) {
  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, filter: `blur(${blurPx}px)`, y }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={viewport}
      transition={{
        duration: HERO_REVEAL_DURATION_S,
        delay: delaySec,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Runs the word stagger when `active` turns true — for accordions / tab copy that isn’t viewport-driven.
 */
export function BlurRevealWordsWhen({
  text,
  reduced,
  active,
  staggerMs = HERO_REVEAL_STAGGER_MS,
  startDelayMs = 0,
  className,
}: {
  text: string;
  reduced: boolean;
  active: boolean;
  staggerMs?: number;
  startDelayMs?: number;
  className?: string;
}) {
  const words = useMemo(() => splitHeroWords(text), [text]);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const state = active ? "visible" : "hidden";
  const staggerChildren = staggerMs / 1000;
  const delayChildren = active ? startDelayMs / 1000 : 0;

  return (
    <motion.span
      className="inline"
      initial="hidden"
      animate={state}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren, delayChildren },
        },
      }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={`${text}-wa-${active}-${wordIndex}-${word}`}
          variants={wordRevealItemVariants}
          className={cn("inline-block", className)}
        >
          {word}
          {wordIndex < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
