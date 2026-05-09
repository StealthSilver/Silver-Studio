"use client";

import { HeroEntry } from "@/components/ui/hero-entry";
import { hero } from "@/data/site";

export function Hero() {
  return <HeroEntry {...hero} splashRevealBypass />;
}
