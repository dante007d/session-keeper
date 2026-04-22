import { memo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "@/lib/theme";
import { cn } from "@/lib/utils";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label="Select theme"
        className={cn(
          "inline-flex items-center gap-2 h-8 px-3 rounded-full border transition-smooth text-[11px] font-mono uppercase tracking-wider",
          open
            ? "bg-primary/10 border-primary/40 text-foreground"
            : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
        )}
      >
        <Palette className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl surface-card p-2 z-50 overflow-hidden"
          >
            <p className="px-3 pt-2 pb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Choose theme
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-smooth",
                  theme === t.id
                    ? "bg-primary/10"
                    : "hover:bg-secondary/60"
                )}
              >
                {/* Color swatch preview */}
                <div
                  className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ backgroundColor: t.bg }}
                >
                  <div
                    className="w-4 h-2 rounded-sm"
                    style={{ backgroundColor: t.accent }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">{t.tagline}</p>
                </div>

                {theme === t.id && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ThemeSelector);
