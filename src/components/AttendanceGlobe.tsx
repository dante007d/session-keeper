import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const AttendanceGlobe = ({ members = [], sessions = [] }: { members?: any[], sessions?: any[] }) => {
  const topMembers = useMemo(() => {
    return members.slice(0, 6);
  }, [members]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center">
        
        {topMembers.map((member, i) => {
          const orbitSize = 100 - (i * 12); 
          const speed = 15 + (i * 5); 
          const startRotation = i * 45;

          return (
            <div 
              key={member.name}
              className="absolute rounded-full border border-primary/10 flex items-center justify-center"
              style={{ width: `${orbitSize}%`, height: `${orbitSize}%` }}
            >
              <motion.div
                className="w-full h-full absolute"
                initial={{ rotate: startRotation }}
                animate={{ rotate: startRotation + 360 }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group">
                  <div className="h-3 w-3 rounded-full bg-primary/80 shadow-[0_0_15px_hsl(var(--primary))] flex items-center justify-center border-2 border-background cursor-pointer hover:scale-150 transition-transform">
                    <span className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-3 whitespace-nowrap bg-background glass px-3 py-1.5 rounded-lg border border-primary/20 text-[10px] font-bold tracking-widest text-primary shadow-glow transition-opacity pointer-events-none z-50">
                      {member.name} — {member.rate}%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="h-2 w-2 rounded-full bg-primary mb-2 shadow-glow animate-pulse" />
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Orbital</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Matrix</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceGlobe;
