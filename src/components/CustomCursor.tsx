import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (isHidden) setIsHidden(false);
    };

    const handleHover = () => setIsHovered(true);
    const handleUnhover = () => setIsHovered(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .cursor-pointer'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleUnhover);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleUnhover);
      });
    };
  }, [cursorX, cursorY, isHidden]);

  // Use mutation observer to re-attach events when DOM changes
  useEffect(() => {
    const handleHover = () => setIsHovered(true);
    const handleUnhover = () => setIsHovered(false);
    
    const attachListeners = (nodes: NodeList) => {
      nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.matches && node.matches('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
            node.addEventListener("mouseenter", handleHover);
            node.addEventListener("mouseleave", handleUnhover);
          }
          const children = node.querySelectorAll('a, button, input, textarea, select, [role="button"], .cursor-pointer');
          children.forEach(child => {
            child.addEventListener("mouseenter", handleHover);
            child.addEventListener("mouseleave", handleUnhover);
          });
        }
      });
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          attachListeners(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Use CSS cursor for touch devices or if window is not defined
  if (typeof window === 'undefined' || matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "hsl(var(--primary))",
          boxShadow: "0 0 10px hsl(var(--primary) / 0.5)",
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 0 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[99998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid hsl(var(--primary) / 0.5)",
        }}
        animate={{
          scale: isHovered ? 1.15 : isClicking ? 0.9 : 1,
          backgroundColor: isHovered ? "hsl(var(--primary) / 0.1)" : "transparent",
          borderColor: isHovered ? "hsl(var(--primary) / 0.8)" : "hsl(var(--primary) / 0.3)",
          opacity: isHidden ? 0 : 1,
        }}
      />
    </>
  );
};
