import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Sparkles } from 'lucide-react';

export const PullMeHeroTape: React.FC = () => {
  const navigate = useNavigate();
  const [triggered, setTriggered] = useState(false);
  const dragY = useMotionValue(0);

  // Transform drag distance into visual cues
  const tapeWidth = useTransform(dragY, [0, 150], ['220px', '460px']);
  const tapeOpacity = useTransform(dragY, [0, 150], [0.95, 1]);

  const handlePullComplete = () => {
    if (triggered) return;
    setTriggered(true);
    setTimeout(() => {
      navigate('/investigate');
    }, 450);
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
            if (info.offset.y > 90) {
              handlePullComplete();
            }
          }}
          className={`relative z-20 py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing border-2 border-[#6C1A1A] dark:border-[#A82020] transition-colors ${
            triggered
              ? 'bg-[#1E6E60] text-white'
              : 'bg-[#A82020] text-[#F3E6D5] hover:bg-[#8C1919]'
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBE6C2] animate-ping" />
            <span className="font-mono font-black text-xs uppercase tracking-wider">
              {triggered ? 'UNCOVERING EVIDENCE...' : 'PULL TO UNCOVER EVIDENCE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-black/25 px-2.5 py-1 rounded-lg">
            {triggered ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>DRAG</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </>
            )}
          </div>
        </motion.div>

        {/* Trail / Tape Unroll Slot */}
        <div className="w-56 h-24 -mt-3 pt-3 border-x-2 border-b-2 border-dashed border-[#6C1A1A]/30 dark:border-[#A82020]/40 rounded-b-2xl bg-[#FBE6C2]/20 dark:bg-[#2A0D0D]/30 flex flex-col items-center justify-end pb-3 text-center pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E3E3E] dark:text-[#C9B29B]">
            Pull down past mark to dissect
          </span>
          <div className="w-12 h-1 bg-[#A82020]/40 rounded-full mt-1.5" />
        </div>
      </div>

      {/* Accessible direct action button below */}
      <button
        onClick={handlePullComplete}
        className="mt-3 text-xs text-[#6C1A1A] dark:text-[#FBE6C2] underline decoration-dotted hover:text-[#A82020] font-mono cursor-pointer"
      >
        or press here to launch investigation workspace directly →
      </button>
    </div>
  );
};
