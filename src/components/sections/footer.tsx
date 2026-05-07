"use client";

import Image from "next/image";
import Link from "next/link";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { footer as footerData, site } from "@/data/site";

const copyrightYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto w-full pb-4 pt-16">
      <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href={site.homeHref}
          className="flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="sr-only">{site.homeSrLabel}</span>
          <Image
            src={site.logo.lightSrc}
            alt=""
            width={site.logo.width}
            height={site.logo.height}
            className="size-8 dark:hidden"
          />
          <Image
            src={site.logo.darkSrc}
            alt=""
            width={site.logo.width}
            height={site.logo.height}
            className="hidden size-8 dark:block"
          />
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
            {site.name}
          </span>
        </Link>
      </div>

      <div className="mt-8 w-full border-t border-zinc-200 dark:border-zinc-800" />

      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <p className="min-w-0 text-left text-xs text-zinc-500 dark:text-zinc-400">
          © {copyrightYear} {footerData.copyrightOrg}.{" "}
          {footerData.copyrightSuffix}
        </p>
        <div className="shrink-0">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
