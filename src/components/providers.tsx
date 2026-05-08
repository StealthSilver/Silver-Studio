"use client";

import type { ReactNode } from "react";

import { PageClickSound } from "@/components/page-click-sound";
import { PageInitialLoader } from "@/components/page-initial-loader";
import { ThemeProvider } from "@/components/theme-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <PageClickSound />
      <PageInitialLoader>{children}</PageInitialLoader>
    </ThemeProvider>
  );
}
