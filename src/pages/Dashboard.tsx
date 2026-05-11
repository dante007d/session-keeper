import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import { runHeroTimeline } from "@/animations/heroAnimations";
import { animateStatCards } from "@/animations/cardAnimations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, GitCommitVertical, LayoutGrid, Plus, Search, Shield, Trash2, TrendingUp, Users, X } from "lucide-react";
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

  const line1 = "Chronicle.".split(" ");
  const line2 = "Mastery in motion.".split(" ");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20 pb-12 px-6">
        <div className="relative mx-auto max-w-6xl">
          {/* MODERN APP-LIKE HERO */}
          <section className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse" />
                  BEC DEV CLUB · TEACHER PORTAL
                </p>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[0.95]">
                   Every session.<br />
                   <span className="text-primary italic font-accent">Remembered.</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                  Manage club archives, track participation, and broadcast updates to your students from one unified command center.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/teacher/new"
                  className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-tight shadow-glow flex items-center gap-2 hover:scale-[1.03] transition-spring"
                >
                  <Plus size={18} /> New Session
                </Link>
                <Link
                  to="/teacher/phantom"
                  className="h-14 px-6 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm flex items-center gap-2 hover:bg-primary/20 transition-all shadow-glow shadow-primary/5"
                >
                  <Shield size={18} /> Phantom Mesh
                </Link>
                <Link
                  to="/teacher/roster"
                  className="h-14 px-6 rounded-2xl bg-secondary/50 border border-border text-foreground font-bold text-sm flex items-center gap-2 hover:bg-secondary transition-all"
                >
                  <Users size={18} /> Roster
                </Link>
              </div>
            </motion.div>
          </section>

          {/* CLEAN BENTO DASHBOARD */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
            <div className="md:col-span-4 surface-card rounded-[2rem] p-6 border-l-4 border-l-primary relative overflow-hidden group">
               <div className="absolute top-4 right-4 text-primary/10 group-hover:scale-110 transition-transform">
                 <LayoutGrid size={40} />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Sessions</p>
               <h3 className="text-5xl font-bold tracking-tighter text-foreground tabular-nums">
                 <AnimatedNumber value={stats.totalSessions} />
               </h3>
               <p className="text-xs text-muted-foreground mt-2 font-medium">Recorded in archive</p>
            </div>

            <div className="md:col-span-4 surface-card rounded-[2rem] p-6 border-l-4 border-l-emerald-500 relative overflow-hidden group">
               <div className="absolute top-4 right-4 text-emerald-500/10 group-hover:scale-110 transition-transform">
                 <Users size={40} />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active Members</p>
               <h3 className="text-5xl font-bold tracking-tighter text-foreground tabular-nums">
                 <AnimatedNumber value={stats.totalMembers} />
               </h3>
               <p className="text-xs text-muted-foreground mt-2 font-medium">From club roster</p>
            </div>

            <div className="md:col-span-4 surface-card rounded-[2rem] p-6 border-l-4 border-l-amber-500 relative overflow-hidden group">
               <div className="absolute top-4 right-4 text-amber-500/10 group-hover:scale-110 transition-transform">
                 <TrendingUp size={40} />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Avg Pulse</p>
               <h3 className="text-5xl font-bold tracking-tighter text-foreground tabular-nums">
                 <AnimatedNumber value={stats.avgAttendance} />
                 <span className="text-xl text-muted-foreground ml-1">%</span>
               </h3>
               <p className="text-xs text-muted-foreground mt-2 font-medium">Overall participation</p>
            </div>
          </div>

          {/* UPCOMING/ACTIVE SESSION - DYNAMIC */}
          {sessions.length > 0 && (
            <div className="mb-12 surface-card rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-glow-soft">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner">
                  {sessions[0].attendanceType === 'phantom' ? '🛡️' : '🚀'}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                    {sessions[0].attendanceType === 'phantom' ? 'Phantom Room Ready' : 'Standard Session Ready'}
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight">{sessions[0].title}</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    Host: {sessions[0].host} · Verification: {sessions[0].attendanceType?.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex gap-4">
                 {[
                   { label: 'ATT', value: sessions[0].members.length },
                   { label: 'PRES', value: sessions[0].members.filter(m => m.present).length },
                   { label: 'TYPE', value: sessions[0].attendanceType === 'phantom' ? 'PH' : 'STD' },
                 ].map(({ label, value }) => (
                   <div key={label} className="h-16 w-16 rounded-2xl bg-secondary/50 flex flex-col items-center justify-center border border-border/50">
                      <span className="font-mono font-bold text-xl text-foreground">{value}</span>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase">{label}</span>
                   </div>
                 ))}
              </div>

              <Link
                to={sessions[0].attendanceType === 'phantom' ? "/teacher/phantom" : `/teacher/session/${sessions[0].id}`}
                className="relative z-10 h-14 px-8 rounded-2xl bg-foreground text-background font-bold text-sm tracking-tight hover:scale-[1.05] transition-spring flex items-center justify-center"
              >
                Open Entry System
              </Link>
            </div>
          )}

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
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary/40 border border-border/40 rounded-[1.5rem] py-4 pl-14 pr-12 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 p-1.5 rounded-2xl glass border-border/40">
                  <ViewBtn active={view === "grid"} onClick={() => setView("grid")}>
                    <LayoutGrid className="h-4 w-4" />
                  </ViewBtn>
                  <ViewBtn active={view === "timeline"} onClick={() => setView("timeline")}>
                    <GitCommitVertical className="h-4 w-4" />
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
                    "px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-200",
                    activeFilter === filter 
                      ? "bg-primary text-primary-foreground border-primary shadow-glow-soft" 
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
