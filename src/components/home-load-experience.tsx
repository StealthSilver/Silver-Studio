"use client";

import { useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  PAGE_LOADER_EXIT_DURATION_MS,
  PageLoader,
} from "@/components/page-loader";
import { Footer } from "@/components/sections/footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { HeroRevealHeldProvider } from "@/context/hero-reveal-held-context";
import { useSplashInteractive } from "@/context/splash-interactive-context";
import { subscribeHomeReady } from "@/lib/home-load-readiness";

type HomeLoadExperienceProps = {
  navbar: ReactNode;
  slots: {
    hero: ReactNode;
    sections: ReactNode;
  };
};

type LoaderPhase = "running" | "exiting" | "done";

/** Minimum splash time — avoids sub-second flashes once assets resolve quickly */
const MIN_VISIBLE_MS = 1200;

const homeMainClassName =
  "mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-y-visible bg-background px-4 pb-0 pt-6 text-foreground max-md:overflow-x-clip max-md:px-3 max-md:pt-5 md:overflow-x-visible sm:px-6 sm:pt-8 lg:px-8";

export function HomeLoadExperience({ navbar, slots }: HomeLoadExperienceProps) {
  const reduceMotion = useReducedMotion();
  const { notifyHomeSplashComplete } = useSplashInteractive();

  const [held, setHeld] = useState(() => reduceMotion !== true);
  const [phase, setPhase] = useState<LoaderPhase>(() =>
    reduceMotion === true ? "done" : "running",
  );
  const [displayPct, setDisplayPct] = useState(0);

  const assetTargetPctRef = useRef(0);
  const assetReadyRef = useRef(false);
  const displayPctRef = useRef(0);

  useEffect(() => {
    if (reduceMotion === true) return undefined;
    return subscribeHomeReady(({ progress01, ready }) => {
      assetTargetPctRef.current = progress01 * 100;
      assetReadyRef.current = ready;
    });
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion === true) {
      notifyHomeSplashComplete();
      setHeld(false);
      setPhase("done");
      setDisplayPct(100);
      displayPctRef.current = 100;
    }
  }, [reduceMotion, notifyHomeSplashComplete]);

  useEffect(() => {
    if (reduceMotion === true || phase !== "running") return undefined;

    const t0 = performance.now();
    let raf = 0;
    let startedExit = false;

    const clamp = (n: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, n));

    const tick = (now: number) => {
      const elapsed = now - t0;
      const assetTarget = assetTargetPctRef.current;
      const prev = displayPctRef.current;
      const loadDone = assetReadyRef.current;

      /** Smooth display toward real asset progress; never regress when late images appear. */
      let eased = clamp(
        prev + (assetTarget - prev) * 0.12,
        prev,
        Math.max(prev, assetTarget),
      );
      if (loadDone && assetTarget >= 99.95) {
        eased = clamp(eased + (100 - eased) * 0.34, eased, 100);
      }
      displayPctRef.current = eased;
      setDisplayPct(eased);

      const canExit =
        loadDone &&
        elapsed >= MIN_VISIBLE_MS &&
        assetTarget >= 99.95 &&
        eased >= 99.85 &&
        !startedExit;

      if (canExit) {
        startedExit = true;
        displayPctRef.current = 100;
        setDisplayPct(100);
        setPhase("exiting");
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [phase, reduceMotion]);

  const handleExitComplete = () => {
    notifyHomeSplashComplete();
    setPhase("done");
    setHeld(false);
  };

  return (
    <>
      {navbar}
      <main className={homeMainClassName}>
        <div className="shrink-0">
          <HeroRevealHeldProvider held={held}>{slots.hero}</HeroRevealHeldProvider>
        </div>
        {slots.sections}
      </main>
      <Footer />
      <ScrollToTopButton />
      {(phase === "running" || phase === "exiting") &&
        reduceMotion !== true && (
          <PageLoader
            phase={phase === "running" ? "running" : "exiting"}
            progress={displayPct}
            onExitComplete={handleExitComplete}
            exitDurationMs={PAGE_LOADER_EXIT_DURATION_MS}
          />
        )}
    </>
  );
}
