"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SplashInteractiveContextValue = {
  /**
   * True on `/` until the splash calls `notifyHomeSplashComplete()`.
   * Used to hold navbar blur reveals / block ambient playback.
   */
  splashGateActive: boolean;
  notifyHomeSplashComplete: () => void;
};

const SplashInteractiveContext =
  createContext<SplashInteractiveContextValue | null>(null);

export function SplashInteractiveProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [homeSplashComplete, setHomeSplashComplete] = useState<boolean>(
    () => !isHome,
  );

  const prevPathRef = useRef(pathname);

  /**
   * Off home: chrome is interactive immediately.
   * Client navigation onto `/` from another route: rerun the gate until notify.
   */
  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    if (!isHome) {
      setHomeSplashComplete(true);
      return;
    }

    if (prev !== "/" && pathname === "/") {
      setHomeSplashComplete(false);
    }
  }, [pathname, isHome]);

  const notifyHomeSplashComplete = useCallback(() => {
    setHomeSplashComplete(true);
  }, []);

  const value = useMemo((): SplashInteractiveContextValue => {
    const splashGateActive = isHome && !homeSplashComplete;
    return {
      splashGateActive,
      notifyHomeSplashComplete,
    };
  }, [isHome, homeSplashComplete, notifyHomeSplashComplete]);

  return (
    <SplashInteractiveContext.Provider value={value}>
      {children}
    </SplashInteractiveContext.Provider>
  );
}

export function useSplashInteractive(): SplashInteractiveContextValue {
  const ctx = useContext(SplashInteractiveContext);
  if (!ctx) {
    return {
      splashGateActive: false,
      notifyHomeSplashComplete: () => {},
    };
  }
  return ctx;
}

/** True while first-paint splash is holding chrome (navbar animations, playback). */
export function useSplashGateActive(): boolean {
  return useSplashInteractive().splashGateActive;
}
