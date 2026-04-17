import { Users, Mic, HeartHandshake, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <section className="rounded-3xl bg-card shadow-panel overflow-hidden">
      <header className="bg-gradient-purple px-6 py-5 text-panel-purple-foreground flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight">Session Details</h2>
          <p className="text-xs text-white/80">Capture what happened in this session</p>
        </div>
      </header>

      <div className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="resource" className="flex items-center gap-2 text-sm font-semibold">
            <Mic className="h-4 w-4 text-primary" /> Resource Persons
          </Label>
          <Input
            id="resource"
            placeholder="e.g. Dr. Aditi Sharma, Mr. Rohan Kumar"
            value={value.resourcePersons}
            maxLength={200}
            onChange={(e) => update("resourcePersons", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="host" className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" /> Session Host
          </Label>
          <Input
            id="host"
            placeholder="Name of the host"
            value={value.host}
            maxLength={100}
            onChange={(e) => update("host", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="volunteers" className="flex items-center gap-2 text-sm font-semibold">
            <HeartHandshake className="h-4 w-4 text-primary" /> Volunteers
          </Label>
          <Input
            id="volunteers"
            placeholder="Comma-separated names"
            value={value.volunteers}
            maxLength={300}
            onChange={(e) => update("volunteers", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Separate multiple names with commas.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary" className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-primary" /> Session Summary
          </Label>
          <Textarea
            id="summary"
            placeholder="A brief description of what was covered…"
            rows={5}
            maxLength={1000}
            value={value.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
          <p className="text-xs text-muted-foreground text-right">
            {value.summary.length}/1000
          </p>
        </div>
      </div>
    </section>
  );
};

export default SessionForm;
