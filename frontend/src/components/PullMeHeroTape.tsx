import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Sparkles } from 'lucide-react';

export const PullMeHeroTape: React.FC = () => {
  const navigate = useNavigate();
  const [triggered, setTriggered] = useState(false);
  const dragY = useMotionValue(0);

  // Transform drag distance into visual cues
  const tapeWidth = useTransform(dragY, [0, 150], ['240px', '480px']);
  const tapeOpacity = useTransform(dragY, [0, 150], [0.95, 1]);

  const handlePullComplete = () => {
    if (triggered) return;
    setTriggered(true);
    setTimeout(() => {
      navigate('/investigate');
    }, 400);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-8 select-none">
      {/* Keyboard-accessible bypass button */}
      <div className="sr-only">
        <button
          onClick={handlePullComplete}
          aria-label="Pull evidence tape to launch scam analyzer"
        >
          Launch Scam Analyzer
        </button>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Pull tab container */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 160 }}
          dragElastic={0.15}
          style={{ y: dragY, width: tapeWidth, opacity: tapeOpacity }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 85) {
              handlePullComplete();
            }
          }}
          className={`relative z-20 py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing border-2 transition-all ${
            triggered
              ? 'bg-[var(--accent-secondary)] text-[#080D18] border-[var(--accent-secondary)] shadow-[0_0_25px_rgba(45,212,191,0.4)]'
              : 'bg-[var(--surface-elevated)] text-[var(--accent-primary)] border-[var(--accent-primary)]/50 hover:border-[var(--accent-primary)] shadow-[0_0_20px_rgba(34,211,238,0.18)]'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePullComplete();
            }
          }}
          aria-label="Draggable evidence tape: Pull down or press Enter to launch investigation"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-ping" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider">
              {triggered ? 'DECONSTRUCTING EVIDENCE...' : 'PULL TO UNCOVER EVIDENCE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-black/40 px-2.5 py-1 rounded-lg text-[var(--text-primary)]">
            {triggered ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#080D18]" />
            ) : (
              <>
                <span className="text-xs">DRAG</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[var(--accent-primary)]" />
              </>
            )}
          </div>
        </motion.div>

        {/* Trail / Tape Unroll Slot */}
        <div className="w-60 h-24 -mt-3 pt-3 border-x-2 border-b-2 border-dashed border-[var(--border-subtle)] rounded-b-2xl bg-[var(--surface)]/30 flex flex-col items-center justify-end pb-3 text-center pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
            Drag down to initialize telemetry
          </span>
          <div className="w-12 h-1 bg-[var(--accent-primary)]/40 rounded-full mt-1.5" />
        </div>
      </div>

      {/* Accessible direct action button below */}
      <button
        onClick={handlePullComplete}
        className="mt-3 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] underline decoration-dotted font-mono cursor-pointer transition-colors"
      >
        or click here to open investigation workspace directly →
      </button>
    </div>
  );
};
