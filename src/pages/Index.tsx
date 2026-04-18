import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SessionForm, { type SessionDetails } from "@/components/SessionForm";
import AttendanceTable, { type Member } from "@/components/AttendanceTable";
import SessionSummaryCard from "@/components/SessionSummaryCard";
import Navbar from "@/components/Navbar";

const initialMembers: Member[] = [
  { id: crypto.randomUUID(), name: "Aarav Patel", present: true },
  { id: crypto.randomUUID(), name: "Diya Sharma", present: true },
  { id: crypto.randomUUID(), name: "Kabir Singh", present: false },
  { id: crypto.randomUUID(), name: "Meera Iyer", present: true },
  { id: crypto.randomUUID(), name: "Rohan Verma", present: false },
];

const Index = () => {
  const [details, setDetails] = useState<SessionDetails>({
    resourcePersons: "",
    host: "",
    volunteers: "",
    summary: "",
  });
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const addMember = (name: string) =>
    setMembers((prev) => [...prev, { id: crypto.randomUUID(), name, present: true }]);
  const toggleMember = (id: string) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, present: !m.present } : m)));
  const removeMember = (id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  const handleSave = () => {
    if (!details.host.trim() && !details.resourcePersons.trim() && members.length === 0) {
      toast({
        title: "Nothing to save yet",
        description: "Add a host, resource persons, or members first.",
        variant: "destructive",
      });
      return;
    }
    setSavedAt(new Date());
    toast({
      title: "Session compiled",
      description: "Your summary is ready below.",
    });
    setTimeout(() => {
      document.getElementById("summary-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-20 px-6">
        {/* Background dot grid */}
        <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-60" aria-hidden />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-6xl">
          {/* Hero */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="text-center pt-8 pb-14"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-7"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                BEC DEV CLUB · ATTENDANCE OS
              </span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[0.95]"
            >
              Sessions, recorded
              <br />
              <span className="text-gradient-red">beautifully.</span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              A focused, minimal way to capture session details and mark attendance.
              Local-first. Zero clutter.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
            >
              <span>● Local-only</span>
              <span className="hidden sm:inline">●</span>
              <span className="hidden sm:inline">No account</span>
              <span>●</span>
              <span>Instant export</span>
            </motion.div>
          </motion.section>

          {/* Two-panel */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SessionForm value={details} onChange={setDetails} />
            <AttendanceTable
              members={members}
              onAdd={addMember}
              onToggle={toggleMember}
              onRemove={removeMember}
            />
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <button
              onClick={handleSave}
              className="group relative inline-flex items-center gap-3 h-14 px-8 rounded-full bg-foreground text-background font-medium tracking-tight text-[15px] transition-spring hover:scale-[1.03] active:scale-[0.98] shadow-elevated"
            >
              <span className="relative z-10">Compile Session</span>
              <span className="relative z-10 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground transition-spring group-hover:rotate-90">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
              <span className="absolute inset-0 rounded-full bg-foreground opacity-0 group-hover:opacity-100 blur-xl transition-smooth" aria-hidden />
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ⌘ Generates a shareable summary card below
            </p>
          </motion.div>

          {/* Summary */}
          {savedAt && (
            <div id="summary-card" className="mt-16 scroll-mt-28">
              <SessionSummaryCard details={details} members={members} generatedAt={savedAt} />
            </div>
          )}

          {/* Footer */}
          <footer className="mt-24 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-dot text-2xl text-muted-foreground/40 tracking-widest select-none">
              BEC · DEV · CLUB
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Built locally · Your data never leaves this browser
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Index;
