import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EvidenceTapePreloaderProps {
  onComplete?: () => void;
}

export const EvidenceTapePreloader: React.FC<EvidenceTapePreloaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState<boolean>(() => {
    // Check if reduced motion is preferred or if already played this session
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('nopreloader') === '1') return false;
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

    // Auto-dismiss after 1.4 seconds
    const timer = setTimeout(() => {
      dismiss();
    }, 1400);

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
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080D18] overflow-hidden select-none"
          role="dialog"
          aria-label="ScamTrace Evidence Tape Animation"
        >
          {/* Diagonal Forensic Security Tape 1 */}
          <motion.div
            initial={{ x: '-100%', rotate: -7 }}
            animate={{ x: '0%', rotate: -7 }}
            exit={{ x: '100%', transition: { duration: 0.45, ease: 'easeInOut' } }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-[125%] py-3.5 bg-[#141F30] text-[#22D3EE] font-black uppercase text-xs sm:text-sm tracking-widest shadow-2xl flex items-center justify-around border-y-2 border-[#22D3EE]/60 font-mono"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(34, 211, 238, 0.08) 20px, rgba(34, 211, 238, 0.08) 40px)',
            }}
          >
            <span>// SCAMTRACE FORENSIC CORDON //</span>
            <span>THREAT TELEMETRY: ACTIVE</span>
            <span>DO NOT COMPROMISE EVIDENCE //</span>
            <span>LEXICAL ENGINE INITIALIZED //</span>
          </motion.div>

          {/* Diagonal Forensic Security Tape 2 (Crossing) */}
          <motion.div
            initial={{ x: '100%', rotate: 5 }}
            animate={{ x: '0%', rotate: 5 }}
            exit={{ x: '-100%', transition: { duration: 0.45, ease: 'easeInOut' } }}
            transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
            className="w-[125%] py-3 bg-[#101827] text-[#2DD4BF] font-black uppercase text-xs sm:text-sm tracking-widest shadow-2xl flex items-center justify-around border-y-2 border-[#2DD4BF]/50 mt-4 font-mono"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(45, 212, 191, 0.08) 20px, rgba(45, 212, 191, 0.08) 40px)',
            }}
          >
            <span>DECONSTRUCT COERCION //</span>
            <span>EXPOSE THE EVIDENCE //</span>
            <span>ZERO EXTERNAL NETWORK RESOLUTION //</span>
          </motion.div>

          {/* Central Reticle Stamp */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="mt-8 text-center space-y-2 z-10"
          >
            <div className="font-display font-black text-2xl uppercase tracking-wider text-[#F1F5F9]">
              SCAMTRACE <span className="text-[#22D3EE]">AI</span>
            </div>
            <div className="text-[11px] font-mono tracking-widest text-[#94A3B8] uppercase">
              Initializing Evidence & Threat Intelligence Engine...
            </div>
          </motion.div>

          {/* Skip Button */}
          <button
            onClick={dismiss}
            className="absolute bottom-8 px-4 py-1.5 rounded-full border border-[rgba(148,163,184,0.3)] text-[#94A3B8] hover:text-[#22D3EE] hover:border-[#22D3EE] text-xs font-mono tracking-wider transition-colors cursor-pointer"
            aria-label="Skip preloader animation"
          >
            Skip [Esc]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
