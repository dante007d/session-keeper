import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessions, formatDate, Session } from "@/lib/sessionsStore";
import { StudentNav } from "@/components/student/StudentNav";
import { AttendanceBar } from "@/components/ArtisticElements";
import { Search, ChevronDown } from "lucide-react";

function StudentSessionCard({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="surface-card rounded-[2rem] overflow-hidden shadow-sm border border-border/40 group"
    >
      <div className="p-6 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{session.title}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {formatDate(session.createdAt)} · {session.host}
            </p>
          </div>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted-foreground ml-3 mt-1 bg-secondary/50 p-1.5 rounded-xl">
            <ChevronDown size={16} />
          </motion.span>
        </div>
        <div className="mt-5">
          <AttendanceBar present={session.members.filter(m => m.present).length} total={session.members.length} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-border/40 pt-5 bg-secondary/20">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Summary</p>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{session.summary || "No summary provided for this session."}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Resource Person</p>
                  <p className="text-xs font-bold text-foreground">{session.resourcePersons}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Volunteers</p>
                  <p className="text-xs font-bold text-foreground">{session.volunteers}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BrowseSessions() {
  const { sessions } = useSessions();
  const [search, setSearch] = useState("");

  const filtered = sessions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <StudentNav />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">SESSION ARCHIVE</p>
          <h1 className="font-bold text-4xl text-foreground tracking-tight">Explore Knowledge.</h1>
        </motion.div>

        <div className="relative mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-14 pr-5 py-4 rounded-[1.5rem] bg-secondary/40 border border-border/40 shadow-inner text-sm font-medium focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((s) => (
            <StudentSessionCard key={s.id} session={s} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-24 surface-card rounded-[2.5rem] border-dashed border-2 border-border/40">
              <p className="font-bold text-sm text-muted-foreground">No matches in the chronicle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
