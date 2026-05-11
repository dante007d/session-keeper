import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle2, AlertCircle, Download, FileJson, History, Hash, User, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { auditChain, AuditEntry } from "@/lib/phantom/audit";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = auditChain.getEntries();
      setEntries(data);
      const result = await auditChain.verifyChain();
      setIsValid(result.valid);
      setLoading(false);
    };
    load();
  }, []);

  const exportAudit = () => {
    const json = auditChain.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phantom_audit_master_${Date.now()}.json`;
    a.click();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <Link
                to="/teacher/dashboard"
                className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-4"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </Link>
              <h1 className="text-5xl font-black tracking-tighter">Audit Ledger.</h1>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">Tamper-Evident Institutional Trail</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className={cn(
                 "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border text-xs font-bold uppercase tracking-widest",
                 isValid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
               )}>
                 {isValid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                 Chain {isValid ? "Verified" : "Compromised"}
               </div>
               <button 
                 onClick={exportAudit}
                 className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
               >
                 <Download size={16} /> Export
               </button>
            </div>
          </header>

          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="surface-card rounded-[2.5rem] p-20 text-center border-dashed border-2 border-border/40">
                <History size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No audit entries found in this chronicle.</p>
              </div>
            ) : (
              entries.map((entry, i) => (
                <motion.div
                  key={entry.timestamp + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="surface-card rounded-3xl p-6 border border-border/40 flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                >
                   <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors" />
                   
                   <div className="flex-1 space-y-4">
                     <div className="flex flex-wrap items-center gap-4">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                          {format(entry.timestamp, "MMM d, HH:mm:ss.SSS")}
                        </span>
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                          entry.type === 'verdict_set' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                          entry.type === 'override' ? "bg-amber-500/10 border-amber-500/20 text-amber-600" :
                          "bg-primary/10 border-primary/20 text-primary"
                        )}>
                          {entry.type.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <User size={12} /> {entry.actor}
                        </span>
                     </div>

                     <div className="space-y-1">
                        <p className="font-bold text-sm">
                          {entry.type === 'room_open' && `Opened Phantom Mesh: ${entry.signals?.[0] || 'Unknown'}`}
                          {entry.type === 'room_close' && `Closed Phantom Mesh`}
                          {entry.type === 'verdict_set' && `Recorded Verdict: ${entry.studentId} -> ${entry.verdict}`}
                          {entry.type === 'override' && `Manual Override Applied for ${entry.studentId}`}
                        </p>
                        {entry.score !== undefined && (
                          <p className="text-xs text-muted-foreground">Computed Trust Score: <span className="font-mono font-bold">{entry.score}</span></p>
                        )}
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border/20" />
                        <div className="flex items-center gap-2">
                           <Hash size={10} className="text-muted-foreground/40" />
                           <span className="font-mono text-[9px] text-muted-foreground/40 truncate max-w-[200px]" title={entry.thisHash}>
                             {entry.thisHash}
                           </span>
                        </div>
                     </div>
                   </div>
                </motion.div>
              )).reverse()
            )}
          </div>
        </div>
      </main>
    </>
  );
}
