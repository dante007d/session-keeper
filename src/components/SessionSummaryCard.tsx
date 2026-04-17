import { Sparkles, Users, Mic, HeartHandshake, CheckCircle2, XCircle } from "lucide-react";
import type { SessionDetails } from "./SessionForm";
import type { Member } from "./AttendanceTable";

interface SessionSummaryCardProps {
  details: SessionDetails;
  members: Member[];
  generatedAt: Date;
}

const Field = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 font-semibold">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <p className="text-white/95 text-sm leading-relaxed">{value || <span className="text-white/40 italic">— not provided —</span>}</p>
  </div>
);

const SessionSummaryCard = ({ details, members, generatedAt }: SessionSummaryCardProps) => {
  const present = members.filter((m) => m.present);
  const absent = members.filter((m) => !m.present);

  return (
    <section className="rounded-3xl bg-gradient-dark text-surface-dark-foreground shadow-panel overflow-hidden border border-white/5">
      <header className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Session Summary</h2>
          <p className="text-xs text-white/60">
            Generated {generatedAt.toLocaleString()}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-full bg-present/20 text-present border border-present/30">
            {present.length} Present
          </span>
          <span className="px-3 py-1.5 rounded-full bg-absent/20 text-absent border border-absent/30">
            {absent.length} Absent
          </span>
        </div>
      </header>

      <div className="p-6 grid gap-6 md:grid-cols-2">
        <Field icon={Mic} label="Resource Persons" value={details.resourcePersons} />
        <Field icon={Users} label="Host" value={details.host} />
        <Field icon={HeartHandshake} label="Volunteers" value={details.volunteers} />
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Total Members
          </div>
          <p className="text-white/95 text-sm">{members.length}</p>
        </div>

        <div className="md:col-span-2 space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Session Goal / Summary
          </div>
          <p className="text-white/95 text-sm leading-relaxed whitespace-pre-wrap">
            {details.summary || <span className="text-white/40 italic">No summary provided.</span>}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-present font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Present ({present.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {present.length === 0 && <span className="text-white/40 text-xs italic">None</span>}
            {present.map((m) => (
              <span key={m.id} className="px-2.5 py-1 rounded-md bg-present/15 text-present text-xs border border-present/25">
                {m.name}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-absent font-semibold">
            <XCircle className="h-3.5 w-3.5" /> Absent ({absent.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {absent.length === 0 && <span className="text-white/40 text-xs italic">None</span>}
            {absent.map((m) => (
              <span key={m.id} className="px-2.5 py-1 rounded-md bg-absent/15 text-absent text-xs border border-absent/25">
                {m.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionSummaryCard;
