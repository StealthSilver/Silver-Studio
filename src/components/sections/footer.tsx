"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { FaDiscord, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { BlurRevealWordsInView } from "@/components/ui/hero-reveal";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { footer as footerData, navbar, site } from "@/data/site";
import { STANDARD_ICON_BUTTON_CLASS } from "@/lib/standard-icon-button";
import { cn } from "@/lib/utils";

const copyrightYear = new Date().getFullYear();

const linkBase =
  "rounded-[4px] text-sm font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Social / mail icon targets — same frame as testimonial arrows & theme chips */
const socialButtonClass = cn(STANDARD_ICON_BUTTON_CLASS, "[&_svg]:size-[15px]");

function SocialIcon({ network }: { network: "x" | "discord" }) {
  if (network === "x") {
    return <FaXTwitter aria-hidden />;
  }
  return <FaDiscord aria-hidden />;
}

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion === true;
  const mailto = `mailto:${footerData.contactEmail}`;
  const copyrightCopy = `© ${copyrightYear} ${footerData.copyrightOrg}. ${footerData.copyrightSuffix}`;

  return (
    <footer
      className={cn(
        "relative mt-auto w-full overflow-hidden border-t border-border/70",
        "bg-gradient-to-b from-muted/35 via-background to-background",
        "dark:border-border/50 dark:from-muted/15 dark:via-background dark:to-background",
      )}
      aria-label="Site footer"
    >
      {/* Soft silver wash — echoes hero language without competing */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(90%_100%_at_50%_100%,var(--hero-silver-2)_0%,transparent_65%)] opacity-70 dark:opacity-40"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Brand + social */}
          <div className="flex max-w-sm flex-col gap-4">
            <Link
              href={site.homeHref}
              className="group flex w-fit items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="sr-only">{site.homeSrLabel}</span>
              <span className="relative flex size-9 shrink-0 items-center justify-center">
                <Image
                  src={site.logo.lightSrc}
                  alt=""
                  width={site.logo.width}
                  height={site.logo.height}
                  className="size-7 dark:hidden"
                />
                <Image
                  src={site.logo.darkSrc}
                  alt=""
                  width={site.logo.width}
                  height={site.logo.height}
                  className="hidden size-7 dark:block"
                />
              </span>
              <span className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
                <BlurRevealWordsInView text={site.name} reduced={reduced} />
              </span>
            </Link>

            <div
              className="flex flex-wrap items-center gap-2"
              aria-label="Social and email"
            >
              {footerData.social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.ariaLabel}
                  className={socialButtonClass}
                >
                  <SocialIcon network={item.network} />
                </a>
              ))}
              <a
                href={mailto}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Email ${footerData.contactEmail}`}
                className={socialButtonClass}
              >
                <FaEnvelope aria-hidden />
              </a>
            </div>
          </div>

          {/* Section links — vertical stack */}
          <nav
            aria-label="Footer navigation"
            className="flex w-full shrink-0 flex-col gap-1 lg:w-auto lg:items-end lg:pt-0.5"
          >
            <ul className="flex flex-col items-start gap-1.5 sm:gap-2 lg:items-end">
              {navbar.links.map((link, linkIndex) => (
                <li key={link.href} className="w-full lg:w-auto lg:text-right">
                  <Link
                    href={link.href}
                    className={cn(linkBase, "inline-block px-0.5 py-0.5")}
                  >
                    <BlurRevealWordsInView
                      text={link.label}
                      reduced={reduced}
                      startDelayMs={linkIndex * 60}
                      viewport={{
                        once: true,
                        amount: "some",
                        margin: "0px 0px -12% 0px",
                      }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Full-bleed rule; © row stays max-w-7xl */}
      <div className="relative mt-8 w-full border-t border-border/45 dark:border-border/35">
        <div className="mx-auto w-full max-w-7xl px-4 pb-3 pt-5 sm:px-6 sm:pb-4 lg:px-8 lg:pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <p className="text-[0.8125rem] leading-snug text-muted-foreground">
              <BlurRevealWordsInView text={copyrightCopy} reduced={reduced} />
            </p>
            <div className="flex shrink-0 items-center sm:ml-auto">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
