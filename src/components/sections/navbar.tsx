"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore, useState } from "react";

import { navbar as navbarData, site } from "@/data/site";
import { cn } from "@/lib/utils";

const { links, cta } = navbarData;

const talkNowButtonClass = "talk-now-btn rounded-[4px]";

const navLinkClass =
  "group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-[4px] px-3 text-sm font-medium leading-none text-zinc-600 transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-[4px] before:bg-zinc-100 before:transition-[transform] before:duration-300 before:ease-out before:content-[''] hover:text-zinc-900 hover:before:scale-x-100 motion-reduce:before:duration-0 dark:text-zinc-400 dark:before:bg-zinc-800 dark:hover:text-zinc-50";

const navLinkMobileClass =
  "group relative block overflow-hidden rounded-[4px] px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-[4px] before:bg-zinc-100 before:transition-[transform] before:duration-300 before:ease-out before:content-[''] hover:text-zinc-900 hover:before:scale-x-100 motion-reduce:before:duration-0 dark:text-zinc-300 dark:before:bg-zinc-800 dark:hover:text-zinc-50";

const SCROLL_THRESHOLD_PX = 8;

function subscribeScroll(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify, { passive: true });
  return () => {
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
}

/** Snapshot "scrolledFlag|percent" for stable Object.is comparison */
function getScrollSnapshot(): string {
  const el = document.documentElement;
  const y = window.scrollY;
  const maxScroll = Math.max(0, el.scrollHeight - window.innerHeight);
  const pct =
    maxScroll === 0 ? 0 : Math.min(100, Math.round((y / maxScroll) * 100));
  const scrolled = y > SCROLL_THRESHOLD_PX ? 1 : 0;
  return `${scrolled}|${pct}`;
}

function serverScrollSnapshot() {
  return "0|0";
}

const scrollGaugeClass =
  "inline-flex h-9 min-w-[3.25rem] shrink-0 items-center justify-center rounded-[4px] border border-zinc-200/90 bg-zinc-50 px-2 text-xs font-semibold tabular-nums text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrollSnap = useSyncExternalStore(
    subscribeScroll,
    getScrollSnapshot,
    serverScrollSnapshot,
  );

  const { scrolled, scrollPercent } = useMemo(() => {
    const [s, p] = scrollSnap.split("|");
    return {
      scrolled: s === "1",
      scrollPercent: Number(p) || 0,
    };
  }, [scrollSnap]);

  useEffect(() => {
    if (!scrolled) setOpen(false);
  }, [scrolled]);

  const desktopLinks = (
    <ul className="hidden h-9 items-center gap-1 md:flex">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className={navLinkClass}>
            <span className="relative z-10">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const menuButton = (
    <button
      type="button"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-expanded={open}
      aria-controls="mobile-nav"
      onClick={() => setOpen((v) => !v)}
    >
      <span className="sr-only">Toggle menu</span>
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        {open ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );

  const scrollPercentButton = (
    <span
      role="status"
      aria-live="polite"
      aria-label={`Page scrolled ${scrollPercent} percent`}
      className={scrollGaugeClass}
    >
      {scrollPercent}%
    </span>
  );

  const menuLinksBody = () => (
    <>
      <ul className="flex flex-col gap-0 px-1 py-1 text-center">
        {links.map(({ href, label }) => (
          <li
            key={href}
            className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
          >
            <Link
              href={href}
              className={cn(
                navLinkMobileClass,
                "rounded-none text-center before:rounded-none hover:before:rounded-none",
              )}
              onClick={() => setOpen(false)}
            >
              <span className="relative z-10">{label}</span>
            </Link>
          </li>
        ))}
        <li
          className={cn(
            "border-t border-zinc-200 px-1 pt-1 dark:border-zinc-700",
            scrolled && "md:hidden",
          )}
        >
          <Link
            href={cta.href}
            className={`${talkNowButtonClass} block w-full rounded-[4px] py-2.5 text-center`}
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </Link>
        </li>
      </ul>
    </>
  );

  const menuToolbar = (
    <div className="flex items-center gap-2">
      {menuButton}
      {scrollPercentButton}
    </div>
  );

  /** Fixed, viewport-centered panel just below the navbar (mobile + desktop when scrolled) */
  const overlayMenuPanel = (
    <div
      id="mobile-nav"
      role="region"
      aria-label="Navigation menu"
      className={cn(
        "fixed left-1/2 z-[60] w-[min(200px,calc(100vw-2rem))] max-w-[200px] -translate-x-1/2 border border-zinc-300 bg-white shadow-md dark:border-zinc-600 dark:bg-zinc-950",
        "rounded-[4px]",
        "top-[calc(var(--site-header-height)+0.5rem+0.375rem)]",
        open ? "block" : "hidden",
        !scrolled && "md:hidden",
      )}
    >
      {menuLinksBody()}
    </div>
  );

  return (
    <header className="sticky top-2 z-50 mt-1 w-full px-2">
      <div
        className={cn(
          "mx-auto rounded-[4px] bg-transparent text-zinc-900 transition-[max-width,box-shadow] duration-300 ease-out motion-reduce:transition-none dark:text-zinc-50",
          scrolled
            ? "max-w-full overflow-visible shadow-none ring-0 dark:shadow-none"
            : "max-w-6xl max-md:overflow-visible md:overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(15,23,42,0.04),0_2px_8px_rgba(15,23,42,0.05),0_6px_16px_rgba(15,23,42,0.05),0_12px_24px_rgba(15,23,42,0.04)] ring-1 ring-zinc-200/70 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.25),0_6px_16px_rgba(0,0,0,0.2),0_12px_24px_rgba(0,0,0,0.15)] dark:ring-zinc-800/80",
        )}
      >
        <nav
          className={cn(
            "relative flex min-h-[3.25rem] items-center gap-3 px-2 py-2 sm:min-h-14",
            scrolled
              ? "justify-between md:grid md:w-full md:grid-cols-[1fr_auto_1fr] md:items-center"
              : "justify-between",
          )}
        >
          <Link
            href={site.homeHref}
            className={cn(
              "flex shrink-0 items-center gap-1 transition-opacity hover:opacity-80",
              scrolled && "md:justify-self-start",
            )}
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{site.homeSrLabel}</span>
            <Image
              src={site.logo.lightSrc}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              className="size-8 dark:hidden"
              priority
            />
            <Image
              src={site.logo.darkSrc}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              className="hidden size-8 dark:block"
            />
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl [font-family:var(--font-ibm-plex-sans)]">
              {site.name}
            </span>
          </Link>

          {scrolled ? (
            <>
              <div className="flex flex-1 justify-center md:flex-none md:justify-self-center">
                {menuToolbar}
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center md:justify-self-end",
                  scrolled && "min-w-0 md:min-w-[1px]",
                )}
              >
                <Link
                  href={cta.href}
                  className={`${talkNowButtonClass} hidden h-9 !leading-none items-center justify-center px-4 md:inline-flex`}
                >
                  {cta.label}
                </Link>
              </div>
            </>
          ) : (
            <div className="flex h-9 shrink-0 items-center gap-2 md:gap-3">
              {desktopLinks}
              <Link
                href={cta.href}
                className={`${talkNowButtonClass} hidden h-9 !leading-none items-center justify-center px-4 md:inline-flex`}
              >
                {cta.label}
              </Link>
              <div className="md:hidden">{menuToolbar}</div>
            </div>
          )}
        </nav>

        {overlayMenuPanel}
      </div>
    </header>
  );
}
