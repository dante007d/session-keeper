import React from "react";
import anime from "@/lib/anime";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = React.memo(({ children, className }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    anime({
      targets: cardRef.current,
      scale: 1.02,
      rotateX: 2,
      rotateY: -2,
      duration: 400,
      easing: 'easeOutQuad'
    });
  };

  const handleMouseLeave = () => {
    anime({
      targets: cardRef.current,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 400,
      easing: 'easeOutQuad'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", className)}
    >
      {children}
    </div>
  );
});

interface AttendanceBarProps {
  present: number;
  total: number;
}

export const AttendanceBar: React.FC<AttendanceBarProps> = ({ present, total }) => {
  const percentage = total > 0 ? (present / total) * 100 : 0;
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    anime({
      targets: barRef.current,
      width: `${percentage}%`,
      duration: 1000,
      easing: 'easeOutQuart',
      delay: 300
    });
  }, [percentage]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
        <span>Attendance</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
        <div
          ref={barRef}
          style={{ width: 0 }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
};

interface TagChipProps {
  tagId: string;
}

export const TagChip: React.FC<TagChipProps> = ({ tagId }) => {
  return (
    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
      {tagId}
    </span>
  );
};

interface MaskedWordProps {
  word: string;
  delay?: number;
}

export const MaskedWord: React.FC<MaskedWordProps> = React.memo(({ word, delay = 0 }) => {
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    anime({
      targets: textRef.current,
      translateY: [ "100%", "0%" ],
      opacity: [ 0, 1 ],
      duration: 800,
      delay: delay * 1000,
      easing: 'cubicBezier(0.16, 1, 0.3, 1)'
    });
  }, [delay]);

  return (
    <span className="inline-block overflow-hidden mr-[0.25em] align-top pb-3 -mb-3 pt-3 -mt-3 px-1 -mx-1">
      <span
        ref={textRef}
        style={{ transform: 'translateY(100%)', opacity: 0 }}
        className="inline-block"
      >
        {word}
      </span>
    </span>
  );
});

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 1000, delay = 0 }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const valObj = React.useRef({ val: 0 });

  React.useEffect(() => {
    anime({
      targets: valObj.current,
      val: value,
      duration: duration,
      delay: delay,
      round: 1,
      easing: 'easeOutQuart',
      update: () => {
        setDisplayValue(valObj.current.val);
      }
    });
  }, [value, duration, delay]);

  return <span>{displayValue}</span>;
};

export const SESSION_TAGS = [
  { id: "workshop", label: "Workshop" },
  { id: "lecture", label: "Lecture" },
  { id: "social", label: "Social" },
  { id: "project", label: "Project" },
];

export const FloatingInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => {
  return (
    <div className="relative group">
      <input
        {...props}
        className={cn(
          "peer w-full h-12 px-4 pt-4 rounded-xl bg-secondary/40 border border-border text-sm outline-none transition-smooth focus:border-primary/60 focus:ring-2 focus:ring-primary/15",
          props.className
        )}
        placeholder=" "
      />
      <label className="absolute left-4 top-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none">
        {label}
      </label>
    </div>
  );
};

export const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-smooth",
            s <= value ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary"
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
};
