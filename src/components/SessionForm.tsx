import { motion } from "framer-motion";
import FloatingField from "./FloatingField";

export interface SessionDetails {
  resourcePersons: string;
  host: string;
  volunteers: string;
  summary: string;
}

interface SessionFormProps {
  value: SessionDetails;
  onChange: (next: SessionDetails) => void;
}

const SessionForm = ({ value, onChange }: SessionFormProps) => {
  const update = <K extends keyof SessionDetails>(key: K, v: SessionDetails[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.05 }}
      className="surface-card rounded-3xl overflow-hidden relative"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Header */}
      <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-border/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
              01 / SESSION
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Session Details</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Capture the essentials. Keep it short.
            </p>
          </div>
          <span className="font-dot text-3xl text-muted-foreground/40 leading-none select-none">●●●</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 space-y-5">
        <FloatingField
          label="Resource Persons"
          value={value.resourcePersons}
          maxLength={200}
          onChange={(e) => update("resourcePersons", e.target.value)}
        />
        <FloatingField
          label="Session Host"
          value={value.host}
          maxLength={100}
          onChange={(e) => update("host", e.target.value)}
        />
        <FloatingField
          label="Volunteers"
          value={value.volunteers}
          maxLength={300}
          hint="Comma-separated names"
          onChange={(e) => update("volunteers", e.target.value)}
        />
        <FloatingField
          label="Session Summary"
          multiline
          rows={5}
          maxLength={1000}
          value={value.summary}
          hint={`${value.summary.length}/1000`}
          onChange={(e) => update("summary", e.target.value)}
        />
      </div>
    </motion.section>
  );
};

export default SessionForm;
