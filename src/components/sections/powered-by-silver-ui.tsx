import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { OUTLINE_CTA_BUTTON_CLASSNAME } from "@/components/ui/letter-wave-link";
import { poweredBySilverUiSection } from "@/data/site";
import { cn } from "@/lib/utils";

const bulletIconClass =
  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/90 bg-secondary/85 text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255_/_0.68)] dark:border-border/55 dark:bg-muted/50 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]";

export function PoweredBySilverUi() {
  const {
    id,
    sectionAriaLabel,
    eyebrow,
    heading,
    intro,
    highlights,
    externalHref,
    externalCtaLabel,
    externalCtaAriaLabel,
  } = poweredBySilverUiSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-border/70 py-14 sm:scroll-mt-32 sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <article
          className={[
            "relative isolate overflow-hidden rounded-2xl border border-border/90 px-6 py-10 text-left shadow-[inset_0_1px_0_rgb(255_255_255_/_0.92),0_26px_80px_-48px_rgb(15_23_42_/_0.14)] backdrop-blur-xl sm:rounded-3xl sm:px-10 sm:py-12",
            "bg-gradient-to-br from-secondary/95 via-card/88 to-secondary/78 dark:border-border/55 dark:from-background/96 dark:via-secondary/92 dark:to-card/88 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_32px_90px_-44px_rgb(0_0_0_/_0.55)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute -left-20 -top-24 size-[22rem] rounded-full bg-[radial-gradient(circle,rgb(247_249_251_/_0.9),transparent_66%)] dark:bg-[radial-gradient(circle,rgb(37_48_56_/_0.42),transparent_66%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 -right-16 size-[20rem] rounded-full bg-[radial-gradient(circle,rgb(238_242_245_/_0.72),transparent_65%)] dark:bg-[radial-gradient(circle,rgb(21_38_45_/_0.35),transparent_68%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgb(255_255_255_/_0.35)_50%,transparent_100%)] opacity-40 dark:bg-[linear-gradient(to_right,transparent_0%,rgb(255_255_255_/_0.04)_50%,transparent_100%)] dark:opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-6 top-8 grid grid-cols-2 gap-1.5 opacity-[0.07] dark:opacity-[0.12] sm:left-10"
            aria-hidden
          >
            <span className="size-2 rounded-sm bg-foreground" />
            <span className="size-2 rounded-sm bg-foreground" />
            <span className="size-2 rounded-sm bg-foreground" />
            <span className="size-2 rounded-sm bg-foreground" />
          </div>

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            <div className="min-w-0 flex-1 border-l-2 border-border/45 pl-5 dark:border-border/35 sm:pl-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {heading}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {intro}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={externalCtaAriaLabel}
                  className={cn(
                    OUTLINE_CTA_BUTTON_CLASSNAME,
                    "group/sui inline-flex h-11 items-center gap-2 pr-5 no-underline",
                  )}
                >
                  <span>{externalCtaLabel}</span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover/sui:-translate-y-0.5 group-hover/sui:translate-x-0.5 group-hover/sui:text-foreground"
                    strokeWidth={2}
                    aria-hidden
                  />
                </Link>
                <p
                  className="text-[11px] font-mono text-muted-foreground/80 sm:pl-1"
                  aria-hidden
                >
                  silver-ui.vercel.app
                </p>
              </div>
            </div>

            <ul className="min-w-0 flex-1 list-none space-y-3.5 p-0">
              {highlights.map((line) => (
                <li
                  key={line}
                  className="flex gap-4 rounded-2xl border border-border/75 bg-card/50 px-4 py-3.5 shadow-sm backdrop-blur-sm dark:border-border/50 dark:bg-card/38 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]"
                >
                  <div className={bulletIconClass}>
                    <Check className="size-4" strokeWidth={2} aria-hidden />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                    {line}
                  </p>
                </li>
              ))}
            </ul>

            <div
              className="pointer-events-none absolute bottom-6 right-6 hidden opacity-[0.1] lg:block dark:opacity-[0.16]"
              aria-hidden
            >
              <Sparkles className="size-24 text-foreground" strokeWidth={1} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
