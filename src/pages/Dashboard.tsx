import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, GitCommitVertical, LayoutGrid, Plus, Trash2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import SessionCard from "@/components/SessionCard";
import Timeline from "@/components/Timeline";
import { useSessions } from "@/lib/sessionsStore";
import { useRoster } from "@/lib/rosterStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "timeline";
const VIEW_KEY = "bec.dev.dashboard.view";

const Dashboard = () => {
  const { sessions, clear } = useSessions();
  const { members: roster } = useRoster();
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    return (localStorage.getItem(VIEW_KEY) as ViewMode) || "grid";
  });

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalMembers = sessions.reduce((acc, s) => acc + s.members.length, 0);
    const totalPresent = sessions.reduce(
      (acc, s) => acc + s.members.filter((m) => m.present).length,
      0,
    );
    const avgAttendance = totalMembers ? Math.round((totalPresent / totalMembers) * 100) : 0;
    return { totalSessions, totalMembers: roster.length, avgAttendance };
  }, [sessions, roster.length]);

  const handleClear = useCallback(() => {
    if (!confirm("Delete all stored sessions? This cannot be undone.")) return;
    clear();
    toast({ title: "All sessions cleared" });
  }, [clear]);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-20 px-6">
        <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-60" aria-hidden />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-6xl">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="pt-6 pb-12"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                BEC DEV CLUB · DASHBOARD
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[0.95]">
              Every session.
              <br />
              <span className="text-gradient-red">Remembered.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              A focused archive of your club's sessions. Local-first. Zero clutter.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
              <Stat label="Sessions" value={stats.totalSessions} />
              <Stat label="Roster" value={stats.totalMembers} />
              <Stat label="Avg Rate" value={stats.avgAttendance} suffix="%" />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/new"
                className="group inline-flex items-center gap-3 h-12 px-6 rounded-full bg-foreground text-background font-medium tracking-tight text-sm transition-spring hover:scale-[1.03] active:scale-[0.98] shadow-elevated"
              >
                <Plus className="h-4 w-4" />
                New Session
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground transition-spring group-hover:translate-x-0.5">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
              <Link
                to="/members"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-secondary/60 border border-border text-foreground hover:border-primary/40 text-xs font-mono uppercase tracking-widest transition-smooth"
              >
                <Users className="h-3.5 w-3.5" /> Roster
              </Link>
              {sessions.length > 0 && (
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-secondary/60 border border-border text-muted-foreground hover:text-primary hover:border-primary/40 text-xs font-mono uppercase tracking-widest transition-smooth"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear all
                </button>
              )}
            </div>
          </motion.section>

          <section>
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
                  ARCHIVE
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {view === "timeline" ? "Session timeline" : "Recent sessions"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 p-1 rounded-full bg-secondary/40 border border-border">
                  <ViewBtn active={view === "grid"} onClick={() => setView("grid")}>
                    <LayoutGrid className="h-3 w-3" /> Grid
                  </ViewBtn>
                  <ViewBtn active={view === "timeline"} onClick={() => setView("timeline")}>
                    <GitCommitVertical className="h-3 w-3" /> Timeline
                  </ViewBtn>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {stats.totalSessions} {stats.totalSessions === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="surface-card rounded-3xl px-8 py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-grid-fine opacity-40" aria-hidden />
                <div className="relative">
                  <p className="font-dot text-3xl text-muted-foreground/40 mb-4 tracking-widest">— EMPTY —</p>
                  <h3 className="text-xl font-semibold tracking-tight">No sessions yet</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    Compile your first session to begin building the archive.
                  </p>
                  <Link
                    to="/new"
                    className="inline-flex items-center gap-2 mt-6 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-spring hover:scale-[1.03] shadow-glow-red"
                  >
                    <Plus className="h-4 w-4" /> Create first session
                  </Link>
                </div>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((s, i) => (
                  <SessionCard key={s.id} session={s} index={i} />
                ))}
              </div>
            ) : (
              <Timeline sessions={sessions} />
            )}
          </section>

          <footer className="mt-24 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-dot text-2xl text-muted-foreground/40 tracking-widest select-none">BEC · DEV · CLUB</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Stored locally · Your data never leaves this browser
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

const Stat = memo(({ label, value, suffix }: { label: string; value: number; suffix?: string }) => (
  <div className="surface-card rounded-2xl px-5 py-4">
    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="font-mono text-3xl font-semibold tabular-nums mt-1">
      {value}
      {suffix && <span className="text-muted-foreground/40 text-base">{suffix}</span>}
    </p>
  </div>
));
Stat.displayName = "Stat";

const ViewBtn = memo(({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-smooth",
      active ? "text-foreground bg-background shadow-elevated" : "text-muted-foreground hover:text-foreground",
    )}
  >
    {children}
  </button>
));
ViewBtn.displayName = "ViewBtn";

export default Dashboard;
