import { motion } from "framer-motion";
import { Check, X, ExternalLink } from "lucide-react";
import type { SessionDetails } from "@/lib/sessionsStore";
import type { Member } from "./AttendanceTable";

interface SessionSummaryCardProps {
  details: SessionDetails;
  members: Member[];
  generatedAt: Date;
}

const Row = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
  <div className="grid grid-cols-[140px_1fr] gap-6 py-4 border-b border-border/40 last:border-b-0">
    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pt-1">{label}</p>
    <div className="text-[15px] text-foreground leading-relaxed">
      {children || value || <span className="text-muted-foreground/50 italic">— not provided</span>}
    </div>
  </div>
);

const SessionSummaryCard = ({ details, members, generatedAt }: SessionSummaryCardProps) => {
  const present = members.filter((m) => m.present);
  const absent = members.filter((m) => !m.present);
  const ratio = members.length ? Math.round((present.length / members.length) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      className="relative rounded-3xl overflow-hidden bg-dot-grid border border-border surface-card"
    >
      {/* Top strip */}
      <div className="px-8 pt-8 pb-6 border-b border-border/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
              03 / EXPORT
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Session Summary</h2>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              {generatedAt.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Attendance</p>
            <p className="text-5xl font-semibold tabular-nums leading-none mt-1">
              <span className="text-gradient-red">{ratio}</span>
              <span className="text-muted-foreground/40 text-2xl align-top">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-8 py-2">
        <Row label="Resource" value={details.resourcePersons} />
        <Row label="Host" value={details.host} />
        <Row label="Volunteers" value={details.volunteers} />
        <Row label="Summary" value={details.summary} />
        <Row label="Links">
          <div className="flex flex-wrap gap-3">
            {details.resources && details.resources.length > 0 ? (
              details.resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/50 border border-border text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition-all"
                >
                  {res.label} <ExternalLink size={10} />
                </a>
              ))
            ) : (
              <span className="text-muted-foreground/50 italic">— no links attached</span>
            )}
          </div>
        </Row>
      </div>

      {/* Roster split */}
      <div className="grid sm:grid-cols-2 gap-px bg-border/60 border-t border-border/60">
        <div className="bg-card p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-present flex items-center gap-2">
              <Check className="h-3.5 w-3.5" /> Present
            </p>
            <span className="font-mono text-2xl font-semibold tabular-nums text-present">
              {String(present.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {present.length === 0 && <span className="text-muted-foreground/50 text-xs italic font-mono">— none</span>}
            {present.map((m) => (
              <span key={m.id} className="px-3 py-1.5 rounded-lg bg-present/10 text-present text-xs font-medium border border-present/20">
                {m.name}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-card p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary flex items-center gap-2">
              <X className="h-3.5 w-3.5" /> Absent
            </p>
            <span className="font-mono text-2xl font-semibold tabular-nums text-primary">
              {String(absent.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {absent.length === 0 && <span className="text-muted-foreground/50 text-xs italic font-mono">— none</span>}
            {absent.map((m) => (
              <span key={m.id} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                {m.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer mark */}
      <div className="px-8 py-5 border-t border-border/60 flex items-center justify-between">
        <p className="font-dot text-xl text-muted-foreground/50 select-none tracking-widest">BEC·DEV·CLUB</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {members.length} members · compiled locally
        </p>
      </div>
    </motion.section>
  );
};

export default SessionSummaryCard;
