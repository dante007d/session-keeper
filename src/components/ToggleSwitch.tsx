import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
  size?: "sm" | "md";
}

const ToggleSwitch = ({ checked, onChange, ariaLabel, size = "md" }: ToggleSwitchProps) => {
  const dims = size === "sm"
    ? { w: "w-12", h: "h-7", knob: 22, pad: 3 }
    : { w: "w-14", h: "h-8", knob: 26, pad: 3 };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={cn(
        "relative inline-flex items-center rounded-full transition-smooth border",
        dims.w,
        dims.h,
        checked
          ? "bg-primary/90 border-primary/60 shadow-glow-red"
          : "bg-secondary border-border hover:border-white/15"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 32 }}
        className="absolute rounded-full bg-white shadow-lg"
        style={{
          width: dims.knob,
          height: dims.knob,
          left: checked ? `calc(100% - ${dims.knob + dims.pad}px)` : `${dims.pad}px`,
        }}
      />
    </button>
  );
};

export default ToggleSwitch;
