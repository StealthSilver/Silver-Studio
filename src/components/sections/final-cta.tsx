import {
  LetterWaveLink,
  OUTLINE_CTA_BUTTON_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { finalCtaSection } from "@/data/site";

export function FinalCta() {
  const { id, sectionAriaLabel, heading, description, primaryCta } = finalCtaSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-200/70 py-14 dark:border-zinc-800/80 sm:scroll-mt-32 sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div
          className={[
            "relative isolate overflow-hidden rounded-2xl border border-zinc-200/90 px-6 py-12 text-center sm:rounded-3xl sm:px-12 sm:py-16",
            "bg-gradient-to-br from-zinc-50/95 via-white/85 to-zinc-100/75 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9),0_32px_90px_-46px_rgb(24_24_27_/_0.28)] backdrop-blur-xl dark:border-white/12 dark:from-zinc-950/90 dark:via-zinc-950/65 dark:to-zinc-900/45 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_38px_100px_-40px_rgb(0_0_0_/_0.65)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute -left-24 -top-24 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(250_250_249_/_0.92),transparent_66%)] dark:bg-[radial-gradient(circle,rgb(39_39_42_/_0.35),transparent_66%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 size-[24rem] rounded-full bg-[radial-gradient(circle,rgb(228_228_231_/_0.6),transparent_65%)] dark:bg-[radial-gradient(circle,rgb(63_63_70_/_0.26),transparent_68%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgb(255_255_255_/_0.48)_50%,transparent_100%)] opacity-50 dark:bg-[linear-gradient(to_right,transparent_0%,rgb(255_255_255_/_0.04)_50%,transparent_100%)]"
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
            <div className="space-y-4">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                {heading}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <LetterWaveLink
                href={primaryCta.href}
                className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide shadow-[0_14px_32px_-20px_rgb(24_24_27_/_0.55)]"
                label={primaryCta.label}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-[11px] font-medium tracking-[0.24em] text-zinc-500 sm:text-xs dark:text-zinc-400">
              <span>FAST TIMELINES</span>
              <span
                className="hidden h-1 w-1 rounded-full bg-zinc-400/80 sm:inline-block dark:bg-zinc-600"
                aria-hidden
              />
              <span>SENIOR EXECUTION</span>
              <span
                className="hidden h-1 w-1 rounded-full bg-zinc-400/80 sm:inline-block dark:bg-zinc-600"
                aria-hidden
              />
              <span>NO AGENCY BLOAT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
