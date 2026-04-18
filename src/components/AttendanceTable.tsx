import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ToggleSwitch from "./ToggleSwitch";

export interface Member {
  id: string;
  name: string;
  present: boolean;
}

interface AttendanceTableProps {
  members: Member[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const AttendanceTable = ({ members, onAdd, onToggle, onRemove }: AttendanceTableProps) => {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed.length > 80) return;
    onAdd(trimmed);
    setNewName("");
  };

  const present = members.filter((m) => m.present).length;
  const absent = members.length - present;
  const total = members.length;
  const ratio = total ? Math.round((present / total) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
      className="surface-card rounded-3xl overflow-hidden relative noise"
    >
      {/* Header */}
      <div className="relative px-8 pt-8 pb-6 border-b border-border/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
              02 / ROSTER
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Attendance</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Toggle each member. Add or remove as needed.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Present</p>
            <p className="font-mono text-3xl font-semibold tabular-nums">
              <span className="text-foreground">{present}</span>
              <span className="text-muted-foreground/40">/{total}</span>
            </p>
          </div>
        </div>

        {/* Ratio bar */}
        <div className="mt-5 h-1 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${ratio}%` }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-5">
        {/* Add member */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Add member name…"
              value={newName}
              maxLength={80}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="w-full h-12 px-4 rounded-xl bg-secondary/40 border border-border text-sm placeholder:text-muted-foreground outline-none transition-smooth focus:border-primary/60 focus:ring-2 focus:ring-primary/15 focus:bg-secondary/60"
            />
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="h-12 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-smooth disabled:opacity-40 shadow-glow-red"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add
          </Button>
        </div>

        {/* List */}
        <div className="rounded-2xl bg-background/40 border border-border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-3 border-b border-border/60 bg-secondary/30">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-6">#</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Member</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Status</span>
            <span className="sr-only">Remove</span>
          </div>

          {members.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">— roster empty —</p>
              <p className="text-sm text-muted-foreground mt-2">Add a member above to begin.</p>
            </div>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {members.map((m, i) => (
                  <motion.li
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-3.5 border-b border-border/40 last:border-b-0 transition-smooth hover:bg-secondary/30 group"
                  >
                    <span className="font-mono text-[11px] text-muted-foreground/60 w-6 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium truncate">{m.name}</p>
                      <p className={cn(
                        "text-[10px] font-mono uppercase tracking-widest mt-0.5 transition-smooth",
                        m.present ? "text-present" : "text-muted-foreground/60"
                      )}>
                        {m.present ? "● Present" : "○ Absent"}
                      </p>
                    </div>
                    <ToggleSwitch
                      size="sm"
                      checked={m.present}
                      onChange={() => onToggle(m.id)}
                      ariaLabel={m.present ? "Mark absent" : "Mark present"}
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(m.id)}
                      aria-label={`Remove ${m.name}`}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-primary/10 transition-smooth"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Present" value={present} accent="present" />
          <Stat label="Absent" value={absent} accent="absent" />
          <Stat label="Total" value={total} accent="muted" />
        </div>
      </div>
    </motion.section>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: number; accent: "present" | "absent" | "muted" }) => (
  <div className="rounded-xl bg-secondary/30 border border-border px-4 py-3">
    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className={cn(
      "text-2xl font-semibold tabular-nums mt-1",
      accent === "present" && "text-present",
      accent === "absent" && "text-primary",
      accent === "muted" && "text-foreground",
    )}>{String(value).padStart(2, "0")}</p>
  </div>
);

export default AttendanceTable;
