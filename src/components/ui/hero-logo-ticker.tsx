"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { BlurRevealWordsInline } from "@/components/ui/hero-reveal";
import { HeroTickerLogoMark } from "@/components/ui/hero-ticker-logo-mark";
import { useHeroRevealHeld } from "@/context/hero-reveal-held-context";
import { heroLogoTicker } from "@/data/site";
import { cn } from "@/lib/utils";

type HeroLogoTickerReveal = {
  headingWordStart: number;
  logoStart: number;
  staggerMs: number;
  duration: number;
  instant: boolean;
};

type HeroLogoTickerProps = {
  className?: string;
  reveal?: HeroLogoTickerReveal;
};

const tickerItemClass =
  "flex min-h-[2rem] items-center justify-center px-4";

const linkClass =
  "inline-flex items-center justify-center rounded-sm outline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

function TickerExternalLink({
  href,
  ariaLabel,
  className,
  children,
}: {
  href: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      aria-label={`${ariaLabel} (opens in new tab)`}
      className={cn(linkClass, className)}
    >
      {children}
    </Link>
  );
}

/**
 * Logo strip below the hero (ticker layout). Optional staggered fade-in via `reveal`.
 */
export function HeroLogoTicker({ className, reveal }: HeroLogoTickerProps) {
  const { heading, labelId, items } = heroLogoTicker;
  const revealHeld = useHeroRevealHeld();
  const freezeLogoReveal = reveal !== undefined && !reveal.instant && revealHeld;

  const headingContent =
    reveal !== undefined ? (
      <BlurRevealWordsInline
        text={heading}
        reduced={reveal.instant}
        staggerMs={reveal.staggerMs}
        startDelayMs={reveal.headingWordStart * reveal.staggerMs}
      />
    ) : (
      heading
    );

  return (
    <div className={cn("mt-36 w-full sm:mt-36 lg:mt-44", className)}>
      <p
        id={labelId}
        className="mb-8 px-4 text-center text-sm font-medium leading-snug tracking-wide text-muted-foreground sm:mb-9 sm:text-base"
      >
        {headingContent}
      </p>
      <ul
        className="m-0 flex list-none flex-wrap items-center justify-center gap-x-16 gap-y-12 px-2 sm:gap-x-24 sm:gap-y-14"
        aria-labelledby={labelId}
      >
        {items.map((item, index) => {
          const inner = (
            <TickerExternalLink href={item.href} ariaLabel={item.ariaLabel}>
              <HeroTickerLogoMark item={item} presentation="ticker" />
            </TickerExternalLink>
          );

          if (reveal === undefined) {
            return (
              <li key={`${item.type}-${item.href}`} className={tickerItemClass}>
                {inner}
              </li>
            );
          }

          return (
            <motion.li
              key={`${item.type}-${item.href}`}
              className={tickerItemClass}
              initial={
                reveal.instant
                  ? false
                  : { opacity: 0, filter: "blur(12px)", y: 14 }
              }
              animate={
                freezeLogoReveal
                  ? { opacity: 0, filter: "blur(12px)", y: 14 }
                  : { opacity: 1, filter: "blur(0px)", y: 0 }
              }
              transition={{
                duration: reveal.instant || freezeLogoReveal ? 0 : reveal.duration,
                delay:
                  reveal.instant || freezeLogoReveal
                    ? 0
                    : ((reveal.logoStart + index) * reveal.staggerMs) / 1000,
                ease: "easeInOut",
              }}
            >
              {inner}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
