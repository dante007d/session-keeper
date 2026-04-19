import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, TrendingUp, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSessions } from "@/lib/sessionsStore";
import { cn } from "@/lib/utils";

interface MemberStat {
  name: string;
  attended: number;
  total: number;
  rate: number;
  streak: number;
}

const WEEKS = 12;

const Heatmap = memo(({ sessions }: { sessions: { createdAt: string; rate: number }[] }) => {
  const cells = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const startDay = now.getDay();
    const todayIdx = WEEKS * 7 - 1;
    const arr: { date: Date; rate: number | null }[] = [];
    for (let i = 0; i < WEEKS * 7; i++) {
      const offset = todayIdx - i;
      const d = new Date(now);
      d.setDate(d.getDate() - offset);
      arr.push({ date: d, rate: null });
    }
    sessions.forEach((s) => {
      const d = new Date(s.createdAt);
      d.setHours(0, 0, 0, 0);
      const cell = arr.find((c) => c.date.getTime() === d.getTime());
      if (cell) {
        cell.rate = cell.rate === null ? s.rate : Math.max(cell.rate, s.rate);
      }
    });
    return arr;
  }, [sessions]);

  const intensity = (rate: number | null) => {
    if (rate === null) return "bg-secondary/40 border-border/40";
    if (rate >= 80) return "bg-primary border-primary/60 shadow-glow-red";
    if (rate >= 60) return "bg-primary/70 border-primary/40";
    if (rate >= 40) return "bg-primary/40 border-primary/30";
    if (rate >= 1) return "bg-primary/20 border-primary/20";
    return "bg-secondary/40 border-border/40";
  };

  // Group into columns (weeks)
  const columns: typeof cells[] = [];
  for (let w = 0; w < WEEKS; w++) {
    columns.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1.5 min-w-full">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1.5">
            {col.map((cell, ri) => (
              <div
                key={ri}
                title={`${cell.date.toLocaleDateString()} — ${cell.rate === null ? "no session" : `${cell.rate}% attendance`}`}
                className={cn("h-3.5 w-3.5 rounded-[3px] border transition-smooth", intensity(cell.rate))}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
Heatmap.displayName = "Heatmap";

const Analytics = () => {
  const { sessions } = useSessions();

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalMarks = sessions.reduce((a, s) => a + s.members.length, 0);
    const totalPresent = sessions.reduce((a, s) => a + s.members.filter((m) => m.present).length, 0);
    const overallRate = totalMarks ? Math.round((totalPresent / totalMarks) * 100) : 0;

    const sorted = [...sessions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    // Per-member aggregation by name (case-insensitive)
    const map = new Map<string, MemberStat & { presentDates: number[] }>();
    sorted.forEach((s) => {
      const ts = new Date(s.createdAt).getTime();
      s.members.forEach((m) => {
        const key = m.name.trim().toLowerCase();
        if (!key) return;
        const cur = map.get(key) ?? { name: m.name.trim(), attended: 0, total: 0, rate: 0, streak: 0, presentDates: [] };
        cur.total += 1;
        if (m.present) {
          cur.attended += 1;
          cur.presentDates.push(ts);
        }
        map.set(key, cur);
      });
    });

    const members: MemberStat[] = Array.from(map.values()).map((m) => {
      const rate = m.total ? Math.round((m.attended / m.total) * 100) : 0;
      // Streak = consecutive most-recent presents
      let streak = 0;
      const lastSessions = sorted.slice(-Math.min(sorted.length, 12)).reverse();
      for (const s of lastSessions) {
        const found = s.members.find((x) => x.name.trim().toLowerCase() === m.name.toLowerCase());
        if (found && found.present) streak += 1;
        else break;
      }
      return { name: m.name, attended: m.attended, total: m.total, rate, streak };
    });

    members.sort((a, b) => b.rate - a.rate || b.attended - a.attended);

    const heatmapInput = sessions.map((s) => {
      const t = s.members.length;
      const p = s.members.filter((m) => m.present).length;
      return { createdAt: s.createdAt, rate: t ? Math.round((p / t) * 100) : 0 };
    });

    return { totalSessions, overallRate, members, heatmapInput };
  }, [sessions]);

  const top = stats.members.slice(0, 5);
  const risk = [...stats.members].filter((m) => m.total >= 2).sort((a, b) => a.rate - b.rate).slice(0, 5);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-20 px-6">
        <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-60" aria-hidden />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="pb-10"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
              ANALYTICS
            </p>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[0.95]">
              Patterns.
              <br />
              <span className="text-gradient-red">Made visible.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed">
              Heatmap, streaks, and participation across {stats.totalSessions} {stats.totalSessions === 1 ? "session" : "sessions"}.
            </p>
          </motion.section>

          {sessions.length === 0 ? (
            <div className="surface-card rounded-3xl px-8 py-20 text-center">
              <p className="font-dot text-3xl text-muted-foreground/40 mb-4 tracking-widest">— NO DATA —</p>
              <p className="text-sm text-muted-foreground">Compile a session to populate analytics.</p>
              <Link
                to="/new"
                className="inline-flex items-center gap-2 mt-6 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-spring hover:scale-[1.03] shadow-glow-red"
              >
                Create session
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Kpi label="Sessions" value={stats.totalSessions} />
                <Kpi label="Avg Rate" value={stats.overallRate} suffix="%" />
                <Kpi label="Tracked" value={stats.members.length} />
              </div>

              {/* Heatmap */}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="surface-card rounded-3xl p-6 sm:p-8"
              >
                <div className="flex items-start justify-between mb-5 gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                      Last {WEEKS} weeks
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight">Activity heatmap</h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Less
                    <span className="h-3 w-3 rounded-[3px] bg-secondary border border-border/40" />
                    <span className="h-3 w-3 rounded-[3px] bg-primary/20 border border-primary/20" />
                    <span className="h-3 w-3 rounded-[3px] bg-primary/40 border border-primary/30" />
                    <span className="h-3 w-3 rounded-[3px] bg-primary/70 border border-primary/40" />
                    <span className="h-3 w-3 rounded-[3px] bg-primary border border-primary/60" />
                    More
                  </div>
                </div>
                <Heatmap sessions={stats.heatmapInput} />
              </motion.section>

              {/* Top + Risk */}
              <div className="grid gap-6 lg:grid-cols-2">
                <PeopleCard
                  title="Most consistent"
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  members={top}
                  showStreak
                  emptyText="Need more data"
                />
                <PeopleCard
                  title="Needs attention"
                  icon={<Users className="h-3.5 w-3.5" />}
                  members={risk}
                  emptyText="No risk patterns yet"
                  variant="risk"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const Kpi = memo(({ label, value, suffix }: { label: string; value: number; suffix?: string }) => (
  <div className="surface-card rounded-2xl px-5 py-4">
    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="font-mono text-3xl font-semibold tabular-nums mt-1">
      {value}
      {suffix && <span className="text-muted-foreground/40 text-base">{suffix}</span>}
    </p>
  </div>
));
Kpi.displayName = "Kpi";

const PeopleCard = memo(({
  title,
  icon,
  members,
  showStreak,
  emptyText,
  variant = "top",
}: {
  title: string;
  icon: React.ReactNode;
  members: MemberStat[];
  showStreak?: boolean;
  emptyText: string;
  variant?: "top" | "risk";
}) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="surface-card rounded-3xl p-6 sm:p-8"
  >
    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 inline-flex items-center gap-1.5">
      {icon} {title}
    </p>
    <h3 className="text-xl font-semibold tracking-tight mb-5">{title === "Most consistent" ? "Top attendees" : "At-risk members"}</h3>
    {members.length === 0 ? (
      <p className="text-sm text-muted-foreground py-6 text-center font-mono">{emptyText}</p>
    ) : (
      <ul className="space-y-2.5">
        {members.map((m, i) => (
          <li key={m.name} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-background/40 border border-border/60">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-[11px] text-muted-foreground/60 tabular-nums w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium truncate">{m.name}</span>
              {showStreak && m.streak >= 2 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-mono uppercase tracking-widest">
                  <Flame className="h-3 w-3" /> {m.streak}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.attended}/{m.total}
              </span>
              <span className={cn(
                "font-mono text-base font-semibold tabular-nums",
                variant === "risk" ? "text-primary" : "text-gradient-red",
              )}>
                {m.rate}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </motion.section>
));
PeopleCard.displayName = "PeopleCard";

export default Analytics;
