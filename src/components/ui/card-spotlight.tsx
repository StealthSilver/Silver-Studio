"use client";

import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useState } from "react";

/** Slate / cool silver accents aligned with globals.css hero + ring tokens */
const REVEAL_COLORS: number[][] = [
  [100, 116, 139],
  [148, 163, 184],
];

export function CardSpotlight({
  children,
  radius = 360,
  className,
  canvasAnimationSpeed = 4.5,
  disableRevealCanvas = false,
  ...rest
}: {
  radius?: number;
  children: React.ReactNode;
  /** When true, skips WebGL canvas (e.g. section reduced-motion layout) */
  disableRevealCanvas?: boolean;
  canvasAnimationSpeed?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const prefersReducedMotion = useReducedMotion();
  const hideCanvas = prefersReducedMotion === true || disableRevealCanvas;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={cn(
        "group/spotlight relative overflow-hidden rounded-[inherit]",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...rest}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-px z-0 rounded-[inherit] opacity-0 transition duration-300",
          "bg-slate-900/[0.08] dark:bg-[rgb(218_222_232/0.06)]",
          "group-hover/spotlight:opacity-100",
        )}
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        {isHovering && !hideCanvas && (
          <CanvasRevealEffect
            animationSpeed={canvasAnimationSpeed}
            containerClassName="absolute inset-0 h-full bg-transparent [&>div]:h-full"
            colors={REVEAL_COLORS}
            dotSize={2.75}
            showGradient={false}
          />
        )}
      </motion.div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
