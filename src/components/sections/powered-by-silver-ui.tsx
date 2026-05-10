"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

import {
  BlurRevealBlockInView,
  BlurRevealWordsInView,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import {
  LetterWaveLink,
  OUTLINE_CTA_HERO_SHADOW_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { WorkBottomSingle } from "@/components/ui/work-style-glass-preview";
import { poweredBySilverUiSection } from "@/data/site";

/** Same full-bleed rule + heading scale as `Services`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

/** Matches `SERVICES_HEADING_CLASS` in `services.tsx`. */
const HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground max-sm:text-xl max-sm:leading-[1.1] sm:text-3xl md:text-4xl lg:text-[2.75rem]";

const SECTION_HEADING_COPY = "POWERED BY SILVER UI";

/** Crop height — taller so artwork reaches nearer the section rule below (Process top line). */
const POWERED_PREVIEW_VISIBLE_FRACTION = 0.9;

function TopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

export function PoweredBySilverUi() {
  const reduceMotion = useReducedMotion() === true;
  const { id, intro, externalHref, ctaLabel, ctaAriaLabel, previewImage } =
    poweredBySilverUiSection;
  const headingId = `${id}-heading`;
  const previewLinkLabel =
    "Silver UI preview — opens the component library site in a new tab";

  const staggerMs = HERO_REVEAL_STAGGER_MS;
  const headingWordCount = splitHeroWords(SECTION_HEADING_COPY).length;
  const introDelayMs = headingWordCount * staggerMs;
  const introWordCount = useMemo(
    () => splitHeroWords(intro).length,
    [intro],
  );
  const ctaDelaySec = (introDelayMs + introWordCount * staggerMs + staggerMs * 2) / 1000;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative mx-auto w-full max-w-7xl shrink-0 scroll-mt-28 sm:scroll-mt-32"
    >
      <TopRule />

      <div className="flex flex-col px-4 pb-0 pt-0 max-md:px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl pb-6 sm:pb-8 lg:pb-10">
          <div className="flex w-full justify-center">
            <div className="flex w-full max-w-7xl items-start justify-between gap-6">
              <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
                <div className="pb-6 sm:pb-8 lg:pb-10">
                  <div className="pt-[4.25rem] sm:pt-20 lg:pt-24">
                    <h2 id={headingId} className={HEADING_CLASS}>
                      <BlurRevealWordsInView
                        text={SECTION_HEADING_COPY}
                        reduced={reduceMotion}
                      />
                    </h2>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground max-md:text-[0.9375rem] max-md:leading-relaxed sm:text-[17px] sm:leading-[1.65]">
                  <BlurRevealWordsInView
                    text={intro}
                    reduced={reduceMotion}
                    startDelayMs={introDelayMs}
                  />
                </p>

                <div className="mt-8 flex justify-start max-md:mt-6 sm:mt-10">
                  <BlurRevealBlockInView
                    reduced={reduceMotion}
                    delaySec={ctaDelaySec}
                    className="inline-flex"
                    y={8}
                    blurPx={10}
                  >
                    <LetterWaveLink
                      href={externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={OUTLINE_CTA_HERO_SHADOW_CLASSNAME}
                      label={ctaLabel}
                      ariaLabel={ctaAriaLabel}
                    />
                  </BlurRevealBlockInView>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edge-bleed preview: starts just under the CTA, wider + taller than work-stack defaults */}
        <div className="-mx-4 mt-5 w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:mt-7 lg:w-[calc(100%+4rem)]">
          <WorkBottomSingle
            image={previewImage}
            externalHref={externalHref}
            externalAriaLabel={previewLinkLabel}
            visibleHeightFraction={POWERED_PREVIEW_VISIBLE_FRACTION}
            frameLinkClassName="max-w-none w-full"
            imageSizes="(max-width:640px) 100vw, (max-width:1024px) 96vw, (max-width:1536px) 92vw, 1400px"
          />
        </div>
      </div>
    </section>
  );
}
