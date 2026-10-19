import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hover?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  hover = false,
  interactive = false,
  className = '',
  ...props
}) => {
  const bgStyle = elevated
    ? 'bg-[#1B293B] dark:bg-[#1B293B] light:bg-[#E2E8F0]'
    : 'bg-[#141F30] dark:bg-[#141F30] light:bg-[#FFFFFF]';

  const hoverStyle = hover || interactive
    ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.35)] hover:shadow-[0_4px_20px_rgba(8,13,24,0.6)]'
    : '';

  const cursorStyle = interactive ? 'cursor-pointer' : '';

  return (
    <div
      className={`rounded-2xl border border-[rgba(148,163,184,0.16)] p-6 ${bgStyle} ${hoverStyle} ${cursorStyle} ${className}`}
      style={{
        backgroundColor: elevated ? 'var(--surface-elevated)' : 'var(--surface)',
        borderColor: 'var(--border-subtle)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};
