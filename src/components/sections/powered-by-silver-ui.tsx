import { Check, Sparkles } from "lucide-react";

import { poweredBySilverUiSection } from "@/data/site";

const bulletIconClass =
  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200/90 bg-zinc-50/80 text-zinc-600 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.65)] dark:border-white/12 dark:bg-zinc-900/45 dark:text-zinc-300 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]";

export function PoweredBySilverUi() {
  const { id, sectionAriaLabel, eyebrow, heading, intro, highlights } =
    poweredBySilverUiSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-200/70 pt-16 dark:border-zinc-800/80 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <article
          className={[
            "relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-white/65 via-white/35 to-zinc-50/40 px-6 py-8 shadow-[0_1px_0_rgb(255_255_255_/_0.7)_inset,0_20px_50px_-24px_rgb(24_24_27_/_0.12)] backdrop-blur-xl sm:px-10 sm:py-10 sm:rounded-3xl",
            "dark:border-white/12 dark:from-zinc-950/60 dark:via-zinc-950/35 dark:to-zinc-950/20 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_24px_60px_-20px_rgb(0_0_0_/_0.45)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-24 size-[18rem] rounded-full bg-[radial-gradient(circle,rgb(244_244_245_/_0.45),transparent_65%)] dark:bg-[radial-gradient(circle,rgb(63_63_70_/_0.25),transparent_65%)]"
            aria-hidden
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                {eyebrow}
              </p>
              <h2 className="mt-4 text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                {heading}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
                {intro}
              </p>
            </div>

            <ul className="min-w-0 flex-1 list-none space-y-4 p-0">
              {highlights.map((line) => (
                <li
                  key={line}
                  className="flex gap-4 rounded-xl border border-zinc-200/70 bg-white/55 px-4 py-3.5 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/40"
                >
                  <div className={bulletIconClass}>
                    <Check className="size-4" strokeWidth={2} aria-hidden />
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-700 sm:text-[15px] dark:text-zinc-300">
                    {line}
                  </p>
                </li>
              ))}
            </ul>

            <div
              className="pointer-events-none absolute bottom-6 right-6 hidden opacity-[0.12] lg:block dark:opacity-[0.18]"
              aria-hidden
            >
              <Sparkles className="size-28 text-zinc-900 dark:text-zinc-100" strokeWidth={1} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
