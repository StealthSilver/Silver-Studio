"use client";

import type { ReactNode } from "react";

import { AmbientMusicProvider } from "@/components/ambient-music";
import { PageClickSound } from "@/components/page-click-sound";
import { ThemeProvider } from "@/components/theme-provider";
import { ZoomNeutralizer } from "@/components/zoom-neutralizer";
import { BookingModalProvider } from "@/context/booking-modal-context";
import { SplashInteractiveProvider } from "@/context/splash-interactive-context";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ZoomNeutralizer />
      <PageClickSound />
      <SplashInteractiveProvider>
        <BookingModalProvider>
          <AmbientMusicProvider>{children}</AmbientMusicProvider>
        </BookingModalProvider>
      </SplashInteractiveProvider>
    </ThemeProvider>
  );
}
