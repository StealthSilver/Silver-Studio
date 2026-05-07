"use client";

import Link from "next/link";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

/** Stagger between characters (buttons / CTAs); nav uses LETTER_WAVE_NAV_STAGGER_MS */
export const LETTER_WAVE_STAGGER_MS = 12;
/** Looser stagger for navbar section links (pairs with `--letter-wave-ms-nav`) */
export const LETTER_WAVE_NAV_STAGGER_MS = 16;

export function LetterWaveLink({
  href,
  className,
  label,
  onClick,
  centerInContainer,
  variant = "default",
}: {
  href: string;
  className?: string;
  label: string;
  onClick?: () => void;
  /** Full-width row with centered label (e.g. mobile menu links) */
  centerInContainer?: boolean;
  /** Navbar section links: slower easing + stagger than hero / CTA buttons */
  variant?: "default" | "nav";
}) {
  const chars = useMemo(() => [...label], [label]);

  const staggerMs =
    variant === "nav" ? LETTER_WAVE_NAV_STAGGER_MS : LETTER_WAVE_STAGGER_MS;

  const body = (
    <span className="relative inline-grid place-items-center">
      <span className="invisible col-start-1 row-start-1 select-none">{label}</span>
      <span className="letter-wave__track col-start-1 row-start-1 whitespace-pre">
        {chars.map((ch, i) => (
          <span
            key={`${label}-${i}-${ch}`}
            className="letter-wave__char"
            style={{ animationDelay: `${i * staggerMs}ms` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );

  return (
    <Link
      href={href}
      className={cn(
        className,
        "letter-wave",
        variant === "nav" && "letter-wave--nav",
      )}
      aria-label={label}
      onClick={onClick}
    >
      <span
        aria-hidden
        className={cn(
          "relative z-10",
          centerInContainer && "flex w-full justify-center",
        )}
      >
        {body}
      </span>
    </Link>
  );
}
