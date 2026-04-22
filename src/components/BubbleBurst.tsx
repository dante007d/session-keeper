import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface BubbleBurstProps {
  checked: boolean;
  onChange: () => void;
  size?: number;
  label?: string;
  ariaLabel?: string;
}

const BubbleBurst = ({ checked, onChange, size = 36, label, ariaLabel }: BubbleBurstProps) => {
  const [bursting, setBursting] = useState(false);

  const handleClick = () => {
    if (!checked) {
      // Marking present — play burst animation
      setBursting(true);

      setTimeout(() => setBursting(false), 500);
    }
    onChange();
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <motion.button
        type="button"
        aria-label={ariaLabel ?? (checked ? "Mark absent" : "Mark present")}
        onClick={handleClick}
        whileTap={{ scale: 0.88 }}
        animate={{
          backgroundColor: checked ? "hsl(var(--primary))" : "transparent",
          borderColor: checked ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-[2] flex items-center justify-center rounded-full border cursor-pointer"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.38,
          fontWeight: 700,
        }}
      >
        <motion.span
          animate={{
            color: checked ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
            scale: checked ? 1 : 0.9,
          }}
          transition={{ duration: 0.2 }}
          className="font-mono select-none"
        >
          {label ?? (checked ? "✓" : "○")}
        </motion.span>
      </motion.button>

      {/* Burst effects */}
      <AnimatePresence>
        {bursting && (
          <>
            {/* Expanding ring */}
            <motion.div
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pointer-events-none absolute z-[1] rounded-full bg-primary"
              style={{ width: size, height: size }}
            />
            {/* Particle dots */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * size * 0.9,
                    y: Math.sin(angle) * size * 0.9,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-none absolute z-[3] rounded-full bg-primary"
                  style={{ width: 5, height: 5 }}
                />
              );
            })}

          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(BubbleBurst);
