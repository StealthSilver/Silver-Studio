"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

const HeroRevealHeldContext = createContext(false);

export function HeroRevealHeldProvider({
  held,
  children,
}: {
  held: boolean;
  children: ReactNode;
}) {
  return (
    <HeroRevealHeldContext.Provider value={held}>
      {children}
    </HeroRevealHeldContext.Provider>
  );
}

export function useHeroRevealHeld() {
  return useContext(HeroRevealHeldContext);
}
