import React from "react";
import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="surface-card rounded-[2rem] p-7 border border-border/40 overflow-hidden relative">
      {/* Shimmer effect */}
      <motion.div 
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent z-0"
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-secondary/60 animate-pulse" />
            <div className="h-6 w-48 rounded-lg bg-secondary animate-pulse" />
          </div>
          <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
        </div>

        <div className="h-4 w-32 rounded-lg bg-secondary/40 animate-pulse mb-8" />

        <div className="space-y-2">
           <div className="flex justify-between">
             <div className="h-2 w-16 rounded-full bg-secondary/60 animate-pulse" />
             <div className="h-2 w-8 rounded-full bg-secondary/60 animate-pulse" />
           </div>
           <div className="h-1.5 w-full rounded-full bg-secondary animate-pulse" />
        </div>

        <div className="mt-8 pt-5 border-t border-border/20 flex justify-between">
           <div className="flex -space-x-2">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-7 w-7 rounded-full border-2 border-card bg-secondary animate-pulse" />
             ))}
           </div>
           <div className="h-9 w-9 rounded-full bg-secondary animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(count).fill(0).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}
