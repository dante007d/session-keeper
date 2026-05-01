import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus } from "lucide-react";
import { type Member } from "@/lib/rosterStore";
import { cn } from "@/lib/utils";

interface Props {
  members: Member[];
  onClose: () => void;
  onSave: (attendance: Record<string, boolean>) => void;
  initialAttendance?: Record<string, boolean>;
}

export function LiveSessionMode({ members, onClose, onSave, initialAttendance = {} }: Props) {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(initialAttendance);

  const toggleMember = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-background z-[300] flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-border bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-glow" />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Live Check-In Mode</span>
            <h2 className="text-xl font-bold tracking-tight">Active Session Roll Call</h2>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-right">
             <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Pulse</p>
             <p className="text-2xl font-bold tabular-nums">
               {presentCount}<span className="text-muted-foreground opacity-30 mx-1">/</span>{members.length}
             </p>
           </div>
           
           <div className="flex gap-2">
             <button
              onClick={() => onSave(attendance)}
              className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-glow-amber hover:scale-[1.03] transition-transform"
             >
               Compile & Finish
             </button>
             <button
              onClick={onClose}
              className="h-12 w-12 rounded-2xl glass border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
             >
               <X size={20} />
             </button>
           </div>
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-12 bg-dot-pattern">
        <div className="mx-auto max-w-6xl">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {members.map((m, i) => (
               <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleMember(m.id)}
                className={cn(
                  "p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-left relative overflow-hidden group",
                  attendance[m.id] 
                    ? "bg-primary/5 border-primary shadow-glow-amber" 
                    : "bg-card border-border/40 hover:border-primary/30"
                )}
               >
                 <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    {attendance[m.id] ? <Check size={80} /> : <Minus size={80} />}
                 </div>

                 <div className="relative z-10">
                   <div className={cn(
                     "h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 transition-colors",
                     attendance[m.id] ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                   )}>
                     {m.name.charAt(0)}
                   </div>
                   
                   <p className={cn(
                     "text-lg font-bold tracking-tight mb-1 transition-colors",
                     attendance[m.id] ? "text-primary" : "text-foreground"
                   )}>
                     {m.name}
                   </p>
                   
                   <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                     {attendance[m.id] ? "Confirmed Present" : "Mark Present"}
                   </p>
                 </div>
                 
                 {attendance[m.id] && (
                   <motion.div 
                    layoutId={`check-${m.id}`}
                    className="absolute top-6 right-6 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-glow"
                   >
                     <Check size={12} strokeWidth={3} />
                   </motion.div>
                 )}
               </motion.button>
             ))}
           </div>
        </div>
      </div>
      
      <footer className="px-8 py-6 border-t border-border bg-card/30 backdrop-blur-xl flex justify-center">
         <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
           Biometric Proxy Presence Protocol · Manual Override Enabled
         </p>
      </footer>
    </motion.div>
  );
}
