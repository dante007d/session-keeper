import { useEffect, useState, useCallback } from "react";

export interface Member {
  id: string;
  name: string;
  present: boolean;
}

export interface SessionDetails {
  resourcePersons: string;
  host: string;
  volunteers: string;
  summary: string;
}

export interface Session extends SessionDetails {
  id: string;
  title: string;
  createdAt: string; // ISO
  members: Member[];
}

const KEY = "bec.dev.sessions.v1";

const read = (): Session[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (sessions: Session[]) => {
  localStorage.setItem(KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent("bec:sessions-updated"));
};

export const sessionsStore = {
  list: read,
  get: (id: string) => read().find((s) => s.id === id),
  create: (s: Omit<Session, "id" | "createdAt">) => {
    const session: Session = {
      ...s,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    write([session, ...read()]);
    return session;
  },
  remove: (id: string) => write(read().filter((s) => s.id !== id)),
  clear: () => write([]),
};

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => read());

  useEffect(() => {
    const sync = () => setSessions(read());
    window.addEventListener("bec:sessions-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bec:sessions-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const remove = useCallback((id: string) => sessionsStore.remove(id), []);
  const clear = useCallback(() => sessionsStore.clear(), []);

  return { sessions, remove, clear };
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
