"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  BlurRevealWordsInView,
  BlurRevealWordsWhen,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import { HeroTickerLogoMark } from "@/components/ui/hero-ticker-logo-mark";
import { heroLogoTicker, testimonialsSection } from "@/data/site";
import { STANDARD_ICON_BUTTON_CLASS } from "@/lib/standard-icon-button";
import { cn } from "@/lib/utils";

/** Same full-bleed rule + heading scale as `Services` / `Process` / `Faq`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const TESTIMONIALS_HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground max-sm:text-xl max-sm:leading-[1.1] sm:text-3xl md:text-4xl lg:text-[2.75rem]";

function TestimonialsPreRuleSpacer() {
  return (
    <div className="h-10 shrink-0 max-md:h-8 sm:h-14 lg:h-16" aria-hidden />
  );
}

function TestimonialsTopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function TestimonialsHeading({
  headingId,
  reduced,
}: {
  headingId: string;
  reduced: boolean;
}) {
  return (
    <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 max-md:px-3 max-md:pt-14 max-md:pb-5 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
      <div className="flex w-full max-w-7xl items-start justify-between gap-6">
        <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
          <h2 id={headingId} className={TESTIMONIALS_HEADING_CLASS}>
            <BlurRevealWordsInView
              text="WHAT TEAMS NOTICE"
              reduced={reduced}
            />
          </h2>
        </div>
      </div>
    </div>
  );
}

/** A bit more air than FAQ heading spacer so the carousel doesn’t feel tight. */
function TestimonialsHeadingToContentSpacer() {
  return (
    <div className="h-8 shrink-0 max-md:h-6 sm:h-10 lg:h-12" aria-hidden />
  );
}

/**
 * Light: aligns with FAQ / Services — `bg-card` family, muted silver washes only (matches `--background` / `--muted`).
 * Dark: unchanged — sits on `#0b1215` → `#151f24`; radials stay low-contrast like hero silver washes.
 */
const TESTIMONIAL_TILE_GRADIENTS = [
  "bg-[radial-gradient(ellipse_92%_74%_at_14%_10%,rgb(148_163_184_/_0.07)_0%,transparent_52%),radial-gradient(ellipse_74%_60%_at_92%_88%,rgb(220_227_236_/_0.45)_0%,transparent_58%),linear-gradient(158deg,#ffffff_0%,#f5f9fc_48%,#eef2f5_100%)] dark:bg-[radial-gradient(ellipse_82%_68%_at_18%_14%,rgb(148_163_184_/_0.07)_0%,transparent_54%),radial-gradient(ellipse_72%_58%_at_88%_78%,rgb(203_213_225_/_0.06)_0%,transparent_62%),linear-gradient(152deg,#0b1215_0%,color-mix(in_srgb,#151f24_38%,#0b1215)_43%,color-mix(in_srgb,#151f24_78%,#0b1215)_100%)]",
  "bg-[radial-gradient(ellipse_88%_70%_at_82%_12%,rgb(154_182_212_/_0.08)_0%,transparent_50%),linear-gradient(152deg,#ffffff_0%,#f6f9fc_40%,#edf1f6_100%)] dark:bg-[radial-gradient(ellipse_78%_64%_at_12%_22%,rgb(165_180_252_/_0.06)_0%,transparent_52%),radial-gradient(ellipse_80%_70%_at_90%_30%,rgb(129_140_248_/_0.05)_0%,transparent_58%),linear-gradient(148deg,#0b1215_0%,color-mix(in_srgb,#17202e_42%,#0b1215)_44%,color-mix(in_srgb,#151f24_85%,#0b1215)_100%)]",
  "bg-[radial-gradient(ellipse_86%_72%_at_18%_86%,rgb(148_163_184_/_0.06)_0%,transparent_55%),linear-gradient(160deg,#ffffff_0%,#f4f8fb_42%,#eef2f5_100%)] dark:bg-[radial-gradient(ellipse_85%_72%_at_25%_12%,rgb(45_212_191_/_0.05)_0%,transparent_52%),radial-gradient(ellipse_74%_62%_at_78%_82%,rgb(94_234_212_/_0.04)_0%,transparent_60%),linear-gradient(155deg,#0b1215_0%,color-mix(in_srgb,#132028_42%,#0b1215)_42%,color-mix(in_srgb,#171f26_82%,#0b1215)_100%)]",
  "bg-[radial-gradient(ellipse_80%_64%_at_48%_-8%,rgb(203_213_225_/_0.35)_0%,transparent_45%),linear-gradient(154deg,#ffffff_0%,#f5f8fb_46%,#ebf0f5_100%)] dark:bg-[radial-gradient(ellipse_76%_66%_at_20%_18%,rgb(251_191_36_/_0.04)_0%,transparent_50%),radial-gradient(ellipse_78%_64%_at_85%_75%,rgb(167_139_250_/_0.05)_0%,transparent_58%),linear-gradient(150deg,#0b1215_0%,color-mix(in_srgb,#181c22_45%,#0b1215)_45%,color-mix(in_srgb,#161f24_82%,#0b1215)_100%)]",
  "bg-[radial-gradient(ellipse_84%_70%_at_92%_40%,rgb(148_163_184_/_0.06)_0%,transparent_52%),linear-gradient(156deg,#ffffff_0%,#f5f9fc_44%,#eef2f5_100%)] dark:bg-[radial-gradient(ellipse_80%_70%_at_22%_16%,rgb(100_116_139_/_0.07)_0%,transparent_54%),radial-gradient(ellipse_76%_68%_at_82%_72%,rgb(148_163_184_/_0.05)_0%,transparent_62%),linear-gradient(149deg,#0b1215_0%,color-mix(in_srgb,#151f24_45%,#0b1215)_43%,color-mix(in_srgb,#151f24_88%,#0b1215)_100%)]",
] as const;

const TILE_GLASS =
  "pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(168deg,rgba(255,255,255,0.35)_0%,transparent_45%,rgba(148,163,184,0.04)_100%)] dark:bg-[linear-gradient(168deg,rgba(255,255,255,0.06)_0%,transparent_40%,rgba(15,23,42,0.08)_100%)]";

const TILE_VIGNETTE =
  "pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_78%_64%_at_50%_50%,transparent_0%,rgb(15_23_42/_0.025)_90%,rgb(15_23_42/_0.045)_100%)] dark:bg-[radial-gradient(ellipse_78%_62%_at_50%_48%,transparent_0%,rgb(15_23_42/_0.08)_86%,rgb(15_23_42/_0.14)_100%)]";

const TILE_INNER_GLOW =
  "pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgb(255_255_255/_0.85),inset_0_-1px_0_rgb(148_163_184/_0.12)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/_0.07),inset_0_-1px_0_rgb(15_23_42/_0.12)]";

const TILE_FRAME =
  "border-border/90 bg-card/95 backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/_0.9),0_14px_32px_-14px_rgb(15_23_42/_0.07),0_2px_8px_rgb(15_23_42/_0.035)] dark:border-white/[0.06] dark:bg-[#0b1215] dark:backdrop-blur-none dark:shadow-[0_28px_56px_-14px_rgb(0_0_0/_0.65),inset_0_1px_0_rgb(255_255_255/_0.055)]";

/** Carousel arrows: shared icon-button styles; 6px radius for this section. */
const TESTIMONIALS_ARROW_CLASS = cn(
  STANDARD_ICON_BUTTON_CLASS,
  "rounded-[6px] [&_svg]:size-4 max-md:size-9 max-md:[&_svg]:size-[0.9rem]",
);

export function Testimonials() {
  const { id, items } = testimonialsSection;
  const logoItems = heroLogoTicker.items;
  const headingId = `${id}-heading`;
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const reduce = Boolean(prefersReducedMotion);
  const count = items.length;

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!count) return;
    setActive((i) => Math.min(i, count - 1));
  }, [count]);

  if (!count) return null;

  const activeItem = items[active];
  const staggerMs = HERO_REVEAL_STAGGER_MS;
  const gap = staggerMs * 2;
  const nameWords = splitHeroWords(activeItem.name).length;
  const roleWords = splitHeroWords(activeItem.role).length;
  const roleStartMs = nameWords * staggerMs + gap;
  const quoteStartMs = roleStartMs + roleWords * staggerMs + gap;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="w-full scroll-mt-28 bg-background text-foreground sm:scroll-mt-32"
    >
      <TestimonialsPreRuleSpacer />
      <TestimonialsTopRule />
      <TestimonialsHeading headingId={headingId} reduced={reduce} />
      <TestimonialsHeadingToContentSpacer />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 pb-28 max-md:px-4 max-md:pb-20 sm:px-8 sm:pb-36 lg:px-12 lg:pb-40">
        <div className="relative grid grid-cols-1 gap-14 max-md:gap-14 md:grid-cols-2 md:gap-20 lg:gap-24">
          <div className="flex flex-col justify-between gap-10 py-4 max-md:gap-7 md:py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                aria-live="polite"
                aria-atomic="true"
                initial={reduce ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? {} : { y: -20, opacity: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.2,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-foreground max-md:text-xl">
                  <BlurRevealWordsWhen
                    key={`t-name-${active}`}
                    text={activeItem.name}
                    reduced={reduce}
                    active
                  />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <BlurRevealWordsWhen
                    key={`t-role-${active}`}
                    text={activeItem.role}
                    reduced={reduce}
                    active
                    startDelayMs={roleStartMs}
                  />
                </p>

                <p className="mt-8 text-lg leading-relaxed text-muted-foreground max-md:mt-5 max-md:text-base max-md:leading-relaxed">
                  <BlurRevealWordsWhen
                    key={`t-quote-${active}`}
                    text={activeItem.quote}
                    reduced={reduce}
                    active
                    startDelayMs={quoteStartMs}
                  />
                </p>
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <div
                className="flex gap-3 pt-2 md:pt-0"
                role="group"
                aria-label="Testimonials carousel navigation"
              >
                <button
                  type="button"
                  onClick={handlePrev}
                  className={TESTIMONIALS_ARROW_CLASS}
                  title="Previous testimonial"
                >
                  <ArrowLeft
                    className="transition-transform duration-300 group-hover/button:rotate-12"
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={TESTIMONIALS_ARROW_CLASS}
                  title="Next testimonial"
                >
                  <ArrowRight
                    className="transition-transform duration-300 group-hover/button:-rotate-12"
                    aria-hidden
                  />
                </button>
              </div>
            )}
          </div>

          <div className="min-w-0 py-2 md:py-6">
            <div className="relative h-80 w-full max-md:mx-auto max-md:h-56 max-md:max-w-[min(100%,17.25rem)] md:ml-auto md:h-80 md:max-w-[min(100%,26rem)]">
              <AnimatePresence mode="sync">
                {items.map((testimonial, index) => {
                  const gradientClass =
                    TESTIMONIAL_TILE_GRADIENTS[
                      index % TESTIMONIAL_TILE_GRADIENTS.length
                    ];
                  const logoItem = logoItems[index % logoItems.length]!;
                  const activeSlide = index === active;
                  /** Back cards sit slightly higher (negative y) so the deck reads as stacked from above. */
                  const backOffsetY = -(14 + index * 12);

                  return (
                    <motion.div
                      key={`${testimonial.name}-${testimonial.role}-${index}`}
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              scale: 0.96,
                              y: -56,
                              z: -100,
                            }
                      }
                      animate={{
                        opacity: reduce ? (activeSlide ? 1 : 0.5) : 1,
                        scale: activeSlide ? 1 : reduce ? 0.97 : 0.94,
                        z: activeSlide ? 0 : -100,
                        rotate: 0,
                        zIndex: activeSlide
                          ? 40
                          : count + 2 - index,
                        y: reduce
                          ? activeSlide
                            ? 0
                            : backOffsetY
                          : activeSlide
                            ? 0
                            : backOffsetY,
                      }}
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              scale: 0.92,
                              z: 100,
                              rotate: 0,
                            }
                      }
                      transition={{
                        duration: reduce ? 0.2 : 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-center"
                    >
                      <div
                        className={cn(
                          "relative h-full w-full overflow-hidden rounded-2xl border dark:rounded-3xl max-md:rounded-xl max-md:dark:rounded-2xl",
                          TILE_FRAME,
                        )}
                      >
                        <div className={cn("absolute inset-0", gradientClass)} />
                        <div className={TILE_VIGNETTE} aria-hidden />
                        <div className={TILE_GLASS} aria-hidden />
                        <div className={TILE_INNER_GLOW} aria-hidden />
                        <div
                          className="relative flex h-full flex-col items-center justify-center px-6 py-8 max-md:px-3 max-md:py-5 sm:px-10"
                          aria-hidden
                        >
                          <div className="flex min-h-[4.5rem] w-full max-w-[min(100%,15rem)] flex-col items-center justify-center max-md:min-h-[3.125rem] max-md:max-w-[min(100%,10.75rem)] sm:min-h-[5.25rem] sm:max-w-[17rem]">
                            <div className="flex w-full items-center justify-center dark:hidden">
                              <HeroTickerLogoMark
                                item={logoItem}
                                presentation="card"
                                cardTone="light"
                              />
                            </div>
                            <div className="hidden w-full items-center justify-center dark:flex">
                              <HeroTickerLogoMark
                                item={logoItem}
                                presentation="card"
                                cardTone="dark"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
