import React from 'react';
import anime from '@/lib/anime';
import { cn } from '@/lib/utils';

interface BubbleBurstProps {
  checked: boolean;
  onChange: () => void;
  size?: number;
  ariaLabel?: string;
}

const BubbleBurst: React.FC<BubbleBurstProps> = ({ checked, onChange, size = 32, ariaLabel }) => {
  const containerRef = React.useRef<HTMLButtonElement>(null);
  const circleRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onChange();
    
    // Trigger burst animation on check
    if (!checked && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Spawn particles
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        const angle = (i / 8) * 360;
        const dist = 20;
        
        p.style.cssText = `
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #B8860B;
          left: ${cx}px; top: ${cy}px;
          pointer-events: none;
          z-index: 10;
        `;
        containerRef.current.appendChild(p);

        const rad = (angle * Math.PI) / 180;
        anime({
          targets: p,
          translateX: Math.cos(rad) * dist,
          translateY: Math.sin(rad) * dist,
          opacity: [1, 0],
          scale: [1, 0],
          duration: 400,
          easing: 'easeOutExpo',
          complete: () => p.remove(),
        });
      }
    }

    // Scale animation for the circle
    anime({
      targets: circleRef.current,
      scale: [0.8, 1],
      duration: 300,
      easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
    });
  };

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className="relative flex items-center justify-center rounded-full overflow-visible"
      style={{ width: size, height: size }}
    >
      <div
        ref={circleRef}
        className={cn(
          "w-5 h-5 rounded-md border-2 transition-colors duration-300 flex items-center justify-center",
          checked ? "bg-primary border-primary" : "bg-transparent border-border"
        )}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default BubbleBurst;
