import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSessions, formatDate } from "@/lib/sessionsStore";
import { useRoster } from "@/lib/rosterStore";
import { Search, Plus, LayoutGrid, Users, BarChart3, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
  sub?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const { members } = useRoster();

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const commands: Command[] = [
    { id: "new-session", label: "Create new session", icon: <Plus size={16} />, action: () => navigate("/new"), group: "Actions" },
    { id: "dashboard", label: "Go to Dashboard", icon: <LayoutGrid size={16} />, action: () => navigate("/"), group: "Navigation" },
    { id: "roster", label: "Go to Roster", icon: <Users size={16} />, action: () => navigate("/members"), group: "Navigation" },
    { id: "analytics", label: "Go to Analytics", icon: <BarChart3 size={16} />, action: () => navigate("/analytics"), group: "Navigation" },
    ...sessions.slice(0, 5).map((s) => ({
      id: s.id,
      label: s.title || "Untitled Session",
      icon: <Search size={16} />,
      action: () => navigate(`/session/${s.id}`),
      group: "Recent Sessions",
      sub: formatDate(s.createdAt),
    })),
    ...members.slice(0, 5).map((m) => ({
      id: m.id,
      label: m.name,
      icon: <Users size={16} />,
      action: () => {}, // Would open member profile if we had a path
      group: "Members",
    })),
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/40 backdrop-blur-md z-[200]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
              <Search className="text-muted-foreground" size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, sessions, members..."
                className="flex-1 bg-transparent font-medium text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded border border-border">
                ESC
              </kbd>
            </div>

            <div className="max-h-[400px] overflow-y-auto py-3">
              {Object.entries(grouped).map(([group, cmds]) => (
                <div key={group}>
                  <p className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {group}
                  </p>
                  {cmds.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-6 py-3 hover:bg-primary/5 group transition-colors"
                    >
                      <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-border">
                        {cmd.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {cmd.label}
                        </p>
                        {cmd.sub && (
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{cmd.sub}</p>
                        )}
                      </div>
                      <kbd className="font-mono text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        ↵
                      </kbd>
                    </button>
                  ))}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-sm text-muted-foreground font-medium">No results for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
