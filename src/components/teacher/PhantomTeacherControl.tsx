import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Radio, Cpu, MousePointer2, Target, Activity, CheckCircle2, AlertTriangle, XCircle, Download, FileJson, Lock, Unlock, Hash } from "lucide-react";
import { usePhantomStore, PhantomSubmission } from "@/lib/attendanceStoreV2";
import { auditChain } from "@/lib/phantom/audit";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function PhantomTeacherControl() {
  const navigate = useNavigate();
  const { activeSession, closeRoom, submissions, trustEngine, pendingJoins, approveJoin, rejectJoin } = usePhantomStore();
  const [chainValid, setChainValid] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const checkChain = async () => {
      const result = await auditChain.verifyChain();
      setChainValid(result.valid);
    };
    checkChain();
  }, [submissions]);

  const exportAudit = () => {
    const json = auditChain.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phantom_audit_${activeSession.roomCode}_${Date.now()}.json`;
    a.click();
  };

  const SIGNAL_ICONS: Record<string, React.ReactNode> = {
    CRYPTO_JOIN: <Lock size={12} />,
    LAN_PROXIMITY: <Radio size={12} />,
    HARDWARE_FINGERPRINT: <Cpu size={12} />,
    PERCEPTUAL_CHALLENGE: <Target size={12} />,
    POINTER_BIOMETRICS: <MousePointer2 size={12} />,
    ROLLING_CHALLENGE: <Activity size={12} />,
  };

  return (
    <div className="space-y-6">
      {/* 1. ROOM STATUS BAR */}
      <div className="surface-card rounded-[2rem] p-6 border border-border/40 shadow-glow-soft">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phantom Room Active</p>
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                {activeSession.roomCode} <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest",
               chainValid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
             )}>
               <Hash size={12} /> Audit Chain: {chainValid ? "Valid" : "Compromised"}
             </div>
             <button 
               onClick={exportAudit}
               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all"
             >
               <FileJson size={12} /> Export Audit
             </button>
             <button 
               onClick={async () => {
                  await closeRoom();
                  navigate(`/teacher/session/${activeSession.sessionId}`);
                }}
               className="flex items-center gap-2 px-6 py-2 rounded-xl bg-foreground text-background text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
             >
               Finalize Session
             </button>
          </div>
        </div>

        {/* 2. REAL-TIME TELEMETRY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
           <StatusCard label="Mesh Peers" value={submissions.length} icon={<Users size={16} />} />
           <StatusCard label="Integrity Score" value="98.2%" icon={<Shield size={16} />} />
           <StatusCard 
             label="Hidden Threshold" 
             value={revealed ? `${trustEngine?.threshold}%` : "LOCKED"} 
             icon={revealed ? <Unlock size={16} /> : <Lock size={16} />}
             onClick={() => setRevealed(!revealed)}
           />
        </div>
      </div>

      {/* 2.5 PENDING REQUESTS (GATEKEEPER) */}
      {pendingJoins.some(p => p.status === 'pending') && (
        <div className="surface-card rounded-[2rem] border-2 border-amber-500/20 bg-amber-500/[0.02] overflow-hidden">
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/10 flex items-center gap-3 text-amber-600">
            <Lock size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Gatekeeper: Pending Entry Requests</h3>
          </div>
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {pendingJoins.filter(p => p.status === 'pending').map(p => (
                <motion.div 
                  key={p.studentId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-card rounded-2xl border border-amber-500/20 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Handshake Complete · Trust: {p.score}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => rejectJoin(p.studentId)}
                      className="px-4 py-2 rounded-xl text-destructive hover:bg-destructive/10 text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      Deny
                    </button>
                    <button 
                      onClick={() => approveJoin(p.studentId)}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:shadow-glow transition-all"
                    >
                      Allow Access
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 3. LIVE ROSTER */}
      <div className="surface-card rounded-[2rem] border border-border/40 overflow-hidden flex flex-col h-[500px]">
        <div className="p-6 border-b border-border/40 flex items-center justify-between sticky top-0 bg-card z-10">
          <div>
            <h3 className="text-lg font-bold">Live Roster.</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Signal Intelligence Feed</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2">Legend:</span>
            {Object.entries(SIGNAL_ICONS).map(([key, icon]) => (
              <div key={key} className="h-6 w-6 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground" title={key}>
                {icon}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <Radio size={40} className="mb-4 animate-pulse" />
                <p className="text-sm font-bold uppercase tracking-widest">Awaiting Proximity Handshake...</p>
              </div>
            ) : (
              submissions.map((s, i) => (
                <motion.div
                  key={s.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {Object.entries(s.signals).map(([key, verified]) => (
                          <div 
                            key={key} 
                            className={cn(
                              "flex items-center justify-center h-5 w-5 rounded-md transition-all",
                              verified ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary/40 text-muted-foreground/30"
                            )}
                          >
                            {SIGNAL_ICONS[key]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Trust Score</p>
                       <div className="flex items-center gap-2">
                         <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${s.score}%` }}
                             className={cn("h-full", s.score > 75 ? "bg-emerald-500" : s.score > 50 ? "bg-amber-500" : "bg-destructive")}
                           />
                         </div>
                         <span className="font-mono text-sm font-bold">{s.score}</span>
                       </div>
                    </div>

                    <div className="min-w-[100px] text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Verdict</p>
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                         s.verdict === 'present' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                         s.verdict === 'suspect' ? "bg-amber-500/10 border-amber-500/20 text-amber-600" :
                         "bg-destructive/10 border-destructive/20 text-destructive"
                       )}>
                         {s.verdict}
                       </span>
                    </div>
                  </div>
                </motion.div>
              )).reverse()
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, icon, onClick }: { label: string; value: string | number; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-5 rounded-2xl bg-secondary/30 border border-border/40 flex items-center justify-between",
        onClick && "cursor-pointer hover:bg-secondary/50 transition-all"
      )}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
        <p className="text-xl font-bold tracking-tight tabular-nums">{value}</p>
      </div>
      <div className="h-10 w-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
    </div>
  );
}
