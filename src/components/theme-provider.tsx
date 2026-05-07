"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "theme";

type ThemeName = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeName | undefined;
  setTheme: (theme: ThemeName) => void;
  resolvedTheme: "light" | "dark" | undefined;
  themes: string[];
  systemTheme: "light" | "dark" | undefined;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName | undefined>(undefined);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark" | undefined>(
    undefined,
  );

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeName | null) ?? "system";
    setSystemTheme(getSystemTheme());
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    if (theme === undefined) return;
    applyTheme(theme);
  }, [theme, systemTheme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = getSystemTheme();
      setSystemTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;
      const next = e.newValue as ThemeName;
      setThemeState(next);
      applyTheme(next);
      setSystemTheme(getSystemTheme());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next);
    setSystemTheme(getSystemTheme());
  }, []);

  const resolvedTheme = useMemo(() => {
    if (theme === undefined || systemTheme === undefined) return undefined;
    return theme === "system" ? systemTheme : theme;
  }, [theme, systemTheme]);

  const value = useMemo(
    (): ThemeContextValue => ({
      theme,
      setTheme,
      resolvedTheme,
      themes: ["light", "dark", "system"],
      systemTheme,
    }),
    [theme, setTheme, resolvedTheme, systemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: undefined,
      setTheme: () => {},
      resolvedTheme: undefined,
      themes: [] as string[],
      systemTheme: undefined,
    };
  }
  return {
    ...ctx,
    setTheme: (t: string) => ctx.setTheme(t as ThemeName),
  };
}
