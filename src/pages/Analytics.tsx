import React, { useMemo, useState, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, TrendingUp, Users, Calendar, Trophy, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSessions } from "@/lib/sessionsStore";
import { cn } from "@/lib/utils";
import { MaskedWord, AnimatedNumber } from "@/components/ArtisticElements";
import MemberProfilePanel from "@/components/MemberProfilePanel";
import { AttendanceChart3D } from "@/components/Chart3D";
import { AttendanceGlobe } from "@/components/AttendanceGlobe";
import { useRoster } from "@/lib/rosterStore";

interface MemberStat {
  name: string;
  attended: number;
  total: number;
  rate: number;
  streak: number;
}

const WEEKS = 24; // Expanded heatmap

const Heatmap = memo(({ sessions }: { sessions: { createdAt: string; count: number }[] }) => {
  const cells = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayIdx = WEEKS * 7 - 1;
    const arr: { date: Date; count: number }[] = [];
    
    for (let i = 0; i < WEEKS * 7; i++) {
      const offset = todayIdx - i;
      const d = new Date(now);
      d.setDate(d.getDate() - offset);
      arr.push({ date: d, count: 0 });
    }
    
    sessions.forEach((s) => {
      const d = new Date(s.createdAt);
      d.setHours(0, 0, 0, 0);
      const cell = arr.find((c) => c.date.getTime() === d.getTime());
      if (cell) cell.count += 1;
    });
    return arr;
  }, [sessions]);

  const intensity = (count: number) => {
    if (count === 0) return "bg-secondary/40 border-border/20";
    if (count === 1) return "bg-primary/30 border-primary/20";
    if (count === 2) return "bg-primary/60 border-primary/40";
    return "bg-primary border-primary/60 shadow-glow-soft";
  };

  const columns: typeof cells[] = [];
  for (let w = 0; w < WEEKS; w++) {
    columns.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className="overflow-x-auto pb-4 -mx-1">
      <div className="inline-flex gap-1.5 p-1">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1.5">
            {col.map((cell, ri) => (
              <motion.div
                key={ri}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (ci * 7 + ri) * 0.005 }}
                whileHover={{ scale: 1.5, zIndex: 10 }}
                title={`${cell.date.toLocaleDateString()} — ${cell.count} session(s)`}
                className={cn("h-3.5 w-3.5 rounded-[4px] border transition-all duration-300 cursor-pointer", intensity(cell.count))}
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
  const { members } = useRoster();
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalMarks = sessions.reduce((a, s) => a + s.members.length, 0);
    const totalPresent = sessions.reduce((a, s) => a + s.members.filter((m) => m.present).length, 0);
    const overallRate = totalMarks ? Math.round((totalPresent / totalMarks) * 100) : 0;

    const sorted = [...sessions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const map = new Map<string, any>();
    sorted.forEach((s) => {
      s.members.forEach((m) => {
        const key = m.name.trim().toLowerCase();
        if (!key) return;
        const cur = map.get(key) ?? { 
          name: m.name.trim(), 
          attended: 0, 
          total: 0, 
          rate: 0, 
          streak: 0, 
          sessions: [] 
        };
        cur.total += 1;
        if (m.present) {
          cur.attended += 1;
          cur.sessions.push(s);
        }
        map.set(key, cur);
      });
    });

    const members: any[] = Array.from(map.values()).map((m) => {
      const rate = m.total ? Math.round((m.attended / m.total) * 100) : 0;
      let streak = 0;
      const reversedSessions = [...sorted].reverse();
      for (const s of reversedSessions) {
        const found = s.members.find((x) => x.name.trim().toLowerCase() === m.name.toLowerCase());
        if (found && found.present) streak += 1;
        else if (found) break; // Missed a session he was supposed to be at
      }
      return { ...m, rate, streak };
    });

    members.sort((a, b) => b.rate - a.rate || b.attended - a.attended);

    const heatmapInput = sessions.map((s) => ({ createdAt: s.createdAt, count: 1 }));

    return { totalSessions, overallRate, members, heatmapInput, totalMarks };
  }, [sessions]);

  const line1 = "Patterns.".split(" ");
  const line2 = "Made visible.".split(" ");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-16 pb-12 px-6">
        <div className="relative mx-auto max-w-6xl">
          <Link
            to="/teacher/dashboard"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-smooth mb-6"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Chronicle
          </Link>

          <motion.section
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="pb-6"
          >
            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3 font-bold">
                <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2 align-middle animate-pulse" />
                INTELLIGENCE ENGINE
              </p>
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
               <div className="text-foreground">
                {line1.map((w, i) => (
                  <MaskedWord key={i} word={w} delay={i * 0.08} />
                ))}
              </div>
              <div className="text-primary italic font-accent mt-1">
                {line2.map((w, i) => (
                  <MaskedWord key={i} word={w} delay={0.4 + i * 0.08} />
                ))}
              </div>
            </h1>
            
            <motion.p
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed font-medium"
            >
              Analyze participation, identify streaks, and visualize the heartbeat of your community across {stats.totalSessions} sessions.
            </motion.p>
          </motion.section>

          {sessions.length === 0 ? (
            <div className="surface-card rounded-[2.5rem] px-8 py-16 text-center border-dashed border-2 border-border/40">
              <p className="font-dot text-4xl text-muted-foreground/20 mb-6 tracking-widest uppercase">— SILENCE —</p>
              <h3 className="text-xl font-bold mb-4">No data to process</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">The intelligence engine requires at least one archived session to begin generating patterns.</p>
              <Link
                to="/teacher/new"
                className="inline-flex items-center gap-2 mt-8 h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-glow transition-spring hover:scale-[1.03]"
              >
                Create first session
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Kpi label="Active Chronicles" value={stats.totalSessions} icon={<Calendar className="text-primary" size={18} />} />
                <Kpi label="Collective Pulse" value={stats.overallRate} suffix="%" icon={<Flame className="text-primary" size={18} />} />
                <Kpi label="Total Attendance" value={stats.totalMarks} icon={<Users className="text-primary" size={18} />} />
              </div>

              {/* 3D03 — RISING BAR CHART */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <AttendanceChart3D data={stats.members.map(m => ({ name: m.name, value: m.attended }))} />
              </motion.section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 {/* F3. Heatmap */}
                 <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-8 surface-card rounded-[2.5rem] p-8 sm:p-10"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                        Historical Heartbeat
                      </p>
                      <h3 className="text-2xl font-bold tracking-tight">Engagement Heatmap</h3>
                    </div>
                  </div>
                  <Heatmap sessions={stats.heatmapInput} />
                  <div className="mt-4 flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <span>{WEEKS} weeks ago</span>
                    <span>Today</span>
                  </div>
                </motion.section>

                {/* 3D05 — ATTENDANCE GLOBE */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-4 h-full"
                >
                  <AttendanceGlobe members={stats.members} sessions={sessions} />
                </motion.section>
              </div>

              {/* F10. Leaderboard */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="surface-card rounded-[2.5rem] p-8 sm:p-10"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">The Elite</p>
                    <h3 className="text-2xl font-bold tracking-tight">Consistenty Leaderboard</h3>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {stats.members.slice(0, 10).map((m, i) => (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedMember(m)}
                      className="group flex items-center gap-5 p-4 rounded-[1.5rem] glass border-border/30 hover:border-primary/40 hover:bg-primary/[0.02] cursor-pointer transition-all duration-300"
                    >
                      <div className="font-mono text-sm font-bold text-muted-foreground/30 w-6 group-hover:text-primary transition-colors tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      
                      <div className="h-10 w-10 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-border/40">
                        <User size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-end mb-2">
                          <span className="font-bold text-sm truncate">{m.name}</span>
                          <div className="flex items-center gap-3">
                            {m.streak >= 2 && (
                               <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                 <Flame size={10} /> {m.streak} STREAK
                               </span>
                            )}
                            <span className="font-mono text-sm font-bold text-foreground">{m.rate}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${m.rate}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.05 + 0.2 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>
          )}
        </div>
      </main>
      
      <MemberProfilePanel member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
};

const Kpi = memo(({ label, value, suffix, icon }: { label: string; value: number; suffix?: string; icon: React.ReactNode }) => (
  <div className="surface-card rounded-[1.5rem] px-7 py-6 flex flex-col justify-between h-32 group">
    <div className="flex justify-between items-start">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
      <div className="h-8 w-8 rounded-xl glass border-border/40 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <h4 className="text-4xl font-bold tracking-tighter tabular-nums">
      <AnimatedNumber value={value} />
      {suffix && <span className="text-muted-foreground/30 text-xl ml-1">{suffix}</span>}
    </h4>
  </div>
));
Kpi.displayName = "Kpi";

export default Analytics;
