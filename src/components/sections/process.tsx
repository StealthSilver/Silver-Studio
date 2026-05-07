"use client";

import { motion, useReducedMotion } from "motion/react";

import { processSection } from "@/data/site";

/** Compact illustrations—no frame */
const svgClass =
  "h-8 w-auto shrink-0 text-zinc-500 sm:h-9 dark:text-zinc-400";

function DiscoverySvg({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <motion.circle
        cx="46"
        cy="44"
        r="22"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity={0.85}
        initial={false}
        animate={
          reduceMotion
            ? {}
            : { strokeOpacity: [0.45, 0.95, 0.45], scale: [1, 1.02, 1] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="46"
        cy="44"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity={0.5}
        initial={false}
        animate={reduceMotion ? {} : { opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M62 60 L76 74"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity={0.9}
      />
      <motion.circle
        cx="84"
        cy="26"
        r="3"
        fill="currentColor"
        fillOpacity={0.55}
        animate={
          reduceMotion ? {} : { opacity: [0.35, 1, 0.35], scale: [0.92, 1.08, 0.92] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="98"
        cy="52"
        r="2.5"
        fill="currentColor"
        fillOpacity={0.45}
        animate={
          reduceMotion ? {} : { opacity: [0.25, 0.95, 0.25], scale: [0.9, 1.12, 0.9] }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.circle
        cx="24"
        cy="22"
        r="2"
        fill="currentColor"
        fillOpacity={0.4}
        animate={
          reduceMotion ? {} : { opacity: [0.2, 0.85, 0.2], scale: [0.95, 1.1, 0.95] }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </svg>
  );
}

function DirectionSvg({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <circle cx="60" cy="44" r="26" stroke="currentColor" strokeWidth="1.5" strokeOpacity={0.35} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 60 + Math.cos(rad) * 22;
        const y1 = 44 + Math.sin(rad) * 22;
        const x2 = 60 + Math.cos(rad) * 26;
        const y2 = 44 + Math.sin(rad) * 26;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={deg % 90 === 0 ? 2 : 1}
            strokeOpacity={deg % 90 === 0 ? 0.55 : 0.28}
          />
        );
      })}
      <motion.g
        style={{ transformOrigin: "60px 44px" }}
        animate={reduceMotion ? {} : { rotate: [0, 360] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M60 44 L60 22"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeOpacity={0.9}
        />
        <polygon points="60,18 56,26 64,26" fill="currentColor" fillOpacity={0.85} />
      </motion.g>
      <circle cx="60" cy="44" r="4" fill="currentColor" fillOpacity={0.25} />
    </svg>
  );
}

function DesignSvg({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <motion.rect
        x="18"
        y="16"
        width="84"
        height="56"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeOpacity={0.45}
        initial={false}
        animate={reduceMotion ? {} : { opacity: [0.55, 1, 0.55], strokeOpacity: [0.35, 0.72, 0.35] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="28"
        y="26"
        width="36"
        height="22"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity={0.65}
        initial={false}
        animate={reduceMotion ? {} : { y: [26, 24, 26], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="70"
        y="26"
        width="24"
        height="36"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity={0.55}
        initial={false}
        animate={reduceMotion ? {} : { y: [26, 28, 26], opacity: [0.5, 0.95, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.line
        x1="28"
        y1="56"
        x2="92"
        y2="56"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity={0.4}
        strokeDasharray="6 5"
        animate={reduceMotion ? {} : { x1: [26, 30, 26], x2: [94, 90, 94] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function DevelopmentSvg({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <path
        d="M28 30 L22 44 L28 58"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.85}
      />
      <path
        d="M92 30 L98 44 L92 58"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.85}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x="38"
          y={34 + i * 10}
          height="4"
          rx="1"
          fill="currentColor"
          fillOpacity={0.35 + i * 0.08}
          initial={{ width: 32 }}
          animate={
            reduceMotion
              ? {}
              : {
                  width: [28 + i * 6, 52 + i * 4, 28 + i * 6],
                  opacity: [0.35, 0.95, 0.35],
                }
          }
          transition={{
            duration: 2.2 + i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
        />
      ))}
    </svg>
  );
}

function DeploymentSvg({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <path
        d="M22 62 Q60 72 98 62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity={0.35}
      />
      <ellipse cx="60" cy="62" rx="38" ry="8" stroke="currentColor" strokeWidth="1.25" strokeOpacity={0.28} />
      <motion.path
        d="M60 54 L60 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity={0.75}
        initial={false}
        animate={reduceMotion ? {} : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        animate={reduceMotion ? {} : { y: [0, -2.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points="60,22 54,32 66,32" fill="currentColor" fillOpacity={0.85} />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={48 + i * 12}
          cy={44}
          r="2"
          fill="currentColor"
          fillOpacity={0.4}
          animate={
            reduceMotion
              ? {}
              : {
                  cy: [44, 28 - i * 4, 44],
                  opacity: [0.2, 0.9, 0.2],
                }
          }
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.35,
          }}
        />
      ))}
    </svg>
  );
}

const STEP_VISUALS = [
  DiscoverySvg,
  DirectionSvg,
  DesignSvg,
  DevelopmentSvg,
  DeploymentSvg,
] as const;

export function Process() {
  const { id, sectionAriaLabel, heading, steps } = processSection;
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 pt-16 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="max-w-2xl text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
          {heading}
        </h2>

        <ul className="mt-10 list-none space-y-10 sm:mt-14 sm:space-y-12">
          {steps.map((step, index) => {
            const Visual = STEP_VISUALS[index];
            return (
              <li key={step.letter}>
                <article>
                  <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
                    <div className="flex min-w-0 flex-1 flex-col lg:max-w-xl xl:max-w-lg">
                      <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                        <span className="shrink-0 text-[0.55rem] font-medium tabular-nums leading-none tracking-normal text-zinc-600 sm:text-[0.6rem] dark:text-zinc-400">
                          [{step.letter}]
                        </span>
                        <span className="min-w-0">{step.title}</span>
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
                        {step.description}
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 justify-start lg:w-[4.5rem] lg:justify-end lg:pt-1 xl:w-20"
                      aria-hidden
                    >
                      <Visual reduceMotion={reduceMotion} />
                    </div>
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
