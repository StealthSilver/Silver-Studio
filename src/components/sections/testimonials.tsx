"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { HeroTickerLogoMark } from "@/components/ui/hero-ticker-logo-mark";
import { heroLogoTicker, testimonialsSection } from "@/data/site";
import { STANDARD_ICON_BUTTON_CLASS } from "@/lib/standard-icon-button";
import { cn } from "@/lib/utils";

/** Same full-bleed rule + heading scale as `Services` / `Process` / `Faq`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const TESTIMONIALS_HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]";

function TestimonialsPreRuleSpacer() {
  return <div className="h-10 shrink-0 sm:h-14 lg:h-16" aria-hidden />;
}

function TestimonialsTopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function TestimonialsHeading({ headingId }: { headingId: string }) {
  return (
    <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
      <div className="flex w-full max-w-7xl items-start justify-between gap-6">
        <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
          <h2 id={headingId} className={TESTIMONIALS_HEADING_CLASS}>
            WHAT TEAMS NOTICE
          </h2>
        </div>
      </div>
    </div>
  );
}

/** A bit more air than FAQ heading spacer so the carousel doesn’t feel tight. */
function TestimonialsHeadingToContentSpacer() {
  return <div className="h-8 shrink-0 sm:h-10 lg:h-12" aria-hidden />;
}

/**
 * Light: soft silver washes on `#f7f9fb` / white family (`--card`, `--muted`).
 * Dark: deep charcoal matching `--background` / `--card` in `.dark`.
 */
const TESTIMONIAL_TILE_GRADIENTS = [
  "bg-[radial-gradient(ellipse_88%_72%_at_18%_14%,rgb(148_163_184_/_0.22)_0%,transparent_55%),radial-gradient(ellipse_72%_58%_at_88%_78%,rgb(226_232_240_/_0.65)_0%,transparent_62%),linear-gradient(152deg,#ffffff_0%,#f4f7fa_42%,#eef2f5_100%)] dark:bg-[radial-gradient(ellipse_82%_68%_at_18%_14%,rgb(51_65_85_/_0.14)_0%,transparent_54%),radial-gradient(ellipse_72%_58%_at_88%_78%,rgb(15_23_42_/_0.32)_0%,transparent_62%),linear-gradient(152deg,#05080a_0%,#0b1215_40%,#101920_100%)]",
  "bg-[radial-gradient(ellipse_82%_70%_at_14%_20%,rgb(199_210_254_/_0.38)_0%,transparent_52%),radial-gradient(ellipse_78%_68%_at_88%_32%,rgb(224_231_255_/_0.55)_0%,transparent_58%),linear-gradient(148deg,#ffffff_0%,#f8fafc_44%,#f1f5f9_100%)] dark:bg-[radial-gradient(ellipse_78%_64%_at_12%_22%,rgb(30_58_138_/_0.12)_0%,transparent_52%),radial-gradient(ellipse_80%_70%_at_90%_30%,rgb(49_46_129_/_0.14)_0%,transparent_58%),linear-gradient(148deg,#06090c_0%,#0b1215_44%,#121a22_100%)]",
  "bg-[radial-gradient(ellipse_86%_74%_at_24%_12%,rgb(167_243_208_/_0.32)_0%,transparent_52%),radial-gradient(ellipse_74%_62%_at_78%_82%,rgb(204_251_241_/_0.45)_0%,transparent_60%),linear-gradient(155deg,#ffffff_0%,#f6fdfb_42%,#f0fdf9_100%)] dark:bg-[radial-gradient(ellipse_85%_72%_at_25%_12%,rgb(13_148_136_/_0.1)_0%,transparent_52%),radial-gradient(ellipse_74%_62%_at_78%_82%,rgb(15_118_110_/_0.12)_0%,transparent_60%),linear-gradient(155deg,#050a0b_0%,#0b1215_42%,#0f181c_100%)]",
  "bg-[radial-gradient(ellipse_80%_68%_at_20%_18%,rgb(254_215_170_/_0.26)_0%,transparent_50%),radial-gradient(ellipse_78%_64%_at_85%_75%,rgb(241_245_249_/_0.75)_0%,transparent_58%),linear-gradient(150deg,#ffffff_0%,#fffdfb_45%,#f8fafc_100%)] dark:bg-[radial-gradient(ellipse_76%_66%_at_20%_18%,rgb(120_53_15_/_0.1)_0%,transparent_50%),radial-gradient(ellipse_78%_64%_at_85%_75%,rgb(30_27_75_/_0.14)_0%,transparent_58%),linear-gradient(150deg,#070806_0%,#0b1215_45%,#141c1f_100%)]",
  "bg-[radial-gradient(ellipse_84%_72%_at_22%_16%,rgb(148_163_184_/_0.2)_0%,transparent_54%),radial-gradient(ellipse_76%_68%_at_82%_72%,rgb(226_232_240_/_0.6)_0%,transparent_62%),linear-gradient(149deg,#ffffff_0%,#f4f6f8_43%,#eef2f5_100%)] dark:bg-[radial-gradient(ellipse_80%_70%_at_22%_16%,rgb(71_85_105_/_0.15)_0%,transparent_54%),radial-gradient(ellipse_76%_68%_at_82%_72%,rgb(30_41_59_/_0.28)_0%,transparent_62%),linear-gradient(149deg,#050809_0%,#0b1215_43%,#111a20_100%)]",
] as const;

const TILE_GLASS =
  "pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(168deg,rgba(255,255,255,0.72)_0%,transparent_40%,rgba(148,163,184,0.1)_100%)] dark:bg-[linear-gradient(168deg,rgba(255,255,255,0.085)_0%,transparent_38%,rgba(0,0,0,0.18)_100%)]";

const TILE_VIGNETTE =
  "pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_72%_58%_at_50%_48%,transparent_0%,rgb(15_23_42/_0.06)_88%,rgb(15_23_42/_0.1)_100%)] dark:bg-[radial-gradient(ellipse_72%_58%_at_50%_48%,transparent_0%,rgb(0_0_0/_0.42)_88%,rgb(0_0_0/_0.55)_100%)]";

const TILE_INNER_GLOW =
  "pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgb(255_255_255/_0.92),inset_0_-1px_0_rgb(15_23_42/_0.06)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/_0.07),inset_0_-1px_0_rgb(0_0_0/_0.35)]";

const TILE_FRAME =
  "border-border/80 bg-white shadow-[0_22px_44px_-18px_rgb(15_23_42/_0.14),0_1px_0_rgb(255_255_255/_0.95)_inset] dark:border-white/[0.06] dark:bg-[#0b1215] dark:shadow-[0_28px_56px_-14px_rgb(0_0_0/_0.65),inset_0_1px_0_rgb(255_255_255/_0.055)]";

/** Carousel arrows: shared icon-button styles; 6px radius for this section. */
const TESTIMONIALS_ARROW_CLASS = cn(
  STANDARD_ICON_BUTTON_CLASS,
  "rounded-[6px] [&_svg]:size-4",
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

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="w-full scroll-mt-28 bg-background text-foreground sm:scroll-mt-32"
    >
      <TestimonialsPreRuleSpacer />
      <TestimonialsTopRule />
      <TestimonialsHeading headingId={headingId} />
      <TestimonialsHeadingToContentSpacer />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12 lg:pb-40">
        <div className="relative grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20 lg:gap-24">
          <div className="flex flex-col justify-between gap-10 py-4 md:py-6">
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
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {activeItem.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{activeItem.role}</p>

                {reduce ? (
                  <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                    {activeItem.quote}
                  </p>
                ) : (
                  <motion.p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                    {activeItem.quote.split(" ").map((word, wordIndex) => (
                      <motion.span
                        key={`${active}-${wordIndex}-${word}`}
                        initial={{
                          filter: "blur(10px)",
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          filter: "blur(0px)",
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                          delay: 0.02 * wordIndex,
                        }}
                        className="inline-block"
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>
                )}
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
            <div className="relative h-80 w-full md:ml-auto md:max-w-[min(100%,26rem)]">
              <AnimatePresence mode="sync">
                {items.map((testimonial, index) => {
                  const gradientClass =
                    TESTIMONIAL_TILE_GRADIENTS[
                      index % TESTIMONIAL_TILE_GRADIENTS.length
                    ];
                  const logoItem = logoItems[index % logoItems.length]!;
                  const activeSlide = index === active;
                  /** Back cards sit slightly lower so edges read as a straight deck (no tilt). */
                  const backOffsetY = 14 + index * 12;

                  return (
                    <motion.div
                      key={`${testimonial.name}-${testimonial.role}-${index}`}
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              scale: 0.92,
                              z: -100,
                            }
                      }
                      animate={{
                        opacity: activeSlide ? 1 : reduce ? 0.5 : 0.72,
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
                            ? [0, -48, 0]
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
                          "relative h-full w-full overflow-hidden rounded-3xl border",
                          TILE_FRAME,
                        )}
                      >
                        <div className={cn("absolute inset-0", gradientClass)} />
                        <div className={TILE_VIGNETTE} aria-hidden />
                        <div className={TILE_GLASS} aria-hidden />
                        <div className={TILE_INNER_GLOW} aria-hidden />
                        <div
                          className="relative flex h-full flex-col items-center justify-center px-6 py-8 sm:px-10"
                          aria-hidden
                        >
                          <div className="flex min-h-[4.5rem] w-full max-w-[min(100%,15rem)] flex-col items-center justify-center sm:min-h-[5.25rem] sm:max-w-[17rem]">
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
