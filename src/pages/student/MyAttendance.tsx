import { motion } from "framer-motion";
import { useAuth } from "@/lib/authStore";
import { useSessions, formatDate } from "@/lib/sessionsStore";
import { StudentNav } from "@/components/student/StudentNav";
import { TagChip } from "@/components/ArtisticElements";

export default function MyAttendance() {
  const { user } = useAuth();
  const { sessions } = useSessions();

  const myHistory = sessions.map(s => {
    const record = s.members?.find(m =>
      m.name.toLowerCase() === user?.name.toLowerCase()
    );
    return {
      ...s,
      myStatus: record ? (record.present ? "present" : "absent") : "not-marked",
    };
  }).reverse();

  const attended = myHistory.filter(s => s.myStatus === "present").length;
  const missed   = myHistory.filter(s => s.myStatus === "absent").length;
  const rate     = myHistory.length > 0
    ? Math.round(attended / myHistory.length * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <StudentNav />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">YOUR RECORD</p>
          <h1 className="font-bold text-4xl text-foreground tracking-tight">Personal Ledger.</h1>
        </motion.div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Sessions", value: myHistory.length, class: "text-foreground" },
            { label: "Attended", value: attended,          class: "text-emerald-500" },
            { label: "Missed",   value: missed,            class: "text-destructive" },
            { label: "Rate",     value: `${rate}%`,        class: "text-primary" },
          ].map(c => (
            <div key={c.label} className="surface-card rounded-2xl p-4 text-center shadow-sm">
              <p className={`font-mono font-bold text-xl ${c.class}`}>{c.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {myHistory.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 surface-card rounded-2xl px-5 py-4 shadow-sm group"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors
                             ${session.myStatus === "present" ? "bg-emerald-500/10 text-emerald-500"
                               : session.myStatus === "absent" ? "bg-destructive/10 text-destructive"
                               : "bg-secondary text-muted-foreground"}`}>
                {session.myStatus === "present" ? "✓" : session.myStatus === "absent" ? "✕" : "—"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{session.title}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{formatDate(session.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
