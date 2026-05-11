import React, { memo, useEffect, useRef } from "react";
import anime from "@/lib/anime";
import { animateSessionCards } from "@/animations/cardAnimations";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { type Session, formatDate } from "@/lib/sessionsStore";
import { TiltCard, AttendanceBar, TagChip } from "./ArtisticElements";
import { exportSessionPDF } from "@/utils/pdfExport";

interface Props {
  session: Session;
  index?: number;
}

const SessionCard = ({ session, index = 0 }: Props) => {
  const [flipped, setFlipped] = React.useState(false);
  const total = session.members.length;
  const present = session.members.filter((m) => m.present).length;

  const handleExport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    exportSessionPDF(session);
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    const isFlipped = !flipped;
    setFlipped(isFlipped);
    
    anime({
      targets: innerRef.current,
      rotateY: isFlipped ? 180 : 0,
      duration: 600,
      easing: 'cubicBezier(0.16, 1, 0.3, 1)'
    });
  };

  useEffect(() => {
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [15, 0],
      scale: [0.98, 1],
      duration: 500,
      delay: Math.min(0.05 * index, 0.3) * 1000,
      easing: 'cubicBezier(0.34, 1.56, 0.64, 1)'
    });
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="perspective-1000 h-[280px]"
      style={{ opacity: 0, transform: 'translateY(15px) scale(0.98)' }}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full transform-style-3d cursor-pointer"
        onClick={toggleFlip}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 backface-hidden z-10">
          <TiltCard className="h-full">
            <div className="h-full surface-card rounded-[2.5rem] p-7 border border-border/40 flex flex-col justify-between overflow-hidden relative shadow-elevated">
              <div className="absolute -right-4 -bottom-4 text-primary/[0.03] rotate-12 pointer-events-none">
                <FileText size={140} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
                    {formatDate(session.createdAt)}
                  </p>
                  {session.tags && session.tags.length > 0 && (
                    <TagChip tagId={session.tags[0]} />
                  )}
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors mb-2">
                  {session.title || "Untitled Session"}
                </h3>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-muted-foreground">H</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {session.host || "No host assigned"}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <AttendanceBar present={present} total={total} />
                <div className="mt-6 pt-4 border-t border-border/20 flex justify-between items-center">
                   <div className="flex -space-x-2">
                     {session.members.slice(0, 3).map((m, i) => (
                       <div key={i} className={cn("h-7 w-7 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold", m.present ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                         {m.name.charAt(0)}
                       </div>
                     ))}
                   </div>
                   <p className="font-mono text-[9px] font-bold text-primary uppercase tracking-widest">Flip for detail ↗</p>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 z-0">
          <div className="h-full surface-card rounded-[2.5rem] p-7 border-2 border-primary/40 bg-primary/[0.02] flex flex-col justify-between overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary font-bold mb-4">Detailed Metrics</p>
              <p className="text-sm text-foreground font-medium line-clamp-3 leading-relaxed mb-6">
                {session.host ? `Hosted by ${session.host}. ` : ""}
                {session.members.length} members tracked. 
                Consistency rate of {Math.round((present / total) * 100)}%.
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                 <div className="space-y-1">
                   <p className="font-mono text-xl font-bold text-primary">{present}</p>
                   <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Present</p>
                 </div>
                 <div className="space-y-1">
                   <p className="font-mono text-xl font-bold text-muted-foreground">{total - present}</p>
                   <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Absent</p>
                 </div>
                 <div className="space-y-1">
                   <p className="font-mono text-xl font-bold text-foreground">{total}</p>
                   <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Total</p>
                 </div>
              </div>
            </div>

            <div className="flex gap-2">
               <Link 
                to={`/teacher/session/${session.id}`}
                className="flex-1 h-11 rounded-2xl bg-foreground text-background font-bold text-xs flex items-center justify-center hover:scale-[1.02] transition-transform active:scale-[0.98]"
               >
                 View Record
               </Link>
               <button
                onClick={handleExport}
                className="h-11 w-11 rounded-2xl glass border-primary/20 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                title="Export PDF"
               >
                 <Download size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for cn in case it's not imported properly
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default memo(SessionCard);
