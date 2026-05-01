import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the welcome screen after 4.5 seconds to give time to read the quote
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation to finish before unmounting
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const quote = "The faintest ink is more powerful than the strongest memory.";
  const author = "— Chinese Proverb";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center bg-background/90 backdrop-blur-3xl px-6 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-10 animate-pulse"
          >
            BEC DEV CLUB · ARCHIVE ENGINE
          </motion.div>
          
          <div className="max-w-5xl overflow-hidden relative px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl tracking-[-0.03em] leading-[1.15] flex flex-wrap justify-center gap-x-4 gap-y-2">
              {quote.split(" ").map((word, i) => {
                const isHighlight = word.includes("ink") || word.includes("powerful") || word.includes("memory");
                return (
                  <div key={i} className="overflow-hidden inline-flex pb-4 -mb-4 pt-4 -mt-4 px-2 -mx-2">
                    <motion.span
                      initial={{ y: "110%", opacity: 0, rotateZ: 4 }}
                      animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                      transition={{ 
                        delay: 0.6 + i * 0.1, 
                        duration: 1.2, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className={isHighlight ? "text-primary italic font-accent font-medium px-1" : "text-foreground font-semibold"}
                    >
                      {word}
                    </motion.span>
                  </div>
                );
              })}
            </h1>
          </div>
          
          <motion.div className="overflow-hidden mt-12">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-sm tracking-[0.2em] text-muted-foreground/60 uppercase"
            >
              {author}
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", maxWidth: "300px", opacity: 1 }}
            transition={{ delay: 1.8, duration: 2, ease: "circOut" }}
            className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-12"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
