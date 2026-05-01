import { useMemo, useState, useEffect, useRef } from "react";
import anime from "@/lib/anime";
import { Plus, Search, UserPlus, X, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BubbleBurst from "./BubbleBurst";
import { useRoster } from "@/lib/rosterStore";

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
  onPickFromRoster: (names: string[]) => void;
}

const AttendanceTable = ({ members, onAdd, onToggle, onRemove, onPickFromRoster }: AttendanceTableProps) => {
  const [newName, setNewName] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    anime({
      targets: sectionRef.current,
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
      easing: 'cubicBezier(0.32, 0.72, 0, 1)',
      delay: 100
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="surface-card rounded-3xl overflow-hidden relative"
      style={{ opacity: 0, transform: 'translateY(12px)', willChange: "transform, opacity" }}
    >
      <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-border/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle" />
              02 / ROSTER
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Attendance</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Pick from roster or add ad-hoc names.
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

        <div className="mt-5 h-1 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        <Button
          type="button"
          onClick={() => setPickerOpen(true)}
          variant="outline"
          className="w-full h-12 rounded-xl bg-secondary/30 border-border hover:border-primary/40 hover:bg-secondary/50 text-sm font-medium transition-smooth justify-start gap-2"
        >
          <Users className="h-4 w-4 text-primary" />
          Pick from roster
          <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">+ multi-select</span>
        </Button>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Or add a one-off name…"
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
            className="h-12 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-smooth disabled:opacity-40"
          >
            <UserPlus className="h-4 w-4 mr-1.5" /> Add
          </Button>
        </div>

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
              <p className="text-sm text-muted-foreground mt-2">Pick from roster above to begin.</p>
              <Link
                to="/members"
                className="inline-flex items-center gap-1.5 mt-4 h-9 px-3.5 rounded-full bg-secondary border border-border text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Plus className="h-3 w-3" /> Manage roster
              </Link>
            </div>
          ) : (
            <ul>
                {members.map((m, i) => (
                  <li
                    key={m.id}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-3.5 border-b border-border/40 last:border-b-0 hover:bg-secondary/30 group"
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
                    <BubbleBurst
                      checked={m.present}
                      onChange={() => onToggle(m.id)}
                      size={32}
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
                  </li>
                ))}
            </ul>
          )}
        </div>

        <AttendanceDonut presentCount={present} absentCount={absent} total={total} />
      </div>

      <RosterPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        existingNames={members.map((m) => m.name.toLowerCase())}
        onConfirm={(names) => {
          onPickFromRoster(names);
          setPickerOpen(false);
        }}
      />
    </section>
  );
};

const RosterPicker = ({
  open,
  onClose,
  existingNames,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  existingNames: string[];
  onConfirm: (names: string[]) => void;
}) => {
  const { members } = useRoster();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setQuery("");
      
      const t = setTimeout(() => {
        anime({
          targets: modalRef.current,
          translateY: [24, 0],
          opacity: [0, 1],
          duration: 300,
          easing: 'cubicBezier(0.32, 0.72, 0, 1)'
        });
      }, 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => !q || m.name.toLowerCase().includes(q));
  }, [members, query]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const selectAll = () => {
    const all = new Set(filtered.filter((m) => !existingNames.includes(m.name.toLowerCase())).map((m) => m.id));
    setSelected(all);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-lg surface-card rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{ opacity: 0, transform: 'translateY(24px)', willChange: "transform, opacity" }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle" />
                ROSTER
              </p>
              <h3 className="text-xl font-semibold tracking-tight">Pick attendees</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {selected.size} selected · {filtered.length} shown
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-secondary/60 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roster"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/50 border border-border/70 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-smooth"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {members.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="font-dot text-2xl text-muted-foreground/40 tracking-widest mb-3">— EMPTY —</p>
              <p className="text-sm text-muted-foreground mb-4">Your roster is empty. Add members first.</p>
              <Link
                to="/members"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium transition-spring hover:scale-[1.03]"
              >
                <Plus className="h-3.5 w-3.5" /> Add members
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-muted-foreground font-mono">No match</p>
          ) : (
            <ul>
              {filtered.map((m) => {
                const already = existingNames.includes(m.name.toLowerCase());
                const checked = selected.has(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      disabled={already}
                      onClick={() => toggle(m.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-smooth",
                        already && "opacity-50 cursor-not-allowed",
                        !already && checked && "bg-primary/10",
                        !already && !checked && "hover:bg-secondary/40",
                      )}
                    >
                      <span className={cn(
                        "h-5 w-5 rounded-md border flex items-center justify-center transition-smooth shrink-0",
                        checked ? "bg-primary border-primary" : "border-border bg-background",
                      )}>
                        {checked && <span className="text-primary-foreground text-[10px]">✓</span>}
                      </span>
                      <span className="text-[15px] font-medium truncate flex-1">{m.name}</span>
                      {already && (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">added</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between gap-3">
          <button
            onClick={selectAll}
            disabled={members.length === 0}
            className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-40"
          >
            Select all
          </button>
          <Button
            type="button"
            disabled={selected.size === 0}
            onClick={() => {
              const names = members.filter((m) => selected.has(m.id)).map((m) => m.name);
              onConfirm(names);
            }}
            className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm transition-spring hover:scale-[1.03] disabled:opacity-40"
          >
            Add {selected.size > 0 ? `${selected.size} ` : ""}member{selected.size === 1 ? "" : "s"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const AttendanceDonut = ({ presentCount, absentCount, total }: { presentCount: number; absentCount: number; total: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? presentCount / total : 0;

  return (
    <div className="flex items-center gap-6 mb-2">
      <div className="relative w-24 h-24 shrink-0">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 48 48)"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold text-xl">{presentCount}</span>
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">present</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-2xl text-present">{String(presentCount).padStart(2, "0")}</span>
          <span className="font-mono text-xs text-muted-foreground">present</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-2xl text-primary">{String(absentCount).padStart(2, "0")}</span>
          <span className="font-mono text-xs text-muted-foreground">absent</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-2xl">{String(total).padStart(2, "0")}</span>
          <span className="font-mono text-xs text-muted-foreground">total</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
