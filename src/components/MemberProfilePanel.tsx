import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Target, Calendar, User } from "lucide-react";
import { type Session, formatDate } from "@/lib/sessionsStore";
import { AttendanceBar } from "./ArtisticElements";
import { cn } from "@/lib/utils";

interface Props {
  member: {
    name: string;
    attended: number;
    total: number;
    rate: number;
    streak: number;
    sessions: Session[];
  } | null;
  onClose: () => void;
}

const MemberProfilePanel = ({ member, onClose }: Props) => {
  return (
    <AnimatePresence>
      {member && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-md z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-card border-l border-border/40 shadow-[-10px_0_40px_rgba(0,0,0,0.15)] z-[101] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-10">
                <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={32} />
                </div>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-2">Member Profile</p>
                <h2 className="text-4xl font-bold tracking-tight">{member.name}</h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="surface-card rounded-[1.5rem] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Attendance</p>
                  <h4 className="text-3xl font-bold tracking-tight">{member.rate}%</h4>
                </div>
                <div className="surface-card rounded-[1.5rem] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Streak</p>
                  <div className="flex items-center gap-2">
                    <h4 className="text-3xl font-bold tracking-tight">{member.streak}</h4>
                    {member.streak >= 3 && <Flame size={20} className="text-primary animate-pulse" />}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={14} className="text-primary" />
                    <h5 className="font-bold text-[11px] uppercase tracking-widest">Consistency Matrix</h5>
                  </div>
                  <AttendanceBar present={member.attended} total={member.total} />
                  <p className="mt-3 text-[11px] font-medium text-muted-foreground">
                    Attended {member.attended} out of {member.total} tracked sessions.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar size={14} className="text-primary" />
                    <h5 className="font-bold text-[11px] uppercase tracking-widest">Appearance History</h5>
                  </div>
                  <div className="space-y-3">
                    {member.sessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl glass border-border/40 group hover:border-primary/30 transition-smooth">
                        <div>
                          <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{s.title}</p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{formatDate(s.createdAt)}</p>
                        </div>
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          s.members.find(m => m.name.toLowerCase() === member.name.toLowerCase())?.present ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]" : "bg-muted"
                        )} />
                      </div>
                    ))}
                    {member.sessions.length === 0 && (
                      <p className="text-xs text-muted-foreground font-medium italic py-4">No appearance record found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberProfilePanel;
