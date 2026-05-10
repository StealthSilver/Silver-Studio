import {
  LetterWaveLink,
} from "@/components/ui/letter-wave-link";
import { finalCtaSection } from "@/data/site";

/** Same full-bleed rule + heading scale as `Services` / `Process` / `Faq`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const FINAL_CTA_HEADING_CLASS =
  "text-center text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]";

function FinalCtaPreRuleSpacer() {
  return <div className="h-10 shrink-0 sm:h-14 lg:h-16" aria-hidden />;
}

function FinalCtaTopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function FinalCtaHeading({ headingId, title }: { headingId: string; title: string }) {
  return (
    <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-6">
        <div className="min-w-0 max-w-[min(100%,44rem)] px-2 text-center">
          <h2 id={headingId} className={FINAL_CTA_HEADING_CLASS}>
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

function FinalCtaHeadingToContentSpacer() {
  return <div className="h-6 shrink-0 sm:h-8 lg:h-10" aria-hidden />;
}

export function FinalCta() {
  const { id, heading, primaryCta } = finalCtaSection;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="w-full scroll-mt-28 bg-background text-foreground sm:scroll-mt-32"
    >
      <FinalCtaPreRuleSpacer />
      <FinalCtaTopRule />
      <FinalCtaHeading headingId={headingId} title={heading} />
      <FinalCtaHeadingToContentSpacer />
      <div className="mx-auto box-border flex w-full max-w-7xl justify-center px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
        <LetterWaveLink
          href={primaryCta.href}
          className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide shadow-[0_14px_32px_-20px_rgb(24_24_27_/_0.55)]"
          label={primaryCta.label}
        />
      </div>
    </section>
  );
}
