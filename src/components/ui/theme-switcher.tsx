"use client";

import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { JSX } from "react";

import { useTheme } from "@/components/theme-provider";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";
import { switch007Sound } from "@/sounds/switch-007";

type ThemeValue = "light" | "dark" | "system";

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
  reducedMotion,
}: {
  icon: JSX.Element;
  value: string;
  isActive?: boolean;
  onClick: (value: ThemeValue) => void;
  reducedMotion: boolean;
}) {
  return (
    <button
      className={cn(
        "relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[4px] [&_svg]:size-4",
        "transition-[color,background-color]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !isActive &&
          "text-muted-foreground hover:bg-accent hover:text-foreground",
        isActive && "text-foreground",
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value as ThemeValue)}
      type="button"
    >
      {isActive &&
        (reducedMotion ? (
          <span
            className="absolute inset-0 rounded-[4px] bg-accent"
            aria-hidden
          />
        ) : (
          <motion.div
            layoutId="theme-option"
            transition={{ type: "spring", bounce: 0.28, duration: 0.55 }}
            className="absolute inset-0 rounded-[4px] bg-accent"
            aria-hidden
          />
        ))}
      <span className="relative z-10 flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
}

const THEME_OPTIONS = [
  {
    icon: <MonitorIcon />,
    value: "system",
  },
  {
    icon: <SunIcon />,
    value: "light",
  },
  {
    icon: <MoonStarIcon />,
    value: "dark",
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion() === true;
  const reducedMotion = prefersReducedMotion;
  const [playSwitch] = useSound(switch007Sound, {
    soundEnabled: !prefersReducedMotion,
  });

  const handleThemeSelect = (value: ThemeValue) => {
    playSwitch();
    setTheme(value);
  };

  if (theme === undefined) {
    return (
      <div
        className="h-8 w-[6.25rem] shrink-0 rounded-[4px] border border-border/60 bg-background/80 shadow-sm"
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-0.5 rounded-[4px] border border-border bg-background p-0.5 shadow-sm"
      role="radiogroup"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={handleThemeSelect}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  );
}

export { ThemeSwitcher };
