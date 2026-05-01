import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeId = "parchment" | "arctic" | "ivory" | "obsidian" | "clickhouse";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  isDark: boolean;
  accent: string;
  bg: string;
  surface: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "parchment",
    name: "Warm Parchment",
    tagline: "Editorial luxury",
    isDark: false,
    accent: "#c1440e",
    bg: "#fdf6ed",
    surface: "#f5e8d4",
  },
  {
    id: "arctic",
    name: "Arctic Oxide",
    tagline: "Cold precision",
    isDark: false,
    accent: "#0050b3",
    bg: "#eef3f8",
    surface: "#dce8f0",
  },
  {
    id: "ivory",
    name: "Light Ivory",
    tagline: "Clean & premium",
    isDark: false,
    accent: "#0071e3",
    bg: "#f5f5f7",
    surface: "#ffffff",
  },
  {
    id: "obsidian",
    name: "Obsidian Glass",
    tagline: "Premium dark depth",
    isDark: true,
    accent: "#6e7eff",
    bg: "#0d0d14",
    surface: "#16161e",
  },
  {
    id: "clickhouse",
    name: "Volt Graphite",
    tagline: "High-contrast data core",
    isDark: true,
    accent: "#FFCC00",
    bg: "#0A0A0A",
    surface: "#1A1C1E",
  },
];

const KEY = "bec.dev.theme";
const DEFAULT_THEME: ThemeId = "parchment";

interface Ctx {
  theme: ThemeId;
  meta: ThemeMeta;
  setTheme: (t: ThemeId) => void;
}

const ThemeCtx = createContext<Ctx | null>(null);

const isValidTheme = (t: string | null): t is ThemeId =>
  t === "parchment" || t === "arctic" || t === "ivory" || t === "obsidian" || t === "clickhouse";

const apply = (t: ThemeId) => {
  const root = document.documentElement;
  const meta = THEMES.find((m) => m.id === t)!;
  
  const updateDOM = () => {
    root.classList.remove("parchment", "arctic", "ivory", "obsidian", "clickhouse");
    root.classList.add(t);
    root.style.colorScheme = meta.isDark ? "dark" : "light";
    root.setAttribute("data-theme", t);
  };

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      updateDOM();
    });
  } else {
    updateDOM();
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME;
    const stored = localStorage.getItem(KEY);
    return isValidTheme(stored) ? stored : DEFAULT_THEME;
  });

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: ThemeId) => setThemeState(t), []);
  const meta = useMemo(() => THEMES.find((m) => m.id === theme)!, [theme]);
  const value = useMemo(() => ({ theme, meta, setTheme }), [theme, meta, setTheme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
