import {
  LetterWaveLink,
  OUTLINE_CTA_BUTTON_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { poweredBySilverUiSection } from "@/data/site";

/** Same full-bleed rule + heading scale as `Services`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

/** Matches `SERVICES_HEADING_CLASS` in `services.tsx`. */
const HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]";

function TopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function BottomRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-b border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

export function PoweredBySilverUi() {
  const { id, intro, externalHref, ctaLabel, ctaAriaLabel } =
    poweredBySilverUiSection;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative mx-auto flex min-h-[100vh] w-full max-w-7xl flex-col scroll-mt-28 sm:scroll-mt-32"
    >
      <TopRule />

      {/* Same rhythm as Services: rule → heading (`ServicesHeading`). */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
          <div className="flex w-full max-w-7xl items-start justify-between gap-6">
            <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
              <h2 id={headingId} className={HEADING_CLASS}>
                POWERED BY SILVER UI
              </h2>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="flex w-full max-w-7xl items-start justify-between gap-6">
            <div className="min-w-0 max-w-[min(100%,44rem)] pr-2 text-left">
              <p className="text-base leading-relaxed text-muted-foreground sm:text-[17px] sm:leading-[1.65]">
                {intro}
              </p>

              <div className="mt-9 flex justify-start sm:mt-10">
                <LetterWaveLink
                  href={externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={OUTLINE_CTA_BUTTON_CLASSNAME}
                  label={ctaLabel}
                  ariaLabel={ctaAriaLabel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomRule />
    </section>
  );
}
