import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SessionSummaryCard from "@/components/SessionSummaryCard";
import { Session, sessionsStore } from "@/lib/sessionsStore";
import { toast } from "@/hooks/use-toast";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = sessionsStore.get(id);
    if (!found) setNotFound(true);
    else setSession(found);
  }, [id]);

  const handleDelete = () => {
    if (!session) return;
    if (!confirm("Delete this session? This cannot be undone.")) return;
    sessionsStore.remove(session.id);
    toast({ title: "Session deleted" });
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20 pb-20 px-6">
        <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-60" aria-hidden />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            {session && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-secondary/60 border border-border text-muted-foreground hover:text-primary hover:border-primary/40 text-[11px] font-mono uppercase tracking-widest transition-smooth"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </motion.div>

          {notFound && (
            <div className="surface-card rounded-3xl px-8 py-20 text-center">
              <p className="font-dot text-3xl text-muted-foreground/40 mb-4 tracking-widest">— 404 —</p>
              <h3 className="text-xl font-semibold tracking-tight">Session not found</h3>
              <p className="text-sm text-muted-foreground mt-2">It may have been deleted.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-6 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-spring hover:scale-[1.03] shadow-glow-red"
              >
                Back to Dashboard
              </Link>
            </div>
          )}

          {session && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 align-middle animate-pulse-dot" />
                  ARCHIVED SESSION
                </p>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1]">
                  {session.title}
                </h1>
              </motion.div>

              <SessionSummaryCard
                details={{
                  resourcePersons: session.resourcePersons,
                  host: session.host,
                  volunteers: session.volunteers,
                  summary: session.summary,
                }}
                members={session.members}
                generatedAt={new Date(session.createdAt)}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default SessionDetail;
