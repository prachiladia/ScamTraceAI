import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EvidenceTapePreloaderProps {
  onComplete?: () => void;
}

export const EvidenceTapePreloader: React.FC<EvidenceTapePreloaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState<boolean>(() => {
    // Check if reduced motion is preferred or if already played this session
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const alreadyPlayed = sessionStorage.getItem('scamtrace_preloader_seen');
      return !prefersReduced && !alreadyPlayed;
    }
    return false;
  });

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scamtrace_preloader_seen', 'true');
    }
    setVisible(false);
    onComplete?.();
  };

  useEffect(() => {
    if (!visible) return;

    // Auto-dismiss after 1.5 seconds
    const timer = setTimeout(() => {
      dismiss();
    }, 1500);

    // Keyboard listener for Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A0707] overflow-hidden select-none"
          role="dialog"
          aria-label="ScamTrace Evidence Unrolling Animation"
        >
          {/* Diagonal Hazard Evidence Tape 1 */}
          <motion.div
            initial={{ x: '-100%', rotate: -8 }}
            animate={{ x: '0%', rotate: -8 }}
            exit={{ x: '100%', transition: { duration: 0.5, ease: 'easeInOut' } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-[120%] py-3.5 bg-[#A82020] text-[#F3E6D5] font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-around border-y-4 border-[#FBE6C2] font-mono"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(0,0,0,0.15) 25px, rgba(0,0,0,0.15) 50px)',
            }}
          >
            <span>// SCAMTRACE EVIDENCE TAPE //</span>
            <span>CRIME SCENE: DIGITAL FRAUD</span>
            <span>DO NOT CROSS //</span>
            <span>VERIFIED FORENSIC INSPECTION //</span>
          </motion.div>

          {/* Diagonal Hazard Evidence Tape 2 (Crossing) */}
          <motion.div
            initial={{ x: '100%', rotate: 6 }}
            animate={{ x: '0%', rotate: 6 }}
            exit={{ x: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="w-[120%] py-3 bg-[#FBE6C2] text-[#6C1A1A] font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-around border-y-4 border-[#A82020] mt-4 font-mono"
          >
            <span>DECONSTRUCT THE COERCION //</span>
            <span>EXPOSE THE EVIDENCE //</span>
            <span>INTEGRITY VERIFIED //</span>
          </motion.div>

          {/* Central Stamp */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-8 text-center space-y-2 z-10"
          >
            <div className="font-display font-black text-2xl uppercase tracking-wider text-[#F3E6D5]">
              SCAMTRACE AI
            </div>
            <div className="text-[11px] font-mono tracking-widest text-[#FBE6C2]/80 uppercase">
              Initializing Forensic Investigation Engine...
            </div>
          </motion.div>

          {/* Skip Button */}
          <button
            onClick={dismiss}
            className="absolute bottom-8 px-4 py-1.5 rounded-full border border-[#FBE6C2]/40 text-[#FBE6C2] text-xs font-mono tracking-wider hover:bg-[#FBE6C2]/10 transition-colors cursor-pointer"
            aria-label="Skip preloader animation"
          >
            Skip [Esc]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
