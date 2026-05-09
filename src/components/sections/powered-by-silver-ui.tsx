import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { OUTLINE_CTA_BUTTON_CLASSNAME } from "@/components/ui/letter-wave-link";
import { poweredBySilverUiSection } from "@/data/site";
import { cn } from "@/lib/utils";

export function PoweredBySilverUi() {
  const {
    id,
    sectionAriaLabel,
    eyebrow,
    heading,
    intro,
    footerTags,
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
        <div
          className={[
            "relative isolate overflow-hidden rounded-2xl border border-border/90 px-6 py-12 text-center sm:rounded-3xl sm:px-12 sm:py-16",
            "bg-gradient-to-br from-secondary/95 via-card/90 to-secondary/80 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.92),0_32px_90px_-46px_rgb(15_23_42_/_0.12)] backdrop-blur-xl dark:border-border/55 dark:from-background/96 dark:via-secondary/94 dark:to-card/90 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_38px_100px_-40px_rgb(0_0_0_/_0.65)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute -left-24 -top-24 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(247_249_251_/_0.95),transparent_66%)] dark:bg-[radial-gradient(circle,rgb(37_48_56_/_0.45),transparent_66%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 size-[24rem] rounded-full bg-[radial-gradient(circle,rgb(238_242_245_/_0.75),transparent_65%)] dark:bg-[radial-gradient(circle,rgb(21_38_45_/_0.38),transparent_68%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgb(255_255_255_/_0.48)_50%,transparent_100%)] opacity-50 dark:bg-[linear-gradient(to_right,transparent_0%,rgb(255_255_255_/_0.04)_50%,transparent_100%)]"
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-[13px]">
                {eyebrow}
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {heading}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {intro}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                href={externalHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={externalCtaAriaLabel}
                className={cn(
                  OUTLINE_CTA_BUTTON_CLASSNAME,
                  "group/sui inline-flex h-11 items-center gap-2 px-6 no-underline",
                )}
              >
                <span>{externalCtaLabel}</span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover/sui:-translate-y-0.5 group-hover/sui:translate-x-0.5 group-hover/sui:text-foreground"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
              <span className="text-[11px] font-mono text-muted-foreground/75 sm:text-xs">
                silver-ui.vercel.app
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-[11px] font-medium tracking-[0.24em] text-muted-foreground sm:text-xs">
              {footerTags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 ? (
                    <span
                      className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline-block"
                      aria-hidden
                    />
                  ) : null}
                  <span>{tag}</span>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
