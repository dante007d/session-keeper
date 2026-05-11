import { useState } from "react";
import { motion } from "framer-motion";
import { useAnnouncements, Announcement } from "@/lib/announcementsStore";
import Navbar from "@/components/Navbar";

const TYPES: { id: Announcement["type"]; icon: string; label: string; color: string }[] = [
  { id: "info",    icon: "📢", label: "General",   color: "#4A6FA5" },
  { id: "success", icon: "🏆", label: "Achievement", color: "#2D9E6B" },
  { id: "warning", icon: "⚠️", label: "Reminder",  color: "#E8A020" },
  { id: "event",   icon: "📅", label: "Event",      color: "#886688" },
];

export default function TeacherAnnouncements() {
  const { announcements, publish, remove } = useAnnouncements();
  const [text, setText] = useState("");
  const [type, setType] = useState<Announcement["type"]>("info");

  const handlePublish = () => {
    if (!text.trim()) return;
    publish(text.trim(), type);
    setText("");
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-8 mt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-1">ANNOUNCEMENTS</p>
          <h1 className="font-bold text-5xl text-foreground tracking-tight italic">Broadcast.</h1>
        </motion.div>

        <div className="surface-card rounded-[2.5rem] p-8 border border-border shadow-elevated mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">New Announcement</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                           ${type === t.id ? "bg-foreground text-background" : "bg-secondary/40 text-muted-foreground hover:bg-secondary"}`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your announcement..."
            className="w-full h-32 px-4 py-3 rounded-2xl bg-secondary/30 border border-border
                      text-sm text-foreground placeholder:text-muted-foreground resize-none
                      focus:outline-none focus:border-primary transition-all"
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handlePublish}
              className="px-8 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Publish to Portal →
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Published History</p>
          {announcements.map((a) => (
            <div key={a.id} className="flex gap-4 surface-card rounded-2xl p-5 border border-border group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: TYPES.find(t => t.id === a.type)?.color }} />
              <span className="text-2xl flex-shrink-0">{TYPES.find(t => t.id === a.type)?.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground leading-relaxed">{a.text}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                  {new Date(a.publishedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => remove(a.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all px-2"
              >
                ✕
              </button>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <p className="font-bold text-sm italic">No announcements published yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
