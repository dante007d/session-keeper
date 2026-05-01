import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const Logo3D: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-10 w-10 rounded-[14px] bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center shadow-glow border border-primary/40 group cursor-crosshair overflow-visible"
      >
        {/* Floating Core Graphic */}
        <div 
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="font-display font-extrabold text-xl tracking-tighter text-primary-foreground drop-shadow-md pr-0.5">
            DC
          </span>
        </div>
        
        {/* Spinning Interactive Outer Ring */}
        <div
          style={{ transform: "translateZ(15px)" }}
          className="absolute inset-1 border-[1.5px] border-primary-foreground/30 rounded-[10px] rounded-tr-[24px] rounded-bl-[24px] group-hover:rotate-180 transition-transform duration-700 ease-in-out pointer-events-none"
        />
        
        {/* Deep background shadow */}
        <div
          style={{ transform: "translateZ(-20px) scale(0.9)" }}
          className="absolute inset-0 bg-primary/40 blur-xl rounded-full pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
