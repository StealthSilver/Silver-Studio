import { Check } from "lucide-react";

import {
  LetterWaveLink,
  OUTLINE_CTA_BUTTON_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { pricingSection } from "@/data/site";
import { cn } from "@/lib/utils";

const listCheckClass = "mt-1 size-4 shrink-0 text-zinc-500 dark:text-zinc-400";

export function Pricing() {
  const { id, sectionAriaLabel, heading, intro, tiers } = pricingSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-200/70 pt-16 dark:border-zinc-800/80 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
            {heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
            {intro}
          </p>
        </div>

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6">
          {tiers.map((tier) => {
            const emphasized = tier.highlighted === true;
            return (
              <li key={tier.name} className="min-w-0 flex">
                <article
                  className={[
                    "flex w-full flex-col rounded-2xl border bg-white/45 px-5 py-7 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] backdrop-blur-md sm:px-6 sm:py-8",
                    "dark:bg-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]",
                    emphasized
                      ? "border-zinc-900/95 ring-1 ring-zinc-900/10 dark:border-zinc-100/55 dark:ring-white/10"
                      : "border-zinc-200/90 dark:border-white/12",
                  ].join(" ")}
                >
                  {emphasized ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                      Most common
                    </p>
                  ) : (
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-transparent">
                      &nbsp;
                    </span>
                  )}
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {tier.description}
                  </p>
                  <p className="mt-6 text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {tier.priceHint}
                  </p>

                  <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-zinc-200/80 pt-6 dark:border-white/10">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        <Check className={listCheckClass} strokeWidth={2} aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <LetterWaveLink
                      href={tier.cta.href}
                      className={cn(
                        OUTLINE_CTA_BUTTON_CLASSNAME,
                        "h-10 w-full",
                      )}
                      label={tier.cta.label}
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
