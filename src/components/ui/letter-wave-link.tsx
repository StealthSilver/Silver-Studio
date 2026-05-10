"use client";

import type { HTMLAttributeAnchorTarget, MouseEventHandler } from "react";
import Link from "next/link";
import { useMemo } from "react";

import {
  shouldUseBookingModal,
  useBookingModalOptional,
} from "@/context/booking-modal-context";
import { isBookingHref } from "@/lib/booking";
import { cn } from "@/lib/utils";

/** Outline CTA: hero "SEE WORK" and matching links (LetterWaveLink). */
export const OUTLINE_CTA_BUTTON_CLASSNAME =
  "inline-flex h-11 items-center justify-center rounded-[4px] border border-border bg-background px-6 text-sm font-semibold tracking-wide text-foreground shadow-sm transition-colors hover:border-border hover:bg-accent";

/** Outline + subtle layered shadow (hero SEE WORK, Work READ MORE, Silver UI CTA). */
export const OUTLINE_CTA_HERO_SHADOW_CLASSNAME = cn(
  OUTLINE_CTA_BUTTON_CLASSNAME.replace(/\bshadow-sm\b/, ""),
  "hero-cta-3d-outline",
);

/** Wrap primary `talk-now-btn` CTAs — pairs with `.hero-cta-primary-wrap` in globals.css */
export const HERO_PRIMARY_CTA_WRAP_CLASSNAME =
  "hero-cta-primary-wrap inline-block";

/** Stagger between characters (buttons / CTAs); nav uses LETTER_WAVE_NAV_STAGGER_MS */
export const LETTER_WAVE_STAGGER_MS = 12;
/** Looser stagger for navbar section links (pairs with `--letter-wave-ms-nav`) */
export const LETTER_WAVE_NAV_STAGGER_MS = 16;

export function LetterWaveLink({
  href,
  className,
  label,
  ariaLabel,
  onClick,
  centerInContainer,
  variant = "default",
  target,
  rel,
}: {
  href: string;
  className?: string;
  label: string;
  /** Overrides default `aria-label` (the visible label) when context needs more detail */
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Full-width row with centered label (e.g. mobile menu links) */
  centerInContainer?: boolean;
  /** Navbar section links: slower easing + stagger than hero / CTA buttons */
  variant?: "default" | "nav";
  /** e.g. `_blank` for external links */
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}) {
  const chars = useMemo(() => [...label], [label]);
  const bookingModal = useBookingModalOptional();
  const opensBookingModal = isBookingHref(href);

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

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (
      bookingModal &&
      opensBookingModal &&
      shouldUseBookingModal(e)
    ) {
      e.preventDefault();
      bookingModal.openBooking();
    }
    onClick?.(e);
  };

  return (
    <Link
      href={href}
      prefetch={opensBookingModal ? false : undefined}
      target={target}
      rel={rel}
      className={cn(
        className,
        "letter-wave",
        variant === "nav" && "letter-wave--nav",
      )}
      aria-label={ariaLabel ?? label}
      onClick={handleClick}
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
