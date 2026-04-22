import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRoster, type RosterMember } from "@/lib/rosterStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const RosterRow = memo(({ member, index, onRename, onRemove }: {
  member: RosterMember;
  index: number;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member.name);

  const commit = () => {
    const t = draft.trim();
    if (!t) {
      setDraft(member.name);
      setEditing(false);
      return;
    }
    if (t !== member.name) onRename(member.id, t);
    setEditing(false);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 border-b border-border/40 last:border-b-0 hover:bg-secondary/30 group"
    >
      <span className="font-mono text-[11px] text-muted-foreground/60 w-6 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      {editing ? (
        <input
          autoFocus
          value={draft}
          maxLength={80}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(member.name);
              setEditing(false);
            }
          }}
          className="h-9 px-3 rounded-lg bg-background border border-primary/40 text-[15px] font-medium outline-none focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-left text-[15px] font-medium truncate hover:text-primary transition-smooth"
        >
          {member.name}
        </button>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
        <button
          onClick={() => setEditing((p) => !p)}
          aria-label="Edit name"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => onRemove(member.id)}
          aria-label={`Remove ${member.name}`}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  );
});
RosterRow.displayName = "RosterRow";

const Members = () => {
  const { members, add, rename, remove } = useRoster();
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const result = add(trimmed);
    if (!result) {
      toast({ title: "Already in roster", description: trimmed, variant: "destructive" });
      return;
    }
    setName("");
  };

  const handleClear = () => {
    if (!confirm("Remove all members from your roster? This cannot be undone.")) return;
    members.forEach((m) => remove(m.id));
    toast({ title: "Roster cleared" });
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-16 pb-12 px-6">
        <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-60" aria-hidden />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="pb-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
              ROSTER
            </p>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[0.95]">
              Members.
              <br />
              <span className="font-accent text-gradient-red">Saved once. Used always.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Build your roster once. Pick from it when you create a session — no more retyping names.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="surface-card rounded-3xl overflow-hidden"
          >
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border/60 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 inline-flex items-center gap-1.5">
                  <Users className="h-3 w-3" /> Database
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">All members</h2>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
                <p className="font-mono text-3xl font-semibold tabular-nums">
                  {String(members.length).padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add member name…"
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                  className="flex-1 h-12 px-4 rounded-xl bg-secondary/40 border border-border text-sm placeholder:text-muted-foreground outline-none transition-smooth focus:border-primary/60 focus:ring-2 focus:ring-primary/15 focus:bg-secondary/60"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!name.trim()}
                  className={cn(
                    "h-12 px-5 rounded-xl font-medium text-sm transition-spring inline-flex items-center gap-1.5",
                    name.trim()
                      ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-glow-red"
                      : "bg-secondary text-muted-foreground/60 cursor-not-allowed",
                  )}
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              <div className="rounded-2xl bg-background/40 border border-border overflow-hidden">
                {members.length === 0 ? (
                  <div className="px-5 py-16 text-center">
                    <p className="font-dot text-2xl text-muted-foreground/40 tracking-widest mb-3">— EMPTY —</p>
                    <p className="text-sm text-muted-foreground">Add your first member above.</p>
                  </div>
                ) : (
                  <ul>
                    <AnimatePresence initial={false}>
                      {members.map((m, i) => (
                        <RosterRow
                          key={m.id}
                          member={m}
                          index={i}
                          onRename={rename}
                          onRemove={remove}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {members.length > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Click any name to edit
                  </p>
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-secondary/60 border border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
                  >
                    <Trash2 className="h-3 w-3" /> Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </>
  );
};

export default Members;
