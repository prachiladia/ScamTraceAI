import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Lens & Threat Graph Vector Mark */}
      <svg
        className={`${iconDimensions} shrink-0 text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer Scanner Reticle */}
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="opacity-70"
        />

        {/* Inner Solid Scope Ring */}
        <circle
          cx="20"
          cy="20"
          r="12"
          stroke="currentColor"
          strokeWidth="1.2"
          className="opacity-40"
        />

        {/* Threat-Intelligence Node Graph Links */}
        <line x1="14" y1="16" x2="26" y2="14" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="14" y1="16" x2="19" y2="25" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="26" y1="14" x2="27" y2="23" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="19" y1="25" x2="27" y2="23" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Precision Node Points */}
        <circle cx="14" cy="16" r="2.5" fill="#22D3EE" />
        <circle cx="26" cy="14" r="2" fill="#2DD4BF" />
        <circle cx="19" cy="25" r="2.5" fill="#22D3EE" />
        <circle cx="27" cy="23" r="2" fill="#2DD4BF" />

        {/* Central Core Tracer Indicator */}
        <circle cx="20.5" cy="19.5" r="1.5" fill="#F87171" />

        {/* Diagonal Forensic Trace Ray */}
        <path
          d="M29 29L36 36"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black tracking-tight ${textSize} text-[#F1F5F9] dark:text-[#F1F5F9] light:text-[#0F172A]`}
              style={{ color: 'var(--text-primary)' }}
            >
              SCAMTRACE
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30">
              AI
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8] font-semibold mt-0.5">
            Threat Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
