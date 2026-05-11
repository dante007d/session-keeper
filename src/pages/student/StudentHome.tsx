import { motion } from "framer-motion";
import { useAuth } from "@/lib/authStore";
import { useSessions, formatDate } from "@/lib/sessionsStore";
import { useRoster } from "@/lib/rosterStore";
import { useAnnouncements } from "@/lib/announcementsStore";
import { StudentNav } from "@/components/student/StudentNav";
import { useAttendanceStore } from "@/lib/attendanceStore";
import { usePhantomStore } from "@/lib/attendanceStoreV2";
import { useNavigate } from "react-router-dom";
import { Fingerprint, TrendingUp, Zap, Trophy, Flame } from "lucide-react";
import { AttendanceHeatmap, AttendanceDonut, SkillGrowthChart, BadgesGrid } from "@/components/student/StudentDashboardComponents";

export default function StudentHome() {
  const { user } = useAuth();
  const { sessions } = useSessions();
  const { members } = useRoster();
  const { announcements } = useAnnouncements();
  const { activeSession, submissions: normalSubmissions } = useAttendanceStore();
  const { activeSession: phantomSession, submissions: phantomSubmissions } = usePhantomStore();
  const navigate = useNavigate();

  // Combine submissions for stats
  const allSubmissions = [...normalSubmissions, ...phantomSubmissions];

  const mySessions = sessions.filter(s => {
    // Check if they are marked present in the session object (Normal)
    // or if they have a phantom submission (Phantom)
    const markedNormal = s.members.some(m => m.name.toLowerCase() === user?.name.toLowerCase() && m.present);
    const markedPhantom = phantomSubmissions.some(sub => sub.studentId === (user?.id || user?.name));
    
    return markedNormal || markedPhantom;
  });
  
  const attended = mySessions.length;
  const total = sessions.length;
  const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <StudentNav />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em]
                           text-primary mb-1">
                BEC Dev Club · Student
              </p>
              <h1 className="font-bold text-3xl text-foreground tracking-tight">
                {greeting()}, {user?.name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            {(activeSession.isOpen || phantomSession.isOpen) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/student/checkin")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-glow animate-pulse-glow"
              >
                <Fingerprint size={16} />
                Check In
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="surface-card rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <AttendanceDonut rate={rate} />
          </div>
          
          <div className="space-y-4">
            <div className="surface-card rounded-[2rem] p-5 shadow-sm border-l-4 border-amber-500">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Club Rank</p>
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp size={10} /> +2
                </div>
              </div>
              <p className="font-mono font-black text-3xl text-foreground mt-1">#03</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">of {members.length} members</p>
            </div>
            
            <div className="surface-card rounded-[2rem] p-5 shadow-sm border-l-4 border-emerald-500">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Active Streak</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="font-mono font-black text-3xl text-foreground">5</p>
                <p className="text-xs font-bold text-emerald-500 mb-1 flex items-center gap-1">WEEKS <Flame size={12} /></p>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[2rem] p-6 shadow-sm border-l-4 border-primary bg-primary/5 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
            <div>
              <p className="font-mono font-black text-2xl text-foreground">Level 12</p>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">Advanced Developer</p>
            </div>
          </div>
        </div>

        {/* HEATMAP & GROWTH */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <AttendanceHeatmap sessions={sessions} attendanceRecords={allSubmissions} />
          <SkillGrowthChart />
        </div>

        {/* BADGES SECTION */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Trophy size={12} /> Achievements
            </p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary">View All</button>
          </div>
          <BadgesGrid earnedIds={['first', 'streak_3', 'streak_5']} />
        </div>

        {/* ANNOUNCEMENTS */}
        {announcements.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Dispatch</p>
            <div className="space-y-3">
              {announcements.slice(0, 1).map((a) => (
                <div key={a.id} className="surface-card rounded-[2rem] p-5 flex gap-4 border border-border/40 shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">New Update</p>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED */}
        <div className="surface-card rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Recommended for you</p>
          <h3 className="font-bold text-2xl text-foreground tracking-tight">Advanced TypeScript Patterns</h3>
          <p className="text-sm text-muted-foreground mt-1 font-medium">📅 Saturday, May 15 · 3:00 PM</p>
          <div className="flex gap-3 mt-6">
            <button className="flex-1 py-4 rounded-2xl border border-border text-xs font-bold text-muted-foreground hover:bg-secondary/40 transition-all uppercase tracking-widest">
              Reminder
            </button>
            <button className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground text-xs font-bold hover:shadow-glow transition-all uppercase tracking-widest">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
