"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

import { useSound } from "@/hooks/use-sound";
import { click002Sound } from "@/sounds/click-002";

/** Plays UI click feedback for any pointer activation on the page (capture phase). */
export function PageClickSound() {
  const prefersReducedMotion = useReducedMotion() === true;
  const [playClick] = useSound(click002Sound, {
    interrupt: true,
    soundEnabled: !prefersReducedMotion,
  });

  useEffect(() => {
    const onClickCapture = () => {
      playClick();
    };
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [playClick]);

  return null;
}
