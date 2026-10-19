import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefixIcon, suffixIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-sans font-medium text-[#94A3B8]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#94A3B8]">
              {prefixIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl border bg-[#101827] px-4 py-2.5 text-sm text-[#F1F5F9] placeholder-[#64748B] transition-all duration-200 focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] disabled:opacity-50 disabled:cursor-not-allowed ${
              prefixIcon ? 'pl-10' : ''
            } ${suffixIcon ? 'pr-10' : ''} ${
              error
                ? 'border-[#F87171] focus:border-[#F87171] focus:ring-[#F87171]'
                : 'border-[rgba(148,163,184,0.16)]'
            } ${className}`}
            style={{
              backgroundColor: 'var(--background-secondary)',
              color: 'var(--text-primary)',
            }}
            {...props}
          />

          {suffixIcon && (
            <div className="absolute right-3.5 text-[#94A3B8]">
              {suffixIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-[#F87171] font-sans">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#64748B] font-sans">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
