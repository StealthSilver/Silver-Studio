import Link from "next/link";

import { HeroLogoTicker } from "@/components/ui/hero-logo-ticker";
import { HeroTiles } from "@/components/ui/hero-tiles";

export function Hero() {
  return (
    <section
      className="hero flex w-full shrink-0 flex-col justify-center"
      aria-label="Introduction"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-2 text-left lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:gap-x-10">
        <div className="flex min-w-0 flex-col items-start gap-8 sm:gap-10">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
            Built to stand out.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            We create modern websites and landing pages for startups that care
            about design, performance, and perception.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#contact"
              className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide"
            >
              BOOK A CALL
            </Link>
            <Link
              href="/#work"
              className="inline-flex h-11 items-center justify-center rounded-[4px] border border-zinc-300 bg-background px-6 text-sm font-semibold tracking-wide text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              SEE WORK
            </Link>
          </div>
        </div>
        <div className="flex w-full min-w-0 justify-center lg:w-auto lg:justify-end lg:pr-2">
          <HeroTiles className="max-w-full" />
        </div>
      </div>
      <HeroLogoTicker />
    </section>
  );
}
