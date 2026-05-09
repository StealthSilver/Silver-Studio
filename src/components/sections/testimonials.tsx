"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { testimonialsSection } from "@/data/site";
import { cn } from "@/lib/utils";

/** Gradient “avatars” — one style per testimonial index (no photos yet). */
const PLACEHOLDER_GRADIENTS = [
  "bg-[radial-gradient(85%_75%_at_20%_15%,#dbeafe_0%,transparent_52%),radial-gradient(70%_85%_at_80%_25%,#c4b5fd_0%,transparent_58%),radial-gradient(85%_90%_at_50%_100%,#99f6e4_0%,transparent_60%),linear-gradient(140deg,#ffffff_0%,#ecfeff_38%,#eef2ff_100%)] dark:bg-[radial-gradient(85%_75%_at_20%_15%,#1d4ed8_0%,transparent_55%),radial-gradient(70%_85%_at_80%_25%,#6d28d9_0%,transparent_60%),radial-gradient(85%_90%_at_50%_100%,#0f766e_0%,transparent_62%),linear-gradient(140deg,#0b1215_0%,#11191d_42%,#151f24_100%)]",
  "bg-[radial-gradient(80%_70%_at_15%_20%,#fce7f3_0%,transparent_50%),radial-gradient(75%_80%_at_85%_30%,#c4b5fd_0%,transparent_56%),radial-gradient(90%_85%_at_50%_95%,#a5b4fc_0%,transparent_58%),linear-gradient(145deg,#ffffff_0%,#faf5ff_40%,#eef2ff_100%)] dark:bg-[radial-gradient(80%_70%_at_15%_20%,#be185d_0%,transparent_52%),radial-gradient(75%_80%_at_85%_30%,#7c3aed_0%,transparent_58%),radial-gradient(90%_85%_at_50%_95%,#4f46e5_0%,transparent_60%),linear-gradient(145deg,#0b1215_0%,#18122b_38%,#151f24_100%)]",
  "bg-[radial-gradient(82%_78%_at_25%_12%,#ccfbf1_0%,transparent_52%),radial-gradient(72%_82%_at_75%_28%,#bfdbfe_0%,transparent_55%),radial-gradient(88%_88%_at_48%_100%,#6ee7b7_0%,transparent_58%),linear-gradient(138deg,#ffffff_0%,#f0fdfa_36%,#ecfeff_100%)] dark:bg-[radial-gradient(82%_78%_at_25%_12%,#047857_0%,transparent_54%),radial-gradient(72%_82%_at_75%_28%,#2563eb_0%,transparent_58%),radial-gradient(88%_88%_at_48%_100%,#059669_0%,transparent_60%),linear-gradient(138deg,#0b1215_0%,#0f1f1c_40%,#11191d_100%)]",
  "bg-[radial-gradient(78%_72%_at_18%_18%,#fed7aa_0%,transparent_50%),radial-gradient(74%_78%_at_82%_22%,#e9d5ff_0%,transparent_56%),radial-gradient(86%_90%_at_52%_92%,#fde68a_0%,transparent_56%),linear-gradient(142deg,#ffffff_0%,#fffbeb_38%,#f8fafc_100%)] dark:bg-[radial-gradient(78%_72%_at_18%_18%,#c2410c_0%,transparent_52%),radial-gradient(74%_78%_at_82%_22%,#6d28d9_0%,transparent_56%),radial-gradient(86%_90%_at_52%_92%,#ca8a04_0%,transparent_58%),linear-gradient(142deg,#0b1215_0%,#1c1410_38%,#151f24_100%)]",
  "bg-[radial-gradient(84%_76%_at_22%_14%,#ddd6fe_0%,transparent_51%),radial-gradient(76%_84%_at_78%_26%,#bae6fd_0%,transparent_57%),radial-gradient(86%_88%_at_50%_98%,#93c5fd_0%,transparent_59%),linear-gradient(140deg,#ffffff_0%,#f5f3ff_38%,#f1f5f9_100%)] dark:bg-[radial-gradient(84%_76%_at_22%_14%,#5b21b6_0%,transparent_54%),radial-gradient(76%_84%_at_78%_26%,#0369a1_0%,transparent_58%),radial-gradient(86%_88%_at_50%_98%,#1d4ed8_0%,transparent_60%),linear-gradient(140deg,#0b1215_0%,#1a1625_40%,#151f24_100%)]",
] as const;

const GLASS_OVERLAY =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.45),rgba(255,255,255,0.1))] dark:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.14),rgba(255,255,255,0.03))]";

export function Testimonials() {
  const { id, sectionAriaLabel, heading, intro, items } = testimonialsSection;
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
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-border/70 pb-24 pt-16 sm:scroll-mt-32 sm:pb-32 sm:pt-20"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <div className="max-w-2xl">
          <h2 className="text-left text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {intro}
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          <div>
            <div className="relative h-80 w-full">
              <AnimatePresence mode="sync">
                {items.map((testimonial, index) => {
                  const gradientClass =
                    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
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
                      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/90 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] dark:border-border/55 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]">
                        <div className={cn("absolute inset-0", gradientClass)} />
                        <div className={GLASS_OVERLAY} aria-hidden />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10 py-2 md:py-4">
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
                  className={cn(
                    "group/button grid size-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card/90 text-foreground transition-colors hover:border-border hover:bg-accent",
                    "[&_svg]:size-4",
                  )}
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
                  className={cn(
                    "group/button grid size-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card/90 text-foreground transition-colors hover:border-border hover:bg-accent",
                    "[&_svg]:size-4",
                  )}
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
        </div>
      </div>
    </section>
  );
}
