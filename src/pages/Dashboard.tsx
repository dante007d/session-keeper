import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { runHeroTimeline } from "@/animations/heroAnimations";
import { animateStatCards } from "@/animations/cardAnimations";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, GitCommitVertical, LayoutGrid, Plus, Search, Trash2, Users, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import SessionCard from "@/components/SessionCard";
import Timeline from "@/components/Timeline";
import EmptyArchive from "@/components/EmptyArchive";
import { useSessions } from "@/lib/sessionsStore";
import { useRoster } from "@/lib/rosterStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MaskedWord, AnimatedNumber, TiltCard, TypewriterText } from "@/components/ArtisticElements";
import { ParticleField } from "@/components/ParticleField";
import { FloatingOrbs } from "@/components/FloatingOrbs";

type ViewMode = "grid" | "timeline";
const VIEW_KEY = "bec.dev.dashboard.view";

const Dashboard = () => {
  const { sessions, clear } = useSessions();
  const { members: roster } = useRoster();
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    return (localStorage.getItem(VIEW_KEY) as ViewMode) || "grid";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  useEffect(() => {
    const t = setTimeout(() => {
      runHeroTimeline();
      animateStatCards();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const filteredSessions = useMemo(() => {
    let result = [...sessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title?.toLowerCase().includes(q) || 
        s.host?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter
    if (activeFilter === "This Week") {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(s => new Date(s.createdAt) >= oneWeekAgo);
    } else if (activeFilter !== "All") {
      result = result.filter(s => s.tags?.includes(activeFilter.toLowerCase()));
    }

    return result;
  }, [sessions, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalMembers = sessions.reduce((acc, s) => acc + s.members.length, 0);
    const totalPresent = sessions.reduce(
      (acc, s) => acc + s.members.filter((m) => m.present).length,
      0,
    );
    const avgAttendance = totalMembers ? Math.round((totalPresent / totalMembers) * 100) : 0;
    
    // Count this week's sessions
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekSessions = sessions.filter(s => new Date(s.createdAt) >= oneWeekAgo).length;

    return { totalSessions, totalMembers: roster.length, avgAttendance, thisWeekSessions };
  }, [sessions, roster.length]);

  const handleClear = useCallback(() => {
    if (!confirm("Delete all stored sessions? This cannot be undone.")) return;
    clear();
    toast({ title: "All sessions cleared" });
  }, [clear]);

  const line1 = "Every session.".split(" ");
  const line2 = "Remembered.".split(" ");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-16 pb-12 px-6">
        <div className="relative mx-auto max-w-6xl">
          {/* A11. 3D HERO CONTAINER */}
          <section className="relative overflow-hidden min-h-[360px] pt-8 pb-10 rounded-[3rem] px-8 sm:px-12 mb-8">
            <ParticleField />
            <FloatingOrbs />
            
            <div className="relative z-10">
              <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 border-primary/20 opacity-0">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
                  BEC DEV CLUB · ARCHIVE SYSTEM
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.9] mb-4">
                <div className="text-foreground">
                  {line1.map((w, i) => (
                    <MaskedWord key={i} word={w} delay={i * 0.08} />
                  ))}
                </div>
                <div className="text-primary italic font-accent mt-2">
                  {line2.map((w, i) => (
                    <MaskedWord key={i} word={w} delay={0.3 + i * 0.08} />
                  ))}
                </div>
              </h1>

              <div className="hero-subtitle opacity-0 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
                <TypewriterText 
                  text="A premium editorial archive for your club's legacy. Precision tracking. Beautifully preserved." 
                  delay={900}
                />
              </div>
            </div>
          </section>

          <section>

            {/* V1. BENTO GRID DASHBOARD */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
              <div className="stat-card md:col-span-5 surface-card rounded-3xl p-7 flex flex-col justify-between group overflow-hidden relative opacity-0">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <LayoutGrid size={160} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Total Sessions</p>
                  <h3 className="text-6xl font-bold tracking-tighter text-foreground tabular-nums">
                    <AnimatedNumber value={stats.totalSessions} />
                  </h3>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-1 flex-1 bg-secondary/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: "70%" }}
                    />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">System Active</span>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-4">
                <div className="stat-card flex-1 surface-card rounded-3xl p-6 flex flex-col justify-between opacity-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Roster</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                      <AnimatedNumber value={stats.totalMembers} />
                    </h3>
                    <Users className="text-primary mb-1" size={20} />
                  </div>
                </div>
                <div className="stat-card flex-1 surface-card rounded-3xl p-6 flex flex-col justify-between bg-primary/5 border-primary/20 opacity-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">This Week</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-4xl font-bold tracking-tighter text-primary tabular-nums">
                      <AnimatedNumber value={stats.thisWeekSessions} />
                    </h3>
                    <div className="font-mono text-[10px] font-bold text-primary opacity-60 mb-1">SESS.</div>
                  </div>
                </div>
              </div>

              <div className="stat-card md:col-span-4 surface-card rounded-3xl p-7 flex flex-col justify-between group opacity-0">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Avg Attendance</p>
                  <h3 className="text-6xl font-bold tracking-tighter text-foreground tabular-nums">
                    <AnimatedNumber value={stats.avgAttendance} />
                    <span className="text-2xl text-muted-foreground opacity-30 ml-1">%</span>
                  </h3>
                </div>
                <div className="mt-8">
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-mono text-[10px] font-bold text-muted-foreground">Club Health</span>
                     <span className="font-mono text-[10px] font-bold text-primary">{stats.avgAttendance}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-primary"
                       style={{ width: `${stats.avgAttendance}%` }}
                     />
                   </div>
                </div>
              </div>
            </div>

            {/* F6. Upcoming Session Scheduler */}
            <div
              className="mt-8 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-primary rotate-12 pointer-events-none">
                <Calendar size={180} />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">Next Event</span>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Advanced TypeScript Patterns</h3>
                  <p className="text-sm text-muted-foreground font-medium">Saturday, May 3rd · 10:00 AM · Hall B</p>
                </div>
                
                <div className="flex gap-6">
                   {[
                     { label: 'Days', value: 0 },
                     { label: 'Hrs', value: 7 },
                     { label: 'Min', value: 42 },
                     { label: 'Sec', value: 18 },
                   ].map(({ label, value }) => (
                     <div key={label} className="flex flex-col items-center">
                       <span className="font-mono font-bold text-4xl text-foreground tabular-nums">
                         <AnimatedNumber value={value} />
                       </span>
                       <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                         {label}
                       </span>
                     </div>
                   ))}
                </div>

                <Link
                  to="/new"
                  className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-glow flex items-center justify-center hover:scale-[1.05] transition-spring"
                >
                  Join Session
                </Link>
              </div>
            </div>

            <div 
              className="hero-cta mt-8 flex flex-wrap items-center gap-4 opacity-0"
            >
              <Link
                to="/new"
                className="group relative inline-flex items-center gap-3 h-14 px-8 rounded-full bg-foreground text-background font-bold tracking-tight text-sm transition-spring hover:scale-[1.03] active:scale-[0.98] shadow-elevated"
              >
                <Plus className="h-4 w-4" />
                New Session
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground transition-spring group-hover:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                to="/members"
                className="inline-flex items-center gap-2.5 h-14 px-6 rounded-full glass border-border/40 text-foreground hover:border-primary/40 text-[11px] font-bold uppercase tracking-widest transition-smooth"
              >
                <Users className="h-4 w-4" /> Roster
              </Link>
              {sessions.length > 0 && (
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2.5 h-14 px-6 rounded-full glass border-border/40 text-muted-foreground hover:text-destructive hover:border-destructive/40 text-[11px] font-bold uppercase tracking-widest transition-smooth"
                >
                  <Trash2 className="h-4 w-4" /> Clear all
                </button>
              )}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6 flex-wrap">
              <div className="flex-1 min-w-0 w-full md:w-auto">
                <p 
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3 font-bold"
                >
                  MASTER COLLECTION
                </p>
                
                {/* F5. Real-time Search */}
                <div className="relative group max-w-xl">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search titles, hosts, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary/30 border border-border/40 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 p-1 rounded-full glass border-border/40">
                  <ViewBtn active={view === "grid"} onClick={() => setView("grid")}>
                    <LayoutGrid className="h-3.5 w-3.5" /> Grid
                  </ViewBtn>
                  <ViewBtn active={view === "timeline"} onClick={() => setView("timeline")}>
                    <GitCommitVertical className="h-3.5 w-3.5" /> Timeline
                  </ViewBtn>
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-10">
               {["All", "This Week", "Workshop", "Seminar", "Hackathon"].map((filter) => (
                 <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-200",
                    activeFilter === filter 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-secondary/40 text-muted-foreground border-border/40 hover:border-primary/40"
                  )}
                 >
                   {filter}
                 </button>
               ))}
            </div>

            {filteredSessions.length === 0 ? (
              searchQuery ? (
                <div className="py-20 text-center surface-card rounded-[2.5rem] border-dashed border-2 border-border/40">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">No Matches Found</p>
                  <h3 className="text-xl font-bold">The chronicle is silent</h3>
                  <p className="text-sm text-muted-foreground mt-2">Adjust your search parameters and try again.</p>
                </div>
              ) : (
                <EmptyArchive />
              )
            ) : view === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSessions.map((s, i) => (
                  <SessionCard key={s.id} session={s} index={i} />
                ))}
              </div>
            ) : (
              <Timeline sessions={filteredSessions} />
            )}
          </section>

          <footer className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="font-dot text-4xl text-primary/30 tracking-[0.2em] select-none uppercase">BEC · DEV · CLUB</p>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">EST. 2024 · DIGITAL ARCHIVE</p>
            </div>
            <div className="text-center md:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
                Local-First Infrastructure
              </p>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.1em]">
                Securely persisted in your local environment
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

const ViewBtn = memo(({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-smooth",
      active ? "text-foreground bg-card shadow-elevated border border-border/50" : "text-muted-foreground hover:text-foreground",
    )}
  >
    {children}
  </button>
));
ViewBtn.displayName = "ViewBtn";

export default Dashboard;
