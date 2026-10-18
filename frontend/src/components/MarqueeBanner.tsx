import React from 'react';

interface MarqueeBannerProps {
  phrases?: string[];
  reverse?: boolean;
  speedSeconds?: number;
  variant?: 'crimson' | 'peach';
}

const DEFAULT_PHRASES = [
  'Real banks never ask for your OTP or UPI PIN',
  'Urgency is a psychological coercion tactic, not an emergency',
  'Verify the actual domain root, not just the sender display name',
  'Law enforcement never demands digital payments or cryptocurrency wires',
  'Never install remote desktop software (AnyDesk, TeamViewer) for parcel delivery',
  'Legitimate lotteries do not ask for clearance fees to claim winnings',
  'Dial 1930 immediately in India to freeze fraudulent transactions in transit',
];

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  phrases = DEFAULT_PHRASES,
  reverse = false,
  speedSeconds = 30,
  variant = 'crimson',
}) => {
  // Duplicate list to achieve continuous loop
  const repeated = [...phrases, ...phrases];

  const bgStyles =
    variant === 'crimson'
      ? 'bg-[#A82020] text-[#F3E6D5] border-y border-[#6C1A1A]'
      : 'bg-[#FBE6C2] text-[#6C1A1A] border-y border-[#6C1A1A]/30 dark:bg-[#2A0D0D] dark:text-[#FBE6C2] dark:border-[#A82020]/40';

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
          <div key={idx} className="flex items-center gap-4 text-xs font-mono font-bold tracking-wider uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            <span>{phrase}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
