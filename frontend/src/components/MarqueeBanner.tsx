import React from 'react';

interface MarqueeBannerProps {
  phrases?: string[];
  reverse?: boolean;
  speedSeconds?: number;
  variant?: 'cyan' | 'surface' | 'crimson' | 'peach';
}

const DEFAULT_PHRASES = [
  'Real financial institutions never demand your OTP or UPI PIN',
  'Urgency deadlines are psychological coercion tactics, not system alerts',
  'Always verify the actual domain root, never trust caller or sender display headers',
  'Law enforcement never demands digital payments or cryptocurrency deposits',
  'Never install remote desktop tools (AnyDesk, TeamViewer) for delivery updates',
  'Legitimate lotteries never require advance clearance taxes to receive funds',
  'In India, call 1930 immediately to freeze fraudulent transactions in transit',
];

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  phrases = DEFAULT_PHRASES,
  reverse = false,
  speedSeconds = 30,
  variant = 'cyan',
}) => {
  // Duplicate list to achieve continuous seamless loop
  const repeated = [...phrases, ...phrases];

  const isPrimary = variant === 'cyan' || variant === 'crimson';
  const bgStyles = isPrimary
    ? 'bg-[var(--surface-elevated)]/90 text-[var(--accent-primary)] border-y border-[var(--border-subtle)] shadow-[inset_0_1px_0_rgba(34,211,238,0.1)]'
    : 'bg-[var(--surface)] text-[var(--text-secondary)] border-y border-[var(--border-subtle)]';

  return (
    <div
      className={`w-full overflow-hidden py-2.5 select-none ${bgStyles} group`}
      role="region"
      aria-label="Educational scam awareness marquee"
    >
      <div
        className={`flex w-max items-center gap-8 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } group-hover:[animation-play-state:paused]`}
        style={{
          animationDuration: `${speedSeconds}s`,
        }}
      >
        {repeated.map((phrase, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs font-mono font-medium tracking-wider uppercase shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPrimary ? 'bg-[var(--accent-primary)] shadow-[0_0_6px_var(--accent-primary)]' : 'bg-[var(--accent-secondary)]'
              }`}
            />
            <span className={isPrimary ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}>
              {phrase}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
