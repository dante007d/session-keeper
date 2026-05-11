import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Layout, Send, MessageSquare, ExternalLink, User, Github, Globe, Figma, FileText, ImageIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SessionSummaryCard from "@/components/SessionSummaryCard";
import { Session, sessionsStore } from "@/lib/sessionsStore";
import { useToolsStore } from "@/lib/toolsStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { useAttendanceStore } from "@/lib/attendanceStore";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'qa'>('overview');
  
  const { openRoom: openStandardRoom, closeRoom: closeStandardRoom, activeSession: standardSession } = useAttendanceStore();
  const { assignments, qa } = useToolsStore();
  const sessionSubmissions = assignments.filter(a => a.sessionId === id || a.sessionId === 'active');
  const sessionQA = qa.filter(q => q.sessionId === id || q.sessionId === 'active');

  useEffect(() => {
    if (!id) return;
    const found = sessionsStore.get(id);
    if (!found) setNotFound(true);
    else setSession(found);
  }, [id]);

  // Auto-refresh session when attendance is updated in real-time
  useEffect(() => {
    if (!id) return;
    const sync = () => {
      const updated = sessionsStore.get(id);
      if (updated) setSession(updated);
    };
    window.addEventListener("bec:sessions-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bec:sessions-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  const handleDelete = () => {
    if (!session) return;
    if (!confirm("Delete this session? This cannot be undone.")) return;
    sessionsStore.remove(session.id);
    toast({ title: "Session deleted" });
    navigate("/teacher/dashboard");
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'github': return <Github size={16}/>;
      case 'demo': return <Globe size={16}/>;
      case 'figma': return <Figma size={16}/>;
      case 'doc': return <FileText size={16}/>;
      default: return <ImageIcon size={16}/>;
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-24 pb-20 px-6">
        <div className="relative mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <Link to="/teacher/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-4">
                <ArrowLeft size={12} /> Back to Dashboard
              </Link>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  SESSION_MANAGEMENT_HUB
                </p>
                <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-none">
                  {session?.title || "Loading..."}
                </h1>
              </motion.div>
            </div>
            {session && (
              <button onClick={handleDelete} className="p-3 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10 hover:bg-destructive hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Trash2 size={16} /> Delete Session
              </button>
            )}
          </div>

          {/* TABS */}
          <div className="flex gap-1 p-1 rounded-2xl bg-secondary/30 border border-border/40 w-fit mb-8">
            {(['overview', 'submissions', 'qa'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SESSION CONTROL BAR (For Standard Attendance) */}
          {session?.attendanceType === 'normal' && (
            <div className="surface-card rounded-[2rem] p-6 mb-8 border border-primary/20 bg-primary/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Layout size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Standard Entry Mode</p>
                    <h3 className="text-xl font-bold tracking-tight">
                      {standardSession.isOpen && standardSession.sessionId === id ? "Entry Active" : "Entry Suspended"}
                    </h3>
                 </div>
               </div>

               {standardSession.isOpen && standardSession.sessionId === id ? (
                 <div className="flex items-center gap-6">
                    <div className="text-center px-6 border-r border-border">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active PIN</p>
                       <p className="text-2xl font-black tracking-tighter text-primary font-mono">{standardSession.pin}</p>
                    </div>
                    <div className="text-center px-6">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Checked In</p>
                       <p className="text-2xl font-black tracking-tighter">{session.members.filter(m => m.present).length}</p>
                    </div>
                    <button 
                      onClick={() => {
                        closeStandardRoom();
                        // Refresh session from store to reflect updated attendance
                        const updated = sessionsStore.get(id || "");
                        if (updated) setSession(updated);
                        toast({ title: "Entry closed", description: "Attendance has been finalized." });
                      }}
                      className="px-6 py-3 rounded-xl bg-foreground text-background text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      Finalize & Close Entry
                    </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => openStandardRoom(id || "")}
                   className="px-8 py-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-glow flex items-center gap-2 hover:scale-105 transition-all"
                 >
                   Launch Standard Entry
                 </button>
               )}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && session && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SessionSummaryCard
                  details={{
                    resourcePersons: session.resourcePersons,
                    host: session.host,
                    volunteers: session.volunteers,
                    summary: session.summary,
                    attendanceType: session.attendanceType,
                  }}
                  members={session.members}
                  generatedAt={new Date(session.createdAt)}
                />
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div key="submissions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionSubmissions.length === 0 ? (
                  <div className="col-span-2 surface-card rounded-[2.5rem] p-20 text-center border-dashed border-2">
                    <Layout className="mx-auto text-muted-foreground/20 mb-4" size={48} />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No Submissions Yet</p>
                  </div>
                ) : (
                  sessionSubmissions.map(sub => (
                    <div key={sub.id} className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40 hover:border-primary/30 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground">{sub.studentId}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Student</p>
                          </div>
                        </div>
                        <a href={sub.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-secondary/40 text-muted-foreground hover:text-primary transition-all">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/20 border border-border/20">
                        <div className="text-primary">{getIcon(sub.type)}</div>
                        <p className="text-xs font-mono font-bold text-foreground truncate flex-1">{sub.url}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'qa' && (
              <motion.div key="qa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="space-y-4">
                {sessionQA.length === 0 ? (
                  <div className="surface-card rounded-[2.5rem] p-20 text-center border-dashed border-2">
                    <MessageSquare className="mx-auto text-muted-foreground/20 mb-4" size={48} />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No Questions Posted</p>
                  </div>
                ) : (
                  sessionQA.map(q => (
                    <div key={q.id} className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                              {q.isAnonymous ? "?" : q.author[0]}
                           </div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                             {q.isAnonymous ? "Anonymous Member" : q.author}
                           </p>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground">ID: {q.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-6 leading-tight">{q.question}</h3>
                      <div className="flex gap-2">
                        <button className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-glow flex items-center gap-2">
                          <Send size={14} /> Send Reply
                        </button>
                        <button className="px-5 py-2 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary/40">
                          Pin Question
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default SessionDetail;
