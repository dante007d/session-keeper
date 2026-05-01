import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SHORTCUTS = [
  { key: "⌘ K", action: "Open command palette" },
  { key: "⌘ N", action: "Create new session" },
  { key: "⌘ /", action: "Toggle dark mode" },
  { key: "ESC", action: "Close / Go back" },
  { key: "?", action: "Show keyboard shortcuts" },
];

export function ShortcutHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/20 backdrop-blur-sm z-[250]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-10 z-[251] w-72 bg-card border border-border shadow-2xl rounded-[2rem] p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
               <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                 <X size={16} />
               </button>
            </div>

            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-6">
              Keyboard Shortcuts
            </p>

            <div className="space-y-4">
              {SHORTCUTS.map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{action}</span>
                  <kbd className="font-mono text-[10px] bg-secondary px-2.5 py-1 rounded-lg border border-border text-primary font-bold">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/40">
              <p className="text-[10px] text-muted-foreground font-medium italic">
                Press ? anytime to view these shortcuts.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
