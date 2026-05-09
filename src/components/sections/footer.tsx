"use client";

import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { footer as footerData, site } from "@/data/site";

const copyrightYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border/80 pt-14 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-2 sm:py-4 lg:py-6">
          <div className="grid gap-10">
            <div className="space-y-5">
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
                <span className="text-lg font-semibold tracking-tight text-foreground [font-family:var(--font-ibm-plex-sans)]">
                  {site.name}
                </span>
              </Link>

              <div className="flex items-center gap-2.5">
                <a
                  href="mailto:saraswatrajat12@gmail.com"
                  aria-label="Email"
                  className="inline-flex size-10 items-center justify-center rounded-[4px] border border-border/70 bg-muted/40 text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
                >
                  <FaEnvelope className="size-4" />
                </a>
                <a
                  href="https://x.com/silver_srs"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="inline-flex size-10 items-center justify-center rounded-[4px] border border-border/70 bg-muted/40 text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
                >
                  <FaXTwitter className="size-4" />
                </a>
                <a
                  href="https://discord.com/users/rajat_28969"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  className="inline-flex size-10 items-center justify-center rounded-[4px] border border-border/70 bg-muted/40 text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
                >
                  <FaDiscord className="size-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 w-full border-t border-border/80" />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="min-w-0 text-left text-xs text-muted-foreground">
          © {copyrightYear} {footerData.copyrightOrg}.{" "}
          {footerData.copyrightSuffix}
        </p>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <ul className="flex items-center gap-4">
            {footerData.legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
