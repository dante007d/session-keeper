import { memo } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative h-8 w-8 rounded-full bg-secondary/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-smooth overflow-hidden"
    >
      <motion.span
        key={theme}
        initial={{ y: 12, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: -12, opacity: 0, rotate: 30 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ willChange: "transform, opacity" }}
      >
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </motion.span>
    </button>
  );
};

export default memo(ThemeToggle);
