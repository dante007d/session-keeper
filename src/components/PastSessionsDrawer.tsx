import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSessions, formatDate } from "@/lib/sessionsStore";

const PastSessionsDrawer = () => {
  const { sessions } = useSessions();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Past sessions"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/40 border border-border text-muted-foreground hover:text-foreground hover:border-white/15 transition-smooth"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Past</span>
          <span className="font-mono text-[10px] tabular-nums text-foreground/80">
            {String(sessions.length).padStart(2, "0")}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-border bg-background overflow-hidden flex flex-col [&>button]:hidden"
      >
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.08] to-transparent pointer-events-none" aria-hidden />

        {/* Header */}
        <div className="relative px-6 pt-7 pb-5 border-b border-border/60 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
              ARCHIVE
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Past Sessions</h2>
            <p className="text-xs text-muted-foreground mt-1.5 font-mono">
              {sessions.length} {sessions.length === 1 ? "entry" : "entries"} · stored locally
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="h-9 w-9 rounded-full bg-secondary/60 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="relative flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-dot text-2xl text-muted-foreground/40 tracking-widest mb-3">— EMPTY —</p>
              <p className="text-sm text-muted-foreground">No sessions yet.</p>
              <Link
                to="/new"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 mt-5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium transition-spring hover:scale-[1.03] shadow-glow-red"
              >
                <Plus className="h-3.5 w-3.5" /> Create first
              </Link>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {sessions.map((s, i) => {
                const total = s.members.length;
                const present = s.members.filter((m) => m.present).length;
                const ratio = total ? Math.round((present / total) * 100) : 0;
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1], delay: i * 0.03 }}
                  >
                    <Link
                      to={`/session/${s.id}`}
                      onClick={() => setOpen(false)}
                      className="group block surface-card rounded-2xl p-5 transition-smooth hover:border-primary/30 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
                            {formatDate(s.createdAt)}
                          </p>
                          <h3 className="text-[15px] font-semibold tracking-tight truncate">
                            {s.title || "Untitled session"}
                          </h3>
                          {s.host && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              <span className="font-mono uppercase tracking-widest text-muted-foreground/70 mr-1.5 text-[9px]">Host</span>
                              {s.host}
                            </p>
                          )}
                        </div>
                        <span className="flex-shrink-0 h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-spring group-hover:rotate-45">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {present}<span className="text-muted-foreground/40">/{total}</span>
                          </span>
                          <div className="h-1 w-20 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${ratio}%` }} />
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold tabular-nums text-gradient-red">
                          {ratio}%
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="relative px-6 py-4 border-t border-border/60 flex items-center justify-between">
          <p className="font-dot text-base text-muted-foreground/40 tracking-widest select-none">BEC·DEV</p>
          <Link
            to="/new"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-foreground text-background text-[11px] font-medium transition-spring hover:scale-[1.03]"
          >
            <Plus className="h-3 w-3" /> New
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PastSessionsDrawer;
