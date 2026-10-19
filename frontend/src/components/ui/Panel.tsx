import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  badge?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  statusDot?: 'cyan' | 'teal' | 'red' | 'amber';
}

export const Panel: React.FC<PanelProps> = ({
  title,
  badge,
  icon,
  actions,
  statusDot,
  children,
  className = '',
  ...props
}) => {
  const dotColor = {
    cyan: 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    teal: 'bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.8)]',
    red: 'bg-[#F87171] shadow-[0_0_8px_rgba(248,113,113,0.8)]',
    amber: 'bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.8)]',
  }[statusDot || 'cyan'];

  return (
    <div
      className={`rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#141F30] overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border-subtle)',
      }}
      {...props}
    >
      {/* Panel Header */}
      <div
        className="px-5 py-3.5 border-b border-[rgba(148,163,184,0.12)] flex items-center justify-between gap-3 bg-[#101827]/60"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2.5">
          {statusDot && (
            <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse-subtle shrink-0`} />
          )}
          {icon && <span className="text-[#22D3EE] shrink-0">{icon}</span>}
          <h3
            className="font-display font-bold text-sm tracking-wide uppercase text-[#F1F5F9]"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#1B293B] text-[#94A3B8] border border-[rgba(148,163,184,0.16)]">
              {badge}
            </span>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Panel Content */}
      <div className="p-5">{children}</div>
    </div>
  );
};
