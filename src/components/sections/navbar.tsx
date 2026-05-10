"use client";

import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { useAmbientMusic } from "@/components/ambient-music";
import {
  HERO_PRIMARY_CTA_WRAP_CLASSNAME,
  LetterWaveLink,
} from "@/components/ui/letter-wave-link";
import { navbar as navbarData, site } from "@/data/site";
import {
  consumePendingNavScrollPercent,
  scrollToDocumentPercent,
  setPendingNavScrollPercent,
} from "@/lib/scroll-document-percent";
import { cn } from "@/lib/utils";

const { links, cta } = navbarData;

const talkNowButtonClass = "talk-now-btn rounded-[4px]";

const navLinkClass =
  "group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-[4px] px-3 text-sm font-medium leading-none text-muted-foreground transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-[4px] before:bg-accent before:transition-[transform] before:duration-300 before:ease-out before:content-[''] hover:text-foreground hover:before:scale-x-100 motion-reduce:before:duration-0";

const navLinkMobileClass =
  "group relative block overflow-hidden rounded-[4px] px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:rounded-[4px] before:bg-accent before:transition-[transform] before:duration-300 before:ease-out before:content-[''] hover:text-foreground hover:before:scale-x-100 motion-reduce:before:duration-0";

const SCROLL_THRESHOLD_PX = 8;

function subscribeScroll(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify, { passive: true });
  return () => {
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
}

/** Snapshot "scrolledFlag|percent" for stable Object.is comparison */
function getScrollSnapshot(): string {
  const el = document.documentElement;
  const y = window.scrollY;
  const maxScroll = Math.max(0, el.scrollHeight - window.innerHeight);
  const pct =
    maxScroll === 0 ? 0 : Math.min(100, Math.round((y / maxScroll) * 100));
  const scrolled = y > SCROLL_THRESHOLD_PX ? 1 : 0;
  return `${scrolled}|${pct}`;
}

function serverScrollSnapshot() {
  return "0|0";
}

const scrollGaugeClass =
  "inline-flex h-9 min-w-[3.25rem] shrink-0 items-center justify-center rounded-[4px] border border-border/90 bg-secondary px-2 text-xs font-semibold tabular-nums text-foreground";

const navMusicButtonClass =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-border/90 bg-secondary text-muted-foreground transition-[color,background-color,border-color,box-shadow] duration-200 hover:bg-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function NavMusicEqualizer() {
  return (
    <span
      className="flex h-[14px] w-[18px] items-end justify-center gap-[3px]"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-[3px] origin-bottom rounded-full bg-current will-change-transform"
          initial={false}
          animate={{ scaleY: [0.35, 1, 0.45, 0.82, 0.35] }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
          style={{ height: 11 }}
        />
      ))}
    </span>
  );
}

function NavMusicButton({ reducedMotion }: { reducedMotion: boolean }) {
  const { musicOn, toggleMusic } = useAmbientMusic();

  return (
    <button
      type="button"
      className={cn(
        navMusicButtonClass,
        musicOn && "border-primary/45 text-primary ring-1 ring-primary/25",
      )}
      aria-pressed={musicOn}
      aria-label={musicOn ? "Pause site music" : "Play site music"}
      onClick={toggleMusic}
    >
      {musicOn && !reducedMotion ? (
        <NavMusicEqualizer />
      ) : musicOn ? (
        <Volume2 className="size-[17px]" strokeWidth={2} aria-hidden />
      ) : (
        <VolumeX className="size-[17px]" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}

const menuMorphTransition = {
  type: "spring" as const,
  stiffness: 460,
  damping: 34,
};

/** Mobile dropdown: panel + link rows reveal (matches “slow, one-by-one” request) */
const MOBILE_MENU_EASE = [0.22, 1, 0.36, 1] as const;
const MOBILE_MENU_PANEL_DURATION_S = 0.42;
const MOBILE_MENU_STAGGER_BETWEEN_ITEMS_S = 0.11;
const MOBILE_MENU_DELAY_BEFORE_FIRST_ITEM_S = 0.18;
const MOBILE_MENU_ITEM_DURATION_S = 0.52;

function MobileMenuMorphIcon({
  open,
  reducedMotion,
}: {
  open: boolean;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return (
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
    );
  }

  const lineClass = "block h-0.5 w-5 shrink-0 origin-center rounded-full bg-current shadow-none";
  /** Echo nav letter-wave cadence: bars resolve in sequence when opening / closing */
  const topDelay = open ? 0 : 0.07;
  const midDelay = open ? 0.035 : 0.035;
  const botDelay = open ? 0.07 : 0;

  return (
    <span className="flex h-5 w-5 shrink-0 flex-col items-center justify-center gap-[5px]" aria-hidden>
      <motion.span
        className={lineClass}
        initial={false}
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 7 : 0,
        }}
        transition={{ ...menuMorphTransition, delay: topDelay }}
      />
      <motion.span
        className={lineClass}
        initial={false}
        animate={{
          scaleX: open ? 0 : 1,
          opacity: open ? 0 : 1,
        }}
        transition={{
          ...menuMorphTransition,
          stiffness: 520,
          damping: 28,
          delay: midDelay,
        }}
      />
      <motion.span
        className={lineClass}
        initial={false}
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -7 : 0,
        }}
        transition={{ ...menuMorphTransition, delay: botDelay }}
      />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion() === true;

  const [open, setOpen] = useState(false);
  const scrollSnap = useSyncExternalStore(
    subscribeScroll,
    getScrollSnapshot,
    serverScrollSnapshot,
  );

  const { scrolled, scrollPercent } = useMemo(() => {
    const [s, p] = scrollSnap.split("|");
    return {
      scrolled: s === "1",
      scrollPercent: Number(p) || 0,
    };
  }, [scrollSnap]);

  useEffect(() => {
    if (!scrolled) setOpen(false);
  }, [scrolled]);

  const scrollBehavior: ScrollBehavior = prefersReducedMotion
    ? "auto"
    : "smooth";

  useEffect(() => {
    if (pathname !== "/") return;
    const pending = consumePendingNavScrollPercent();
    if (pending == null) return;
    const run = () => scrollToDocumentPercent(pending, scrollBehavior);
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, [pathname, scrollBehavior]);

  const handleSectionNavClick = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    scrollPercent: number,
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToDocumentPercent(scrollPercent, scrollBehavior);
      return;
    }
    e.preventDefault();
    setPendingNavScrollPercent(scrollPercent);
    router.push("/");
  };

  const desktopLinks = (
    <ul className="hidden h-9 items-center gap-1 md:flex">
      {links.map(({ href, label, scrollPercent }) => (
        <li key={href}>
          <LetterWaveLink
            href={href}
            className={navLinkClass}
            label={label}
            variant="nav"
            onClick={(e) => handleSectionNavClick(e, scrollPercent)}
          />
        </li>
      ))}
    </ul>
  );

  const menuButton = (
    <button
      type="button"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setOpen((v) => !v)}
    >
      <MobileMenuMorphIcon
        open={open}
        reducedMotion={prefersReducedMotion}
      />
    </button>
  );

  const scrollPercentButton = (
    <span
      role="status"
      aria-live="polite"
      aria-label={`Page scrolled ${scrollPercent} percent`}
      className={scrollGaugeClass}
    >
      {scrollPercent}%
    </span>
  );

  /** Scroll % only after the header has switched to the “scrolled” layout */
  const menuToolbarScrolled = (
    <div className="flex items-center gap-2">
      {menuButton}
      {scrollPercentButton}
      <NavMusicButton reducedMotion={prefersReducedMotion} />
    </div>
  );

  const menuToolbarUnscrolledMobile = (
    <div className="flex items-center gap-2">
      {menuButton}
      <NavMusicButton reducedMotion={prefersReducedMotion} />
    </div>
  );

  const menuListVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: {},
        visible: {},
      };
    }
    return {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: MOBILE_MENU_STAGGER_BETWEEN_ITEMS_S,
          delayChildren: MOBILE_MENU_DELAY_BEFORE_FIRST_ITEM_S,
        },
      },
    };
  }, [prefersReducedMotion]);

  const menuItemVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: {},
        visible: {},
      };
    }
    return {
      hidden: { opacity: 0, y: 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: MOBILE_MENU_ITEM_DURATION_S,
          ease: MOBILE_MENU_EASE,
        },
      },
    };
  }, [prefersReducedMotion]);

  /** Fixed, viewport-centered panel just below the navbar (mobile + desktop when scrolled) */
  const overlayMenuPanel = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          key="mobile-nav-panel"
          role="region"
          aria-label="Navigation menu"
          className={cn(
            "fixed left-1/2 z-[60] w-[min(200px,calc(100vw-2rem))] max-w-[200px] -translate-x-1/2 overflow-hidden border border-border bg-background shadow-md",
            "rounded-[4px]",
            "top-[calc(var(--site-header-height)+0.5rem+0.375rem)]",
            !scrolled && "md:hidden",
          )}
          {...(prefersReducedMotion
            ? {
                initial: { opacity: 1 },
                animate: { opacity: 1 },
                exit: { opacity: 0, transition: { duration: 0 } },
              }
            : {
                initial: { opacity: 0, y: -12, scale: 0.97 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: {
                  opacity: 0,
                  y: -8,
                  scale: 0.98,
                  transition: {
                    duration: 0.24,
                    ease: [0.4, 0, 1, 1] as const,
                  },
                },
                transition: {
                  duration: MOBILE_MENU_PANEL_DURATION_S,
                  ease: MOBILE_MENU_EASE,
                },
              })}
        >
          <motion.ul
            className="flex flex-col gap-0 px-1 py-1 text-center"
            variants={menuListVariants}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate="visible"
          >
            {links.map(({ href, label, scrollPercent }) => (
              <motion.li
                key={href}
                variants={menuItemVariants}
                className="border-b border-border/60 last:border-b-0"
              >
                <LetterWaveLink
                  href={href}
                  className={cn(
                    navLinkMobileClass,
                    "rounded-none text-center before:rounded-none hover:before:rounded-none",
                  )}
                  label={label}
                  onClick={(e) => {
                    handleSectionNavClick(e, scrollPercent);
                    setOpen(false);
                  }}
                  centerInContainer
                  variant="nav"
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className="sticky top-2 z-50 mt-1 w-full px-2">
      <div
        className={cn(
          "mx-auto rounded-[4px] bg-transparent text-foreground transition-[max-width,box-shadow] duration-300 ease-out motion-reduce:transition-none",
          scrolled
            ? "max-w-full overflow-visible shadow-none ring-0 dark:shadow-none"
            : "max-w-7xl max-md:overflow-visible md:overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(15,23,42,0.04),0_2px_8px_rgba(15,23,42,0.05),0_6px_16px_rgba(15,23,42,0.05),0_12px_24px_rgba(15,23,42,0.04)] ring-1 ring-border/70 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.25),0_6px_16px_rgba(0,0,0,0.2),0_12px_24px_rgba(0,0,0,0.15)] dark:ring-border/85",
        )}
      >
        <nav
          className={cn(
            "relative flex min-h-[3.25rem] items-center gap-3 px-2 py-2 sm:min-h-14",
            scrolled
              ? "justify-between md:grid md:w-full md:grid-cols-[1fr_auto_1fr] md:items-center"
              : "justify-between",
          )}
        >
          <Link
            href={site.homeHref}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1 text-inherit no-underline",
              scrolled && "md:justify-self-start",
            )}
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{site.homeSrLabel}</span>
            <Image
              src={site.logo.lightSrc}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              className="size-8 dark:hidden"
              priority
            />
            <Image
              src={site.logo.darkSrc}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              className="hidden size-8 dark:block"
            />
            <span className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {site.name}
            </span>
          </Link>

          {scrolled ? (
            <>
              <div className="flex flex-1 justify-center md:flex-none md:justify-self-center">
                {menuToolbarScrolled}
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center md:justify-self-end",
                  scrolled && "min-w-0 md:min-w-[1px]",
                )}
              >
                <span
                  className={cn(HERO_PRIMARY_CTA_WRAP_CLASSNAME, "shrink-0")}
                >
                  <LetterWaveLink
                    href={cta.href}
                    className={cn(
                      `${talkNowButtonClass} inline-flex h-9 !leading-none shrink-0 items-center justify-center px-4`,
                      "max-md:max-w-[min(108px,calc((100vw-10rem)-1rem))] max-md:truncate max-md:!px-2.5 max-md:text-[clamp(10px,2.85vw,0.75rem)]",
                    )}
                    label={cta.label}
                    onClick={() => setOpen(false)}
                  />
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-9 shrink-0 items-center gap-2 md:gap-3">
              {desktopLinks}
              <div className="hidden h-9 items-center gap-2 md:flex">
                <NavMusicButton reducedMotion={prefersReducedMotion} />
              </div>
              <span
                className={cn(
                  HERO_PRIMARY_CTA_WRAP_CLASSNAME,
                  "hidden shrink-0 md:inline-block",
                )}
              >
                <LetterWaveLink
                  href={cta.href}
                  className={`${talkNowButtonClass} h-9 !leading-none items-center justify-center px-4 md:inline-flex`}
                  label={cta.label}
                />
              </span>
              <div className="md:hidden">{menuToolbarUnscrolledMobile}</div>
            </div>
          )}
        </nav>

        {overlayMenuPanel}
      </div>
    </header>
  );
}
