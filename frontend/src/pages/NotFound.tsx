import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-surface-elevated border border-risk-high/40 text-risk-high flex items-center justify-center shadow-lg shadow-red-500/10">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-risk-high rounded-full animate-ping" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border-subtle bg-surface text-[10px] font-mono uppercase tracking-wider text-risk-high">
          <Terminal className="w-3 h-3" />
          <span>Error 404 &bull; Target Route Missing</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
          Indicator Not Found
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          The forensic endpoint or case file you requested does not exist in local telemetry or has been relocated.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-[#080D18] text-xs font-mono font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Operations Hub</span>
      </Link>
    </div>
  );
};
