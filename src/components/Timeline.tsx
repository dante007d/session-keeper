import { memo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import anime from "@/lib/anime";
import { animateTimeline } from "@/animations/timelineAnimations";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { type Session, formatDate } from "@/lib/sessionsStore";
import { cn } from "@/lib/utils";
import { TagChip } from "./ArtisticElements";

interface Props {
  sessions: Session[];
}

const TimelineNode = memo(({ session, index }: { session: Session; index: number }) => {
  const [open, setOpen] = useState(false);
  const total = session.members.length;
  const present = session.members.filter((m) => m.present).length;
  const ratio = total ? Math.round((present / total) * 100) : 0;
  const nodeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    anime({
      targets: nodeRef.current,
      opacity: [0, 1],
      translateX: [-10, 0],
      duration: 500,
      delay: index * 100,
      easing: 'easeOutQuad'
    });
  }, [index]);

  return (
    <li 
      ref={nodeRef}
      className="timeline-card relative pl-12 sm:pl-16 mb-8 last:mb-0 opacity-0"
    >
      <div className="absolute left-[5px] sm:left-[6px] top-6 -translate-x-1/2 z-10">
        <div 
          className="timeline-dot h-4 w-4 rounded-full bg-background border-2 border-primary flex items-center justify-center opacity-0"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        {index === 0 && (
          <div className="absolute inset-0 h-4 w-4 rounded-full bg-primary animate-ping opacity-40 -z-10" />
        )}
      </div>

      <div className={cn(
        "surface-card rounded-[1.5rem] overflow-hidden transition-all duration-300",
        open ? "shadow-glow-soft border-primary/20" : "hover:border-primary/20"
      )}>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-full text-left flex items-center gap-4 px-6 py-5"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
                {formatDate(session.createdAt)}
              </p>
              {session.tags && session.tags.length > 0 && (
                <TagChip tagId={session.tags[0]} />
              )}
            </div>
            <h3 className="text-lg font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              {session.title || "Untitled Session"}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pulse</p>
            <p className="font-mono text-xl font-bold text-primary leading-none">
              {ratio}%
            </p>
          </div>
          <div
            className="chevron-icon h-9 w-9 rounded-full glass flex items-center justify-center text-muted-foreground shrink-0"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight size={18} />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div 
              initial={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 space-y-6">
                <div className="h-px bg-border/40 w-full" />
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock size={12} /> Intelligence Summary
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {session.summary || "No specific summary was recorded for this session in the chronicle."}
                    </p>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <h5 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Host Engagement</h5>
                       <p className="text-sm font-bold text-foreground">{session.host || "N/A"}</p>
                     </div>
                     <div>
                       <h5 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Participation</h5>
                       <p className="text-sm font-bold text-foreground">{present} / {total} Members Present</p>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <Link
                    to={`/session/${session.id}`}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest shadow-glow hover:scale-[1.05] transition-spring"
                  >
                    Open Session <ArrowUpRight size={14} />
                  </Link>
                </div>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setLineHeight(containerRef.current.scrollHeight);
      animateTimeline(containerRef.current);
    }
  }, [sessions]);

  return (
    <div ref={containerRef} className="relative py-4">
      {/* A5. Animated Timeline Line */}
      <div className="absolute left-[5px] sm:left-[6px] top-4 bottom-4 w-px bg-border/40 overflow-hidden">
        <div 
          className="timeline-line w-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          style={{ height: 0 }}
        />
      </div>
      
      <ol className="relative z-10">
        {sessions.map((s, i) => (
          <TimelineNode key={s.id} session={s} index={i} />
        ))}
      </ol>
    </div>
  );
};

export default memo(Timeline);
