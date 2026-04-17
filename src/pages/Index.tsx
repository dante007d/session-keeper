import { useState } from "react";
import { Save, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import SessionForm, { type SessionDetails } from "@/components/SessionForm";
import AttendanceTable, { type Member } from "@/components/AttendanceTable";
import SessionSummaryCard from "@/components/SessionSummaryCard";

const initialMembers: Member[] = [
  { id: crypto.randomUUID(), name: "Aarav Patel", present: true },
  { id: crypto.randomUUID(), name: "Diya Sharma", present: true },
  { id: crypto.randomUUID(), name: "Kabir Singh", present: false },
  { id: crypto.randomUUID(), name: "Meera Iyer", present: true },
  { id: crypto.randomUUID(), name: "Rohan Verma", present: false },
];

const Index = () => {
  const [details, setDetails] = useState<SessionDetails>({
    resourcePersons: "",
    host: "",
    volunteers: "",
    summary: "",
  });
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const addMember = (name: string) =>
    setMembers((prev) => [...prev, { id: crypto.randomUUID(), name, present: true }]);
  const toggleMember = (id: string) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, present: !m.present } : m)));
  const removeMember = (id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  const handleSave = () => {
    if (!details.host.trim() && !details.resourcePersons.trim() && members.length === 0) {
      toast({
        title: "Nothing to save yet",
        description: "Add a host, resource persons, or members first.",
        variant: "destructive",
      });
      return;
    }
    setSavedAt(new Date());
    toast({
      title: "Session compiled",
      description: "Your session summary is ready below.",
    });
    setTimeout(() => {
      document.getElementById("summary-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-xs font-semibold border border-white/20">
            <GraduationCap className="h-4 w-4" />
            BEC DEV CLUB
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow">
            BEC DEV Attendance
          </h1>
          <p className="text-white/85 max-w-xl mx-auto text-sm sm:text-base">
            Record session details, mark attendance, and export a clean summary — all in one place.
          </p>
        </header>

        {/* Two-panel layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SessionForm value={details} onChange={setDetails} />
          <AttendanceTable
            members={members}
            onAdd={addMember}
            onToggle={toggleMember}
            onRemove={removeMember}
          />
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSave}
            className="bg-gradient-purple text-panel-purple-foreground hover:opacity-95 shadow-glow-purple px-8 h-12 text-base font-semibold rounded-xl"
          >
            <Save className="h-5 w-5 mr-2" />
            Export / Save Session
          </Button>
        </div>

        {/* Summary card */}
        {savedAt && (
          <div id="summary-card" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SessionSummaryCard details={details} members={members} generatedAt={savedAt} />
          </div>
        )}

        <footer className="text-center text-xs text-white/70 pt-4">
          Built for BEC DEV Club · Local-only, your data never leaves this browser.
        </footer>
      </div>
    </main>
  );
};

export default Index;
