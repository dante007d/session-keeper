import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2, Sparkles, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import SessionForm, { type SessionDetails } from "@/components/SessionForm";
import AttendanceTable, { type Member } from "@/components/AttendanceTable";
import Navbar from "@/components/Navbar";
import { sessionsStore } from "@/lib/sessionsStore";
import { FloatingInput, MaskedWord } from "@/components/ArtisticElements";
import { cn } from "@/lib/utils";
import { LiveSessionMode } from "@/components/LiveSessionMode";
import { useRoster } from "@/lib/rosterStore";

import { useAnnouncements } from "@/lib/announcementsStore";

const CreateSession = () => {
  const navigate = useNavigate();
  const { members: roster } = useRoster();
  const { publish } = useAnnouncements();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState<SessionDetails>({
    resourcePersons: "",
    host: "",
    volunteers: "",
    summary: "",
    attendanceType: "phantom",
    rating: 0,
    tags: [],
  });
  const [shouldBroadcast, setShouldBroadcast] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [compileState, setCompileState] = useState<"idle" | "loading" | "success">("idle");
  const [liveMode, setLiveMode] = useState(false);

  const addMember = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMembers((prev) => {
      if (prev.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, { id: crypto.randomUUID(), name: trimmed, present: false }];
    });
  }, []);

  const toggleMember = useCallback((id: string) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, present: !m.present } : m))), []);

  const removeMember = useCallback((id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id)), []);

  const pickFromRoster = useCallback((names: string[]) =>
    setMembers((prev) => {
      const have = new Set(prev.map((m) => m.name.toLowerCase()));
      const additions = names
        .filter((n) => !have.has(n.toLowerCase()))
        .map((name) => ({ id: crypto.randomUUID(), name, present: false }));
      return [...prev, ...additions];
    }), []);

  const handleLiveSave = (attendance: Record<string, boolean>) => {
    setMembers(prev => prev.map(m => ({
      ...m,
      present: attendance[m.id] ?? false
    })));
    setLiveMode(false);
    toast({ title: "Live attendance compiled" });
  };

  const handleSave = async () => {
    if (!title.trim() && !details.host.trim() && members.length === 0) {
      toast({
        title: "Nothing to save yet",
        description: "Add a title, host, or members first.",
        variant: "destructive",
      });
      return;
    }

    setCompileState("loading");
    
    // Simulate compilation time for artistic effect
    await new Promise(resolve => setTimeout(resolve, 1200));

    const session = sessionsStore.create({
      title: title.trim() || "Untitled session",
      ...details,
      members,
    });

    if (shouldBroadcast) {
      publish(
        `🚀 New Session: "${session.title}" has been added to the chronicle. Attendance mode: ${details.attendanceType.toUpperCase()}.`,
        "event"
      );
    }

    setCompileState("success");
    toast({ title: "Session archived", description: "Successfully added to your chronicle." });
    
    navigate(`/teacher/session/${session.id}`);
  };

  const line1 = "New session.".split(" ");
  const line2 = "Make it count.".split(" ");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-24 pb-20 px-6">
        <div className="relative mx-auto max-w-6xl">
          <motion.section
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            className="pb-10"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
            >
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-smooth mb-8"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Chronicle
              </Link>
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
              Capture the energy of today's gathering. Every detail preserved for the chronicle.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="mt-12 max-w-2xl"
            >
              <FloatingInput
                label="Chronicle Title"
                placeholder="e.g. Workshop on Advanced Web Patterns"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </motion.div>
          </motion.section>

          <div className="grid gap-8 lg:grid-cols-2">
            <SessionForm value={details} onChange={setDetails} />
            <div className="space-y-6">
              <AttendanceTable
                members={members}
                onAdd={addMember}
                onToggle={toggleMember}
                onRemove={removeMember}
                onPickFromRoster={pickFromRoster}
              />
              
              {members.length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setLiveMode(true)}
                  className="w-full h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/20 transition-all"
                >
                  <Play size={14} className="fill-primary" />
                  Enter Live Check-In Mode
                </motion.button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {liveMode && (
              <LiveSessionMode 
                members={members}
                initialAttendance={members.reduce((acc, m) => ({ ...acc, [m.id]: m.present }), {})}
                onClose={() => setLiveMode(false)}
                onSave={handleLiveSave}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => setShouldBroadcast(!shouldBroadcast)}>
              <div className={cn(
                "w-10 h-6 rounded-full relative transition-all duration-300 border",
                shouldBroadcast ? "bg-primary border-primary" : "bg-secondary border-border"
              )}>
                <motion.div 
                  animate={{ x: shouldBroadcast ? 18 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm" 
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                Broadcast to Student Portal
              </span>
            </div>

            <motion.button
              onClick={handleSave}
              disabled={compileState !== "idle"}
              animate={{ 
                backgroundColor: compileState === "success" ? "#10b981" : "hsl(var(--foreground))",
                scale: compileState === "loading" ? 0.98 : 1
              }}
              className={cn(
                "group relative inline-flex items-center justify-center gap-3 h-16 px-12 rounded-full font-bold tracking-tight text-base transition-all duration-300 shadow-elevated overflow-hidden",
                compileState === "success" ? "text-white" : "text-background"
              )}
            >
              <AnimatePresence mode="wait">
                {compileState === "loading" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Compiling...</span>
                  </motion.div>
                ) : compileState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5" />
                    <span>Archived!</span>
                    <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span>Compile & Save</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success burst simulation background */}
              {compileState === "success" && (
                 <motion.div 
                   initial={{ scale: 0, opacity: 1 }}
                   animate={{ scale: 2, opacity: 0 }}
                   transition={{ duration: 0.6 }}
                   className="absolute inset-0 bg-white/20 rounded-full"
                 />
              )}
            </motion.button>
            
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                Local-First Persistence
              </p>
              <div className="h-1 w-12 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

// Internal Helper for ArrowRight if not imported
const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export default CreateSession;
