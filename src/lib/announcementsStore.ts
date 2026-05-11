import { useEffect, useState, useCallback } from "react";

export interface Announcement {
  id: number;
  text: string;
  type: "info" | "success" | "warning" | "event";
  publishedAt: string;
}

const KEY = "bec_announcements";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    const sync = () => {
      const raw = localStorage.getItem(KEY);
      setAnnouncements(raw ? JSON.parse(raw) : []);
    };
    window.addEventListener("storage", sync);
    window.addEventListener("bec:announcements-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("bec:announcements-updated", sync);
    };
  }, []);

  const publish = useCallback((text: string, type: Announcement["type"]) => {
    const newA: Announcement = {
      id: Date.now(),
      text,
      type,
      publishedAt: new Date().toISOString(),
    };
    const updated = [newA, ...announcements];
    localStorage.setItem(KEY, JSON.stringify(updated));
    setAnnouncements(updated);
    window.dispatchEvent(new CustomEvent("bec:announcements-updated"));
  }, [announcements]);

  const remove = useCallback((id: number) => {
    const updated = announcements.filter((a) => a.id !== id);
    localStorage.setItem(KEY, JSON.stringify(updated));
    setAnnouncements(updated);
    window.dispatchEvent(new CustomEvent("bec:announcements-updated"));
  }, [announcements]);

  return { announcements, publish, remove };
}
