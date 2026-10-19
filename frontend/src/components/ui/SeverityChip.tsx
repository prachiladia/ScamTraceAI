import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import type { RiskLevel } from '../../types';

export interface SeverityChipProps {
  level: RiskLevel | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SeverityChip: React.FC<SeverityChipProps> = ({
  level,
  score,
  size = 'md',
  className = '',
}) => {
  // Normalize string comparison
  const normalized = level.toLowerCase();
  const isHigh = normalized.includes('high');
  const isSuspicious = normalized.includes('suspicious') || normalized.includes('medium') || normalized.includes('warn');
  const isLower = normalized.includes('lower') || normalized.includes('low') || normalized.includes('safe') || normalized.includes('clean');

  const config = isHigh
    ? {
        label: 'High concern',
        icon: <ShieldAlert className="shrink-0" />,
        colorStyles:
          'bg-[rgba(248,113,113,0.12)] text-[#F87171] border-[rgba(248,113,113,0.3)] dark:text-[#F87171] light:text-[#DC2626]',
      }
    : isSuspicious
    ? {
        label: 'Suspicious',
        icon: <AlertTriangle className="shrink-0" />,
        colorStyles:
          'bg-[rgba(251,191,36,0.12)] text-[#FBBF24] border-[rgba(251,191,36,0.3)] dark:text-[#FBBF24] light:text-[#D97706]',
      }
    : isLower
    ? {
        label: 'Lower concern',
        icon: <CheckCircle2 className="shrink-0" />,
        colorStyles:
          'bg-[rgba(45,212,191,0.12)] text-[#2DD4BF] border-[rgba(45,212,191,0.3)] dark:text-[#2DD4BF] light:text-[#0D9488]',
      }
    : {
        label: 'Insufficient evidence',
        icon: <HelpCircle className="shrink-0" />,
        colorStyles:
          'bg-[rgba(148,163,184,0.12)] text-[#94A3B8] border-[rgba(148,163,184,0.25)] dark:text-[#94A3B8] light:text-[#64748B]',
      };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 [&_svg]:w-3 [&_svg]:h-3',
    md: 'text-xs px-2.5 py-1 gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 [&_svg]:w-4 [&_svg]:h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-sans font-semibold rounded-lg border uppercase tracking-wider select-none ${config.colorStyles} ${sizeStyles} ${className}`}
      role="status"
      aria-label={`Risk Level: ${config.label}${score !== undefined ? `, Score: ${score.toFixed(1)} out of 100` : ''}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="font-mono opacity-80 pl-1 border-l border-current/30">
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
};
