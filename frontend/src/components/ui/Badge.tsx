import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'teal' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30',
    teal: 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30',
    neutral: 'bg-[#1B293B] text-[#94A3B8] border border-[rgba(148,163,184,0.16)]',
    outline: 'border border-[#94A3B8]/40 text-[#F1F5F9]',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md uppercase tracking-wider select-none ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
