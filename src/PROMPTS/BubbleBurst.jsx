import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPopSound } from '../utils/audio';

export default function BubbleBurst({ 
  onBurst, 
  isCompleted, 
  size = 40,
  text,
  customColor = 'var(--accent)'
}) {
  const [bursting, setBursting] = useState(false);
  
  const handlePointerDown = () => {
    if (isCompleted) {
        onBurst(true); // undo
        return;
    }
    setBursting(true);
    playPopSound();
    onBurst(false); // complete
    setTimeout(() => setBursting(false), 500);
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        onPointerDown={handlePointerDown}
        whileTap={{ scale: 0.92 }}
        animate={{ 
          backgroundColor: isCompleted ? customColor : 'transparent',
          color: isCompleted ? 'var(--bg)' : 'var(--text-muted)',
          borderColor: isCompleted ? customColor : 'var(--border)'
        }}
        transition={{ duration: 0.2 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
          border: '1px solid',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: size * 0.4,
          fontWeight: 700,
          zIndex: 2,
        }}
      >
        {text}
      </motion.div>

      <AnimatePresence>
        {bursting && (
           <>
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: customColor,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            {[0, 1, 2, 3, 4].map((i) => {
               const angle = (i / 5) * Math.PI * 2;
               return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ 
                      x: Math.cos(angle) * size, 
                      y: Math.sin(angle) * size, 
                      opacity: 0, 
                      scale: 0 
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: customColor,
                      zIndex: 3,
                      pointerEvents: 'none',
                    }}
                  />
               );
            })}
            <motion.div
              initial={{ y: -10, opacity: 1 }}
              animate={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                 position: 'absolute',
                 top: 0,
                 color: 'var(--accent)',
                 fontSize: '12px',
                 fontWeight: 'bold',
                 zIndex: 10,
                 pointerEvents: 'none'
              }}
            >
               +XP
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
