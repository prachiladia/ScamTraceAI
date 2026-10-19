import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'rounded-md h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-[#1B293B]/70 ${variantStyles} ${className}`}
      style={{
        width,
        height,
        backgroundColor: 'var(--surface-elevated)',
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};
