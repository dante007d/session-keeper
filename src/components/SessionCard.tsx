import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Session, formatDate } from "@/lib/sessionsStore";

interface Props {
  session: Session;
  index?: number;
}

const SessionCard = ({ session, index = 0 }: Props) => {
  const total = session.members.length;
  const present = session.members.filter((m) => m.present).length;
  const ratio = total ? Math.round((present / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.05 * index }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/session/${session.id}`}
        className="group relative block surface-card rounded-3xl p-7 overflow-hidden transition-smooth hover:border-primary/30"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/[0.06] group-hover:to-transparent transition-smooth pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {formatDate(session.createdAt)}
              </p>
              <h3 className="text-xl font-semibold tracking-tight truncate">
                {session.title || "Untitled session"}
              </h3>
            </div>
            <span className="flex-shrink-0 h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-spring group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <div className="space-y-1 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 mr-2">Host</span>
              {session.host || <span className="italic text-muted-foreground/50">—</span>}
            </p>
          </div>

          {/* Footer stats */}
          <div className="flex items-end justify-between pt-5 border-t border-border/60">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Attendance</p>
              <p className="font-mono text-2xl font-semibold tabular-nums mt-1">
                <span className="text-foreground">{present}</span>
                <span className="text-muted-foreground/40">/{total}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Rate</p>
              <p className="font-mono text-2xl font-semibold tabular-nums mt-1 text-gradient-red">
                {ratio}<span className="text-muted-foreground/40 text-sm">%</span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SessionCard;
