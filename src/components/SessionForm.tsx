import { motion, AnimatePresence } from "framer-motion";
import { FloatingInput, StarRating, SESSION_TAGS } from "./ArtisticElements";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

export interface Resource {
  label: string;
  url: string;
}

export interface SessionDetails {
  resourcePersons: string;
  host: string;
  volunteers: string;
  summary: string;
  attendanceType: 'normal' | 'phantom';
  rating: number;
  tags: string[];
  resources?: Resource[];
}

interface SessionFormProps {
  value: SessionDetails;
  onChange: (next: SessionDetails) => void;
}

const SessionForm = ({ value, onChange }: SessionFormProps) => {
  const update = <K extends keyof SessionDetails>(key: K, v: SessionDetails[K]) =>
    onChange({ ...value, [key]: v });

  const toggleTag = (tagId: string) => {
    const next = value.tags.includes(tagId)
      ? value.tags.filter(t => t !== tagId)
      : [...value.tags, tagId];
    update("tags", next);
  };

  const addResource = () => {
    const nextResources = [...(value.resources || []), { label: "", url: "" }];
    update("resources", nextResources);
  };

  const updateResource = (index: number, field: keyof Resource, v: string) => {
    const nextResources = (value.resources || []).map((r, i) => 
      i === index ? { ...r, [field]: v } : r
    );
    update("resources", nextResources);
  };

  const removeResource = (index: number) => {
    const nextResources = (value.resources || []).filter((_, i) => i !== index);
    update("resources", nextResources);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="surface-card rounded-[2rem] overflow-hidden relative shadow-elevated"
    >
      {/* Header */}
      <div className="relative px-8 pt-8 pb-6 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3 font-bold">
              <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2 align-middle animate-pulse" />
              SECTION 01 / DETAILS
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Session Intelligence</h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Configure your verification and content parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-8">
        {/* Attendance Type Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 ml-1">
            Attendance Verification Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => update("attendanceType", "normal")}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all text-left group",
                value.attendanceType === "normal" 
                  ? "bg-primary/5 border-primary shadow-glow-soft" 
                  : "bg-secondary/40 border-border/60 hover:border-primary/40"
              )}
            >
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-all", 
                value.attendanceType === "normal" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                <Plus size={16} />
              </div>
              <p className="font-bold text-sm">Standard PIN</p>
              <p className="text-[9px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Fast · Traditional · PIN/QR</p>
            </button>

            <button
              type="button"
              onClick={() => update("attendanceType", "phantom")}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all text-left group",
                value.attendanceType === "phantom" 
                  ? "bg-primary/5 border-primary shadow-glow-soft" 
                  : "bg-secondary/40 border-border/60 hover:border-primary/40"
              )}
            >
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-all", 
                value.attendanceType === "phantom" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                <Shield size={16} />
              </div>
              <p className="font-bold text-sm">Phantom Mesh</p>
              <p className="text-[9px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Secure · Cryptographic · Mesh</p>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <FloatingInput
            label="Resource Persons"
            placeholder="e.g. John Doe, Jane Smith"
            value={value.resourcePersons}
            onChange={(e) => update("resourcePersons", e.target.value)}
          />
          <FloatingInput
            label="Session Host"
            placeholder="Who is leading this session?"
            value={value.host}
            onChange={(e) => update("host", e.target.value)}
          />
          <FloatingInput
            label="Volunteers"
            placeholder="Names of support members"
            value={value.volunteers}
            onChange={(e) => update("volunteers", e.target.value)}
          />
          <div className="relative">
             <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3 ml-1">
               Session Summary
             </label>
             <textarea
                className="w-full p-4 rounded-2xl bg-card border border-border font-medium text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 min-h-[140px] resize-none"
                placeholder="What was the key takeaway?..."
                value={value.summary}
                onChange={(e) => update("summary", e.target.value)}
             />
          </div>
        </div>

        {/* Resources */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1">
              Session Resources
            </label>
            <button 
              type="button"
              onClick={addResource}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {(value.resources || []).map((res, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex gap-2 items-center"
                >
                  <input
                    placeholder="Label (e.g. Slides)"
                    className="w-1/3 p-3 rounded-xl bg-secondary/30 border border-border text-xs font-bold focus:outline-none focus:border-primary transition-all"
                    value={res.label}
                    onChange={(e) => updateResource(i, "label", e.target.value)}
                  />
                  <input
                    placeholder="https://..."
                    className="flex-1 p-3 rounded-xl bg-secondary/30 border border-border text-xs font-bold focus:outline-none focus:border-primary transition-all"
                    value={res.url}
                    onChange={(e) => updateResource(i, "url", e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => removeResource(i)}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {(value.resources || []).length === 0 && (
              <p className="text-[10px] font-bold text-muted-foreground italic ml-1">Optional resource links for students.</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 ml-1">
            Categorization
          </label>
          <div className="flex flex-wrap gap-2">
            {SESSION_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all duration-200",
                  value.tags.includes(tag.id)
                    ? "bg-primary text-primary-foreground border-primary shadow-glow-soft"
                    : "bg-secondary/40 text-muted-foreground border-border/60 hover:border-primary/40"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="pt-2">
          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 ml-1">
            Session Quality Rating
          </label>
          <StarRating 
            value={value.rating} 
            onChange={(v) => update("rating", v)} 
          />
        </div>
      </div>
    </motion.section>
  );
};

import { Shield } from "lucide-react";

export default SessionForm;
