import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const EmptyArchive = () => {
  return (
    <div className="flex flex-col items-center py-20">
      {/* SVG Illustration — stacked floating cards */}
      <svg width="180" height="120" viewBox="0 0 180 120" className="mb-8">
        {/* Back card — most tilted */}
        <motion.g 
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: -8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ originX: '90px', originY: '60px' }}
        >
          <rect x="30" y="20" width="120" height="80" rx="12" fill="hsl(var(--muted) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1.5" />
          <rect x="44" y="38" width="60" height="6" rx="3" fill="hsl(var(--border))" />
          <rect x="44" y="50" width="40" height="4" rx="2" fill="hsl(var(--border))" />
        </motion.g>
        {/* Middle card */}
        <motion.g 
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: -3, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ originX: '90px', originY: '60px' }}
        >
          <rect x="25" y="16" width="120" height="80" rx="12" fill="hsl(var(--muted) / 0.6)" stroke="hsl(var(--border))" strokeWidth="1.5" />
          <rect x="40" y="34" width="70" height="6" rx="3" fill="hsl(var(--border))" />
          <rect x="40" y="46" width="50" height="4" rx="2" fill="hsl(var(--border))" />
          <rect x="40" y="56" width="30" height="4" rx="2" fill="hsl(var(--primary) / 0.4)" />
        </motion.g>
        {/* Front card — straight */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <rect x="20" y="12" width="120" height="80" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" filter="url(#cardShadow)" />
          <rect x="36" y="30" width="80" height="7" rx="3.5" fill="hsl(var(--foreground))" opacity="0.12" />
          <rect x="36" y="44" width="56" height="5" rx="2.5" fill="hsl(var(--border))" />
          <rect x="36" y="55" width="40" height="5" rx="2.5" fill="hsl(var(--border))" />
          {/* Gold accent bar */}
          <rect x="36" y="70" width="88" height="3" rx="1.5" fill="hsl(var(--primary))" opacity="0.25" />
        </motion.g>
        {/* Shadow filter */}
        <defs>
          <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.08" />
          </filter>
        </defs>
      </svg>

      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 mb-3">
        — ARCHIVE EMPTY —
      </p>
      <h3 className="text-2xl font-bold tracking-tight mb-2 text-center">
        No sessions yet
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed mb-8">
        Each session you compile becomes a permanent entry. Every detail preserved. Every member remembered.
      </p>
      <Link
        to="/new"
        className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-glow hover:scale-[1.03] transition-spring active:scale-[0.97]"
      >
        <Plus className="h-4 w-4" />
        Create first session
      </Link>
    </div>
  );
};

export default EmptyArchive;
