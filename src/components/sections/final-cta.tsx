import { CtaBeamsLazy } from "@/components/ui/cta-beams-dynamic";
import {
  HERO_PRIMARY_CTA_WRAP_CLASSNAME,
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
    <div className="flex w-full justify-center">
      <div className="min-w-0 max-w-[min(100%,44rem)] px-2 text-center">
        <h2 id={headingId} className={FINAL_CTA_HEADING_CLASS}>
          {title}
        </h2>
      </div>
    </div>
  );
}

/** Full-viewport-width band; tall enough to vertically center heading + CTA. */
const CTA_BEAMS_BAND =
  "min-h-[600px] md:min-h-[min(85vh,920px)]";

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
      <div
        className={`${FULL_BLEED_ROW} isolate ${CTA_BEAMS_BAND} overflow-hidden`}
      >
        <CtaBeamsLazy
          dramatic
          className="absolute inset-0 z-0 h-full w-full min-h-0"
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/90 via-background/45 to-background/90"
        />
        <div
          className={`relative z-10 flex w-full ${CTA_BEAMS_BAND} flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8`}
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 sm:gap-10">
            <FinalCtaHeading headingId={headingId} title={heading} />
            <div className="flex justify-center">
              <span className={HERO_PRIMARY_CTA_WRAP_CLASSNAME}>
                <LetterWaveLink
                  href={primaryCta.href}
                  className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide"
                  label={primaryCta.label}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
