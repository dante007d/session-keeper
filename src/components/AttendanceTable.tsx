import { useState } from "react";
import { Check, X, Plus, Trash2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

  return (
    <section className="rounded-3xl bg-card shadow-panel overflow-hidden">
      <header className="bg-gradient-green px-6 py-5 text-panel-green-foreground flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold leading-tight">Attendance</h2>
          <p className="text-xs text-white/85">Mark members present or absent</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
            ✅ {present}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
            ❌ {absent}
          </span>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {/* Add member */}
        <div className="flex gap-2">
          <Input
            placeholder="Add new member name…"
            value={newName}
            maxLength={80}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="bg-gradient-green text-panel-green-foreground hover:opacity-95 shadow-glow-green"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2.5 bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Name</span>
            <span>Present?</span>
            <span className="sr-only">Remove</span>
          </div>

          {members.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No members yet. Add one above to get started.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 transition-base hover:bg-accent/50"
                >
                  <span className="font-medium text-sm truncate">{m.name}</span>

                  <button
                    type="button"
                    onClick={() => onToggle(m.id)}
                    aria-label={m.present ? "Mark absent" : "Mark present"}
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center transition-base font-bold",
                      m.present
                        ? "bg-present text-white shadow-glow-green hover:scale-105"
                        : "bg-absent text-white hover:scale-105"
                    )}
                  >
                    {m.present ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemove(m.id)}
                    aria-label={`Remove ${m.name}`}
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-base"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm">
          <span className="font-semibold">
            <span className="text-present">{present} Present</span>
            <span className="text-muted-foreground"> / </span>
            <span className="text-absent">{absent} Absent</span>
          </span>
          <span className="text-muted-foreground">out of {members.length}</span>
        </div>
      </div>
    </section>
  );
};

export default AttendanceTable;
