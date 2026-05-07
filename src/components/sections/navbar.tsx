"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/#pricing", label: "Pricing" },
] as const;

const talkNowButtonClass = "talk-now-btn rounded-[4px]";

const navLinkClass =
  "group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-[4px] px-3 text-sm font-medium leading-none text-zinc-600 transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-[4px] before:bg-zinc-100 before:transition-[transform] before:duration-300 before:ease-out before:content-[''] hover:text-zinc-900 hover:before:scale-x-100 motion-reduce:before:duration-0 dark:text-zinc-400 dark:before:bg-zinc-800 dark:hover:text-zinc-50";

const navLinkMobileClass =
  "group relative block overflow-hidden rounded-[4px] px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-[4px] before:bg-zinc-100 before:transition-[transform] before:duration-300 before:ease-out before:content-[''] hover:text-zinc-900 hover:before:scale-x-100 motion-reduce:before:duration-0 dark:text-zinc-300 dark:before:bg-zinc-800 dark:hover:text-zinc-50";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-2 z-50 mt-1 w-full px-2">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[4px] bg-white text-zinc-900 ring-1 ring-zinc-200/70 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(15,23,42,0.04),0_2px_8px_rgba(15,23,42,0.05),0_6px_16px_rgba(15,23,42,0.05),0_12px_24px_rgba(15,23,42,0.04)] dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.25),0_6px_16px_rgba(0,0,0,0.2),0_12px_24px_rgba(0,0,0,0.15)]">
        <nav className="relative flex min-h-[3.25rem] items-center justify-between gap-3 px-2 py-2 sm:min-h-14">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1 transition-opacity hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Silver Studios home</span>
            <Image
              src="/Logos/silverui-l.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 dark:hidden"
              priority
            />
            <Image
              src="/Logos/silverui-d.svg"
              alt=""
              width={32}
              height={32}
              className="hidden size-8 dark:block"
            />
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl [font-family:var(--font-ibm-plex-sans)]">
              Silver Studios
            </span>
          </Link>

          <div className="flex h-9 shrink-0 items-center gap-2 md:gap-3">
            <ul className="hidden h-9 items-center gap-1 md:flex">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={navLinkClass}>
                    <span className="relative z-10">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/#talk-now"
              className={`${talkNowButtonClass} hidden h-9 !leading-none items-center justify-center px-4 md:inline-flex`}
            >
              BOOK A CALL
            </Link>

            <button
              type="button"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        <div
          id="mobile-nav"
          className={`rounded-b-[4px] border-t border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden ${open ? "block" : "hidden"}`}
        >
          <ul className="flex flex-col gap-1 px-2 py-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={navLinkMobileClass}
                  onClick={() => setOpen(false)}
                >
                  <span className="relative z-10">{label}</span>
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <Link
                href="/#talk-now"
                className={`${talkNowButtonClass} block py-2.5 text-center`}
                onClick={() => setOpen(false)}
              >
                BOOK A CALL
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
