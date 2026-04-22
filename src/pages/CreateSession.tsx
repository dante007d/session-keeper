import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import SessionForm, { type SessionDetails } from "@/components/SessionForm";
import AttendanceTable, { type Member } from "@/components/AttendanceTable";
import Navbar from "@/components/Navbar";
import FloatingField from "@/components/FloatingField";
import { sessionsStore } from "@/lib/sessionsStore";


const CreateSession = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState<SessionDetails>({
    resourcePersons: "",
    host: "",
    volunteers: "",
    summary: "",
  });
  const [members, setMembers] = useState<Member[]>([]);

  const addMember = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMembers((prev) => {
      if (prev.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, { id: crypto.randomUUID(), name: trimmed, present: true }];
    });
  };
  const toggleMember = (id: string) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, present: !m.present } : m)));
  const removeMember = (id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));
  const pickFromRoster = (names: string[]) =>
    setMembers((prev) => {
      const have = new Set(prev.map((m) => m.name.toLowerCase()));
      const additions = names
        .filter((n) => !have.has(n.toLowerCase()))
        .map((name) => ({ id: crypto.randomUUID(), name, present: true }));
      return [...prev, ...additions];
    });

  const handleSave = () => {
    if (!title.trim() && !details.host.trim() && members.length === 0) {
      toast({
        title: "Nothing to save yet",
        description: "Add a title, host, or members first.",
        variant: "destructive",
      });
      return;
    }
    const session = sessionsStore.create({
      title: title.trim() || "Untitled session",
      ...details,
      members,
    });
    toast({ title: "Session compiled", description: "Saved to your archive." });
    navigate(`/session/${session.id}`);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-16 pb-12 px-6">
        <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-60" aria-hidden />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-6xl">
          {/* Hero */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
            className="pt-2 pb-6"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth mb-6"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
              </Link>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[0.95]"
            >
              New session.
              <br />
              <span className="font-accent text-gradient-red">Make it count.</span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6 }}
              className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed"
            >
              Capture details, mark the roster, compile.
            </motion.p>

            {/* Title field */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6 }}
              className="mt-6 max-w-2xl"
            >
              <FloatingField
                label="Session Title"
                value={title}
                maxLength={120}
                onChange={(e) => setTitle(e.target.value)}
                hint={`${title.length}/120`}
              />
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
              onPickFromRoster={pickFromRoster}
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
              <span className="relative z-10">Compile & Save</span>
              <span className="relative z-10 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground transition-spring group-hover:rotate-90">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
              <span className="absolute inset-0 rounded-full bg-foreground opacity-0 group-hover:opacity-100 blur-xl transition-smooth" aria-hidden />
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              ⌘ Stored to your local archive
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default CreateSession;
