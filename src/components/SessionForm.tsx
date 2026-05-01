import { motion } from "framer-motion";
import { FloatingInput, StarRating, SESSION_TAGS } from "./ArtisticElements";
import { cn } from "@/lib/utils";

export interface SessionDetails {
  resourcePersons: string;
  host: string;
  volunteers: string;
  summary: string;
  rating: number;
  tags: string[];
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
              Capture the context of today's engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 space-y-8">
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

        {/* F2. Tags */}
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

        {/* F1. Rating */}
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

export default SessionForm;
