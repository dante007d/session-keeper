import { motion } from "framer-motion";
import { useAuth } from "@/lib/authStore";
import { StudentNav } from "@/components/student/StudentNav";
import { LogOut, Trophy, Award, Zap, Star, Palette, Check, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme, THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useSessions } from "@/lib/sessionsStore";
import { AttendanceDonut, BadgesGrid } from "@/components/student/StudentDashboardComponents";

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme: currentTheme, setTheme } = useTheme();
  const { sessions } = useSessions();

  // Stats calculation
  const mySessions = sessions.filter(s => s.members.some(m => m.name.toLowerCase() === user?.name.toLowerCase() && m.present));
  const rate = sessions.length > 0 ? Math.round((mySessions.length / sessions.length) * 100) : 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <StudentNav />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-10">
          <div className="w-24 h-24 rounded-[2.5rem] bg-primary flex items-center justify-center text-primary-foreground text-4xl font-bold mx-auto mb-4 shadow-xl">
            {user?.name?.[0]}
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{user?.name}</h1>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">BEC DEV CLUB STUDENT</p>
        </motion.div>

        {/* ANALYTICS CARD */}
        <div className="surface-card rounded-[2.5rem] p-8 mb-6 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <AttendanceDonut rate={rate} size={140} />
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg text-foreground mb-1">Consistency Score</h3>
            <p className="text-sm text-muted-foreground font-medium mb-4">Based on your attendance in the last {sessions.length} sessions.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-secondary/40 px-4 py-2 rounded-xl border border-border/40">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Attended</p>
                <p className="font-mono font-bold text-sm text-foreground">{mySessions.length}</p>
              </div>
              <div className="bg-secondary/40 px-4 py-2 rounded-xl border border-border/40">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total</p>
                <p className="font-mono font-bold text-sm text-foreground">{sessions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BADGES */}
        <div className="surface-card rounded-[2.5rem] p-8 mb-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <Trophy size={12} className="text-primary" /> My Achievements
          </p>
          <BadgesGrid earnedIds={['first', 'streak_3', 'streak_5']} />
        </div>

        {/* THEME SELECTION */}
        <div className="surface-card rounded-[2.5rem] p-8 mb-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20" />
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Aesthetic</p>
              <h3 className="font-bold text-lg text-foreground">Theme Selection</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all group relative overflow-hidden",
                  currentTheme === t.id 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-secondary/40 border-border/40 hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: t.accent }} 
                  />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-foreground leading-none">{t.name}</p>
                    <p className="text-[9px] font-medium text-muted-foreground mt-0.5">{t.tagline}</p>
                  </div>
                </div>
                {currentTheme === t.id && (
                  <Check size={14} className="text-primary relative z-10" />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl bg-card border border-destructive/10 text-destructive font-bold text-sm flex items-center justify-center gap-3 hover:bg-destructive/5 transition-all shadow-sm"
        >
          <LogOut size={18} />
          Sign Out of Portal
        </button>
      </div>
    </div>
  );
}
