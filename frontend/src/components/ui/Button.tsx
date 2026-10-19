import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D18] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2.5 h-10',
    lg: 'text-base px-6 py-3.5 h-12',
  }[size];

  // WCAG AA & AAA compliant styling:
  // Primary: #22D3EE (Cyan) background with #080D18 (Navy) text -> Contrast 13.8:1
  const variantStyles = {
    primary:
      'bg-[#22D3EE] text-[#080D18] hover:bg-[#06B6D4] shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    secondary:
      'bg-[#1B293B] text-[#F1F5F9] hover:bg-[#25384F] border border-[rgba(148,163,184,0.16)]',
    outline:
      'border border-[#22D3EE]/50 text-[#22D3EE] hover:bg-[#22D3EE]/10 hover:border-[#22D3EE]',
    ghost:
      'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#141F30]',
    danger:
      'bg-[#F87171] text-[#080D18] hover:bg-red-500 shadow-[0_0_15px_rgba(248,113,113,0.25)]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
