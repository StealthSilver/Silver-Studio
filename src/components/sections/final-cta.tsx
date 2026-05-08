import {
  LetterWaveLink,
  OUTLINE_CTA_BUTTON_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { finalCtaSection } from "@/data/site";

export function FinalCta() {
  const { id, sectionAriaLabel, heading, description, primaryCta, secondaryCta } =
    finalCtaSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-200/70 pt-16 pb-4 dark:border-zinc-800/80 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div
          className={[
            "relative overflow-hidden rounded-2xl border border-zinc-200/90 px-6 py-12 text-center sm:rounded-3xl sm:px-12 sm:py-16",
            "bg-gradient-to-br from-zinc-50/90 via-white/80 to-white/55 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.85),0_22px_50px_-24px_rgb(24_24_27_/_0.14)] backdrop-blur-xl dark:border-white/12 dark:from-zinc-950/80 dark:via-zinc-950/50 dark:to-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_28px_60px_-20px_rgb(0_0_0_/_0.5)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute -left-16 top-0 size-[22rem] rounded-full bg-[radial-gradient(circle,rgb(250_250_249_/_0.9),transparent_68%)] dark:bg-[radial-gradient(circle,rgb(39_39_42_/_0.35),transparent_68%)]"
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                {heading}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <LetterWaveLink
                href={primaryCta.href}
                className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide"
                label={primaryCta.label}
              />
              <LetterWaveLink
                href={secondaryCta.href}
                className={OUTLINE_CTA_BUTTON_CLASSNAME}
                label={secondaryCta.label}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
