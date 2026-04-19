import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { type Session, formatDate } from "@/lib/sessionsStore";
import { cn } from "@/lib/utils";

interface Props {
  sessions: Session[];
}

const TimelineNode = memo(({ session }: { session: Session }) => {
  const [open, setOpen] = useState(false);
  const total = session.members.length;
  const present = session.members.filter((m) => m.present).length;
  const ratio = total ? Math.round((present / total) * 100) : 0;

  return (
    <li className="relative pl-10 sm:pl-12">
      {/* Node dot */}
      <div className="absolute left-0 top-3 flex flex-col items-center">
        <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-glow-red ring-4 ring-background" />
      </div>

      <div className="surface-card rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-secondary/30 transition-smooth"
        >
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
              {formatDate(session.createdAt)}
            </p>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight truncate">
              {session.title || "Untitled session"}
            </h3>
            {session.host && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                <span className="font-mono uppercase tracking-widest text-muted-foreground/60 mr-1.5 text-[9px]">Host</span>
                {session.host}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Rate</p>
            <p className="font-mono text-xl font-semibold tabular-nums text-gradient-red leading-none mt-0.5">
              {ratio}<span className="text-muted-foreground/40 text-xs">%</span>
            </p>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform shrink-0",
              open && "rotate-90",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden border-t border-border/60"
              style={{ willChange: "height, opacity" }}
            >
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {present}<span className="text-muted-foreground/40">/{total}</span> present
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${ratio}%` }} />
                  </div>
                </div>

                {session.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {session.summary}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {session.members.slice(0, 12).map((m) => (
                    <span
                      key={m.id}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-mono",
                        m.present
                          ? "bg-present/10 text-present border border-present/20"
                          : "bg-muted/40 text-muted-foreground/70 border border-border line-through",
                      )}
                    >
                      {m.name}
                    </span>
                  ))}
                  {session.members.length > 12 && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-secondary text-muted-foreground border border-border">
                      +{session.members.length - 12}
                    </span>
                  )}
                </div>

                <Link
                  to={`/session/${session.id}`}
                  className="inline-flex items-center gap-1.5 mt-2 h-9 px-3.5 rounded-full bg-foreground text-background text-[11px] font-medium transition-spring hover:scale-[1.03]"
                >
                  Open session <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
});
TimelineNode.displayName = "TimelineNode";

const Timeline = ({ sessions }: Props) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <span className="absolute left-[6px] sm:left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" aria-hidden />
      <ol className="space-y-4">
        {sessions.map((s) => (
          <TimelineNode key={s.id} session={s} />
        ))}
      </ol>
    </div>
  );
};

export default memo(Timeline);
