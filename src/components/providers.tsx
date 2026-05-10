"use client";

import type { ReactNode } from "react";

import { AmbientMusicProvider } from "@/components/ambient-music";
import { PageClickSound } from "@/components/page-click-sound";
import { ThemeProvider } from "@/components/theme-provider";
import { ZoomNeutralizer } from "@/components/zoom-neutralizer";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ZoomNeutralizer />
      <PageClickSound />
      <AmbientMusicProvider>{children}</AmbientMusicProvider>
    </ThemeProvider>
  );
}
