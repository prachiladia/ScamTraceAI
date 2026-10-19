import React, { useState } from 'react';
import {
  KeyRound,
  Trophy,
  CreditCard,
  Package,
  Briefcase,
  TrendingUp,
  Headset,
  Heart,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';

interface ScamCard {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  summary: string;
  howItWorks: string;
  redFlags: string[];
  whatToDo: string[];
}

const SCAM_TYPES: ScamCard[] = [
  {
    id: 'otp-scam',
    title: 'OTP & SIM Swap Fraud',
    category: 'Credential Interception',
    icon: <KeyRound className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Fraudsters impersonate telecoms or bank officials to trick victims into sharing one-time passcodes or enabling *21* call forwarding.',
    howItWorks: 'The attacker initiates an online bank transfer or SIM transfer that triggers an OTP, then urgently calls the victim pretending to be a bank fraud investigator "blocking an unauthorized transaction" and demanding the code.',
    redFlags: [
      'Caller demands OTP or 2-factor code to "cancel" a fake debit.',
      'Requests dialing codes like *21* or *401* (call forwarding).',
      'Artificial background noise designed to mimic a banking call center.',
    ],
    whatToDo: [
      'Never share an OTP with ANY caller, bank employee, or interactive bot.',
      'Immediately hang up and contact your bank via the official number on your card.',
      'Check telecom SIM swap alerts immediately if your phone suddenly loses network signal.',
    ],
  },
  {
    id: 'kyc-suspension',
    title: 'Bank KYC & Account Freeze',
    category: 'Authority Impersonation',
    icon: <CreditCard className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Coercive SMS or WhatsApp alerts claiming your NetBanking, PAN card, or bank account will be permanently blocked in 2 hours.',
    howItWorks: 'The victim is pushed into panic mode with an arbitrary countdown, driving them to an unauthorized third-party lookalike domain (e.g. sbi-kyc-update.xyz) where NetBanking credentials, card CVV, and OTPs are harvested.',
    redFlags: [
      'Urgency deadlines ("blocked within 2 hours", "immediate police report").',
      'Links with non-bank domain roots (.top, .xyz, .cc, .info, .support).',
      'Sent from regular 10-digit mobile numbers rather than registered corporate SMS sender IDs.',
    ],
    whatToDo: [
      'Remember: Real banks NEVER deactivate accounts over an unverified SMS link.',
      'Log in only through your official bank application or verified bookmark.',
      'Report deceptive SMS headers directly to the Chakshu telecom portal and cybercrime helpline 1930.',
    ],
  },
  {
    id: 'parcel-courier',
    title: 'Parcel Delivery & Customs Fee',
    category: 'E-commerce Exploitation',
    icon: <Package className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Deceptive messages claiming a package cannot be delivered due to an incorrect house number or a tiny unpaid customs charge (₹25 - ₹50).',
    howItWorks: 'Victims expecting routine e-commerce deliveries click the tracking link, which prompts a micro-payment gateway. The phishing portal records full debit card details or pushes an APK containing an SMS-intercepting trojan.',
    redFlags: [
      'Requests a negligible fee (e.g. ₹48) to release an urgent high-value courier.',
      'Sender claims to be India Post, FedEx, or DHL but uses generic short-links (bit.ly, tinyurl) or strange domains.',
      'Demands installing remote support apps like AnyDesk to process the redelivery.',
    ],
    whatToDo: [
      'Copy the tracking number directly into the official logistics carrier website.',
      'Never pay redelivery charges via third-party SMS links.',
      'Never download APK files or install screen-sharing software for a delivery dispute.',
    ],
  },
  {
    id: 'prize-lottery',
    title: 'Lottery & Lucky Draw Scheme',
    category: 'Advance Fee Fraud',
    icon: <Trophy className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Claims you won ₹25 Lakhs in KBC, Apple, or international sweepstakes, demanding advance "processing taxes" to release the reward.',
    howItWorks: 'Scammers send professional-looking certificates and fake government stamp papers. Once the victim pays the initial "clearance fee," new demands appear for customs tax, currency conversion, and legal stamps until the victim exhausts their savings.',
    redFlags: [
      'Winning a contest, lottery, or lucky draw you never entered.',
      'Demand for advance clearance taxes, processing fees, or GST.',
      'Communication strictly via WhatsApp audio calls from international country codes.',
    ],
    whatToDo: [
      'Golden rule: You cannot win a lottery you never purchased a ticket for.',
      'Never transfer upfront "clearance taxes" to personal UPI handles.',
      'Block the caller and report the number immediately.',
    ],
  },
  {
    id: 'job-task',
    title: 'Part-Time Task & YouTube Job',
    category: 'Employment Trap',
    icon: <Briefcase className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Offers easy work-from-home earnings (₹3,000–₹8,000/day) for liking YouTube videos, reviewing hotels, or completing e-commerce tasks.',
    howItWorks: 'Victims are given real payouts of ₹150–₹500 for the first few simple tasks to build trust. They are then invited to a VIP Telegram group and required to "recharge" their balance with ₹5,000–₹50,000 for high-tier tasks, where all funds are permanently locked.',
    redFlags: [
      'Unsolicited WhatsApp/Telegram messages offering high daily wages for trivial tasks.',
      'Requirement to pay money into a "prepaid wallet" to unlock higher commissions.',
      'Group admins sharing fabricated bank balance screenshots to manufacture social proof.',
    ],
    whatToDo: [
      'Legitimate employers NEVER ask employees to pay upfront security deposits or task fees.',
      'Cease all communication the moment an assignment demands deposit money.',
      'Report the Telegram channels and UPI recipient VPA to your bank.',
    ],
  },
  {
    id: 'investment-crypto',
    title: 'High-Yield Investment & Pig Butchering',
    category: 'Financial Engineering',
    icon: <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Elaborate investment rings grooming victims into fake cryptocurrency trading apps displaying artificial double-digit daily profits.',
    howItWorks: 'Scammers establish personal rapport over weeks (Shaadi/Tinder/LinkedIn), share fabricated "insider trading" gains, and steer victims to fake MT5 trading portals. When the victim attempts a withdrawal, astronomical "tax fees" are demanded before the platform vanishes.',
    redFlags: [
      'Guaranteed high daily or monthly returns (e.g. 15% guaranteed per week).',
      'Trading platform downloaded via direct APK link rather than official Google Play / App Store.',
      'Funds must be deposited to changing personal bank accounts or private crypto wallets.',
    ],
    whatToDo: [
      'Check registration of investment advisors and platforms on official regulatory registries (SEBI, RBI, SEC).',
      'Never transfer life savings to personal UPI or crypto addresses recommended by online acquaintances.',
      'If withdrawals are blocked pending additional fees, you are in a scam—do NOT send additional funds.',
    ],
  },
  {
    id: 'tech-support',
    title: 'Tech Support & Remote Access Trap',
    category: 'Device Compromise',
    icon: <Headset className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Full-screen browser pop-ups and alarming robotic voice calls claiming your computer has 53 trojans and Windows Defender is frozen.',
    howItWorks: 'The pop-up locks the browser and displays a toll-free number. The "technician" instructs the caller to download AnyDesk or TeamViewer, blacks out their screen with a fake scan, and accesses open banking tabs to siphon money.',
    redFlags: [
      'Browser windows that lock up with blaring siren sounds or robotic voice warnings.',
      'Toll-free numbers claiming Microsoft or Apple will cancel your license in 1 hour.',
      'Requests to install remote access tools (AnyDesk, QuickSupport, UltraViewer).',
    ],
    whatToDo: [
      'Simply press Ctrl + Shift + Esc (or Alt + F4) to close your web browser.',
      'Microsoft, Apple, and Google NEVER show phone numbers in pop-ups or initiate unsolicited calls.',
      'If remote access was granted, immediately disconnect your Wi-Fi/Ethernet and change banking passwords from a separate device.',
    ],
  },
  {
    id: 'romance-scam',
    title: 'Romance & Emergency Wire Scam',
    category: 'Psychological Manipulation',
    icon: <Heart className="w-5 h-5 text-[var(--accent-primary)]" />,
    summary: 'Online admirers manufacturing deep emotional bonds before fabricating catastrophic crises (customs arrest, medical surgery) demanding money.',
    howItWorks: 'The perpetrator builds trust through daily video calls or stolen attractive profile photos. They claim to have sent expensive jewelry or cash gifts that are "stuck at airport customs," followed by fake airport officials demanding clearance fines.',
    redFlags: [
      'Sudden intense professing of love without meeting in person.',
      'Claims of sending expensive surprise packages that get "held by customs at Delhi/Mumbai airport".',
      'Threats that the victim will be prosecuted for money laundering unless customs penalty is paid.',
    ],
    whatToDo: [
      'Airport customs officials NEVER call individuals demanding wire transfers to personal savings accounts.',
      'Run reverse image searches on profile pictures of suspicious online contacts.',
      'Confide in trusted friends or family members before sending money to anyone you have not met physically.',
    ],
  },
];

export const ScamTypeSlider: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SCAM_TYPES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SCAM_TYPES.length) % SCAM_TYPES.length);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-black text-[var(--text-primary)] uppercase tracking-wide">
            Threat Taxonomy & Blueprint Cards
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-sans">
            Click any archetype to inspect its psychological hook, technical indicators, and protective actions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
          <button
            onClick={handlePrev}
            aria-label="Previous scam archetype"
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--surface-elevated)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] px-2">
            {currentIndex + 1} / {SCAM_TYPES.length}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next scam archetype"
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--surface-elevated)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Cards (Interactive Flip on Click) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SCAM_TYPES.map((card) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="relative min-h-[380px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 flex flex-col justify-between cursor-pointer hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] transition-all duration-300 transform hover:-translate-y-1 group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFlip(card.id);
                }
              }}
              aria-label={`${card.title}. Click to flip card.`}
            >
              {!isFlipped ? (
                /* Card Front */
                <div className="space-y-4 flex flex-col h-full justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                        {card.icon}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] text-[var(--accent-secondary)] border border-[var(--border-subtle)]">
                        {card.category}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wide">
                      {card.title}
                    </h4>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                      {card.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--accent-primary)] font-semibold">
                    <span>INSPECT BLUEPRINT</span>
                    <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                </div>
              ) : (
                /* Card Back */
                <div className="space-y-3 flex flex-col h-full justify-between text-xs text-[var(--text-primary)]">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-bold text-[11px] font-mono text-[var(--accent-primary)] uppercase">
                        {card.title}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                        Click to return
                      </span>
                    </div>

                    <div>
                      <strong className="block text-[10px] uppercase font-mono tracking-wider text-[var(--text-secondary)]">
                        Execution Pattern:
                      </strong>
                      <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] mt-0.5 font-sans">
                        {card.howItWorks}
                      </p>
                    </div>

                    <div>
                      <strong className="block text-[10px] uppercase font-mono tracking-wider text-[#F87171] flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3 text-[#F87171]" /> Red Flags:
                      </strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[10.5px] mt-0.5 leading-tight text-[var(--text-secondary)] font-sans">
                        {card.redFlags.slice(0, 2).map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="block text-[10px] uppercase font-mono tracking-wider text-[var(--accent-secondary)] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[var(--accent-secondary)]" /> Mitigation:
                      </strong>
                      <p className="text-[10.5px] leading-tight text-[var(--text-secondary)] mt-0.5 font-sans">
                        {card.whatToDo[0]}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                    <span>Flip card</span>
                    <RotateCw className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
