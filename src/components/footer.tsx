"use client";

import Image from "next/image";
import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";

const copyrightYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto w-full pb-4 pt-16">
      <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="sr-only">Silver Studios home</span>
            <Image
              src="/Logos/silverui-l.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 dark:hidden"
            />
            <Image
              src="/Logos/silverui-d.svg"
              alt=""
              width={32}
              height={32}
              className="hidden size-8 dark:block"
            />
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
              Silver Studios
            </span>
          </Link>

          <div className="flex justify-start sm:justify-end">
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <div className="mt-8 w-full border-t border-zinc-200 dark:border-zinc-800" />

      <p className="mt-4 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400 sm:px-6 lg:px-8">
        © {copyrightYear} Silver Studios. All rights reserved.
      </p>
    </footer>
  );
}
