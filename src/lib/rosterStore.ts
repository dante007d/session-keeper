import { useCallback, useEffect, useState } from "react";

export interface RosterMember {
  id: string;
  name: string;
  createdAt: string;
}

const KEY = "bec.dev.roster.v1";
const EVT = "bec:roster-updated";

const read = (): RosterMember[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RosterMember[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (members: RosterMember[]) => {
  localStorage.setItem(KEY, JSON.stringify(members));
  window.dispatchEvent(new CustomEvent(EVT));
};

export const rosterStore = {
  list: read,
  add: (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const exists = read().some((m) => m.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return null;
    const member: RosterMember = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    write([member, ...read()]);
    return member;
  },
  rename: (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    write(read().map((m) => (m.id === id ? { ...m, name: trimmed } : m)));
  },
  remove: (id: string) => write(read().filter((m) => m.id !== id)),
  clear: () => write([]),
};

export function useRoster() {
  const [members, setMembers] = useState<RosterMember[]>(() => read());

  useEffect(() => {
    const sync = () => setMembers(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((name: string) => rosterStore.add(name), []);
  const rename = useCallback((id: string, name: string) => rosterStore.rename(id, name), []);
  const remove = useCallback((id: string) => rosterStore.remove(id), []);

  return { members, add, rename, remove };
}
