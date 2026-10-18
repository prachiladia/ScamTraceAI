import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Globe,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  RotateCcw,
  Flag,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  title: string;
  scenario: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Bank KYC Urgent Suspension',
    scenario: 'SMS received from +91 98210 54123: "Dear SBI User, your NetBanking account has been suspended due to pending KYC verification. Update your Aadhaar details at http://sbi-kyc-profile.xyz within 2 hours to avoid permanent deactivation and police report."',
    options: [
      {
        text: 'Click the link immediately to prevent the police report.',
        isCorrect: false,
        explanation: 'Incorrect. Urgency and threats of police action are textbook psychological coercion tactics. Legitimate banks never send third-party .xyz links.',
      },
      {
        text: 'Do not click; verify account status via official NetBanking app and report SMS to 1930.',
        isCorrect: true,
        explanation: 'Correct! Real banks never send coercive SMS threats or request Aadhaar on unauthorized third-party domains.',
      },
      {
        text: 'Forward the message to your family group to see if their accounts are also suspended.',
        isCorrect: false,
        explanation: 'Incorrect. Forwarding unverified phishing links risks spreading scam infrastructure to less tech-savvy family members.',
      },
    ],
  },
  {
    id: 2,
    title: 'Parcel Redelivery & Remote Access Software',
    scenario: 'You receive an automated call claiming an India Post parcel could not be delivered due to an unpaid ₹48 customs clearance fee. The caller asks you to install AnyDesk or TeamViewer on your phone to complete the verification.',
    options: [
      {
        text: 'Install the app and make the payment since ₹48 is a negligible amount.',
        isCorrect: false,
        explanation: 'Dangerous! The ₹48 fee is a pretext. Installing AnyDesk grants the criminal full screen-sharing control to record your OTP and drain your bank account.',
      },
      {
        text: 'Refuse to install any software, disconnect the call, and track the consignment on indiapost.gov.in.',
        isCorrect: true,
        explanation: 'Correct! No legitimate courier service requires remote desktop software for address or fee verification.',
      },
      {
        text: 'Ask the caller for their employee ID and badge photo on WhatsApp.',
        isCorrect: false,
        explanation: 'Incorrect. Scammers readily provide forged ID cards and fake police credentials generated with photo editing software.',
      },
    ],
  },
  {
    id: 3,
    title: 'Telegram Part-Time "Like & Earn" Job',
    scenario: 'WhatsApp message: "Hello! Earn ₹3,500/day by liking YouTube videos from home. We paid you ₹150 for your first 3 likes. To unlock VIP tasks paying ₹10,000, deposit ₹5,000 into our company prepaid wallet."',
    options: [
      {
        text: 'Deposit the ₹5,000 because they proved they were genuine by paying ₹150 first.',
        isCorrect: false,
        explanation: 'Incorrect! The initial ₹150 payout is the "bait" in an advance-fee task scam. Once you deposit ₹5,000, your funds are locked permanently.',
      },
      {
        text: 'Stop all communication immediately, block the sender, and report the group.',
        isCorrect: true,
        explanation: 'Correct! Legitimate employers never ask employees to pay upfront security deposits or task fees to receive wages.',
      },
    ],
  },
  {
    id: 4,
    title: 'Electricity Disconnection Threat at Midnight',
    scenario: 'SMS: "Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from the power station due to previous month unpaid bill. Immediately contact our electricity officer Mr. Sharma at 9876543210."',
    options: [
      {
        text: 'Call the mobile number provided to plead for time until tomorrow morning.',
        isCorrect: false,
        explanation: 'Incorrect! The number connects to a scammer who will instruct you to install a malicious payment APK or initiate a rapid remote money transfer.',
      },
      {
        text: 'Check your official electricity provider bill online or call the official DISCOM helpline on your past physical bill.',
        isCorrect: true,
        explanation: 'Correct! Power utility companies adhere to statutory disconnection notices and never dispatch personal mobile numbers for payment negotiations.',
      },
    ],
  },
  {
    id: 5,
    title: 'Guaranteed 25% Weekly Return Crypto Trading',
    scenario: 'An attractive acquaintance met on LinkedIn invites you to trade digital assets on a "special algorithmic platform" (asia-crypto-fx.vip). The dashboard shows your initial $200 has grown to $1,800 in 4 days, but withdrawing requires a $500 "liquidity release tax."',
    options: [
      {
        text: 'Pay the $500 release tax to cash out the $1,800 profit.',
        isCorrect: false,
        explanation: 'Incorrect! This is a "Pig Butchering" (Sha Zhu Pan) scam. The $1,800 profit is completely simulated on a rigged interface. Paying the $500 will simply lead to more fee demands.',
      },
      {
        text: 'Cease deposits immediately, document the chat logs, and file an IC3 / cybercrime report.',
        isCorrect: true,
        explanation: 'Correct! Legitimate financial brokers deduct fees from existing balances; they never demand advance external wire transfers to release user funds.',
      },
    ],
  },
  {
    id: 6,
    title: 'Urgent Income Tax Refund Notification',
    scenario: 'Email received with Income Tax Department logo: "A tax refund of ₹24,890 has been approved. Please confirm your bank account number and NetBanking password at https://incometax-refund-portal.org/login to receive immediate credit."',
    options: [
      {
        text: 'Enter your NetBanking password to receive the refund into your account.',
        isCorrect: false,
        explanation: 'Catastrophic error! Entering your NetBanking password gives the attacker direct unauthorized access to your funds.',
      },
      {
        text: 'Do not click; check your refund status on the official incometax.gov.in portal directly.',
        isCorrect: true,
        explanation: 'Correct! Government tax departments never solicit NetBanking login credentials or passwords to process direct credit refunds.',
      },
    ],
  },
];

interface GlossaryTerm {
  term: string;
  category: 'Psychological' | 'Technical' | 'Actors & Methods';
  definition: string;
  forensicClue: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Smishing',
    category: 'Technical',
    definition: 'Phishing attacks conducted via SMS text messages containing malicious links, fake contact numbers, or urgent prompts.',
    forensicClue: 'Look for suspicious TLDs (.top, .xyz), shortened URLs, and urgency keywords sent from random 10-digit mobile numbers.',
  },
  {
    term: 'Vishing',
    category: 'Psychological',
    definition: 'Voice phishing where criminals impersonate banking representatives, police officers, or tech support to extract sensitive credentials over phone calls.',
    forensicClue: 'Aggressive tone, background noise mimicking a call center, requests for OTPs, and refusal to let you hang up.',
  },
  {
    term: 'Quishing',
    category: 'Technical',
    definition: 'Phishing via QR codes placed in emails, stickers, or parking meters that redirect mobile users to fraudulent harvesting pages.',
    forensicClue: 'Unsolicited QR codes requiring immediate scanning to "receive money" or "confirm a payment."',
  },
  {
    term: 'Pig Butchering (Sha Zhu Pan)',
    category: 'Actors & Methods',
    definition: 'Long-term financial fraud where criminals build romantic or mentor rapport with victims before directing them to fraudulent investment platforms.',
    forensicClue: 'Recommendations of obscure trading portals, initial simulated profits, and exorbitant fees demanded before withdrawals.',
  },
  {
    term: 'Sender ID Spoofing',
    category: 'Technical',
    definition: 'Manipulating the alphanumeric sender header of an SMS or caller ID so the message appears in the same official thread as your real bank.',
    forensicClue: 'Even inside a verified SMS thread, inspect the destination link domain. Real banks will never link to non-institutional domains.',
  },
  {
    term: 'Typo-squatting & Lookalike Domains',
    category: 'Technical',
    definition: 'Registering misspelled or homoglyph variants of legitimate brand names (e.g., sbi-login-verify.com vs sbi.co.in) to fool hurried users.',
    forensicClue: 'Check the domain root right before the first slash. Subdomains like sbi.com.malicious.net belong to malicious.net.',
  },
  {
    term: 'Advance-Fee Fraud',
    category: 'Psychological',
    definition: 'Deceiving victims into paying small upfront clearance fees, taxes, or delivery charges in anticipation of a much larger prize or parcel.',
    forensicClue: 'Any requirement to pay money in order to receive money you supposedly won or earned.',
  },
  {
    term: 'Mule Account',
    category: 'Actors & Methods',
    definition: 'A bank account opened by a complicit or duped individual used by cybercrime syndicates to layer and cash out stolen funds.',
    forensicClue: 'Demands to route transactions through multiple private UPI handles or third-party savings accounts.',
  },
  {
    term: 'Screen-Share Hijacking',
    category: 'Technical',
    definition: 'Tricking victims into installing remote access tools (AnyDesk, TeamViewer) to observe credentials and bypass 2-factor authentication.',
    forensicClue: 'Any caller insisting that you install software or grant screen permissions to resolve a customer service issue.',
  },
  {
    term: 'Pretexting',
    category: 'Psychological',
    definition: 'Creating an elaborate fabricated scenario (such as an impending arrest, lost package, or sick relative) to manipulate someone into compliance.',
    forensicClue: 'Emotional urgency designed to bypass critical thinking and prevent independent verification.',
  },
  {
    term: 'SIM Swap Fraud',
    category: 'Technical',
    definition: 'Illegally porting a victim’s telephone number to a scammer’s SIM card to intercept two-factor SMS authentication codes.',
    forensicClue: 'Unexplained total loss of cell service on your phone accompanied by sudden password reset notifications.',
  },
  {
    term: 'Honeytrap / Catfishing',
    category: 'Psychological',
    definition: 'Using stolen photos and fictional personas on social networks to manipulate victims emotionally for financial extortion.',
    forensicClue: 'Refusal to participate in live unstructured video calls, quick declarations of love, and emergency financial distress.',
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How can a scam SMS appear in the same thread as my real bank?',
    answer: 'In many telecommunications networks, SMS threads are organized by the alphanumeric Sender ID header (e.g. "SBIINB"). Unscrupulous telemarketers or rogue SMS gateways can be exploited to spoof this header. Crucially: Always inspect the destination link domain. Real banks never link to third-party domains (.top, .xyz, .site, .info).',
  },
  {
    question: 'Why shouldn’t I reply to a scammer or send angry messages?',
    answer: 'Replying confirms to automated cybercrime systems that your phone number is active and monitored by a live person. This immediately increases your value on dark-web lead broker lists, triggering an exponential wave of targeted spam. The safest response is silent documentation, blocking, and reporting.',
  },
  {
    question: 'What should I do immediately if I entered credentials on a phishing page?',
    answer: 'Act within minutes: 1) Immediately call your bank’s 24/7 hotline to freeze all cards and NetBanking access. 2) If in India, dial 1930 (National Cybercrime Helpline) to freeze outbound transactions in the banking network. 3) Change your email and banking passwords from a different, clean device. 4) File a formal complaint at cybercrime.gov.in.',
  },
  {
    question: 'Does ScamTrace AI send my messages to external servers or visit links?',
    answer: 'No. ScamTrace AI strictly adheres to zero-network-leak principles. URL features (entropy, dots, subdomains, TLD classification) are computed 100% locally with mathematical algorithms. We never fetch, resolve, or interact with submitted URLs.',
  },
  {
    question: 'Can ScamTrace AI identify the specific person who sent me this message?',
    answer: 'No. ScamTrace AI is a decision-support and forensic analysis tool, not an official law enforcement entity. We extract technical indicators and psychological coercion patterns to help you stay safe, but real-world attribution requires subpoena powers held exclusively by police and regulatory bodies.',
  },
  {
    question: 'What is the distinction between spam and financial fraud?',
    answer: 'Spam is unsolicited bulk communication (e.g. marketing discounts). Financial fraud is a deliberate deceptive attack designed to coerce credentials, money, or remote control. ScamTrace AI strictly separates machine learning spam classification from deterministic fraud evidence.',
  },
];

export const ScamAcademy: React.FC = () => {
  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Glossary State
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('All');

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected].isCorrect) {
        score++;
      }
    });
    return score;
  };

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        item.definition.toLowerCase().includes(glossarySearch.toLowerCase());
      const matchesCat = glossaryCategory === 'All' || item.category === glossaryCategory;
      return matchesSearch && matchesCat;
    });
  }, [glossarySearch, glossaryCategory]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/60 dark:bg-[#2A0D0D] text-xs font-mono font-bold text-[#A82020] dark:text-[#FBE6C2]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>CYBER RESILIENCE FIELD MANUAL</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-tight">
          Scam Academy & Defense Guide
        </h1>
        <p className="text-sm sm:text-base text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
          Master the psychological coercion tactics, deceptive digital architecture, and actionable incident protocols needed to protect yourself and your family.
        </p>
      </div>

      {/* Verified Incident Response Helplines (India, US, UK, Global) */}
      <div className="p-8 rounded-3xl border-2 border-[#A82020]/30 bg-red-500/5 dark:bg-red-950/20 space-y-6">
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-[#A82020]" />
          <h2 className="font-display text-xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-wide">
            Emergency Victim Reporting Directory (Verified Official Channels)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* India */}
          <div className="p-5 rounded-2xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/20 dark:border-[#A82020]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A82020] dark:text-[#FBE6C2]">
                India (MHA & I4C)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-mono font-bold">
                24/7 Hotline
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-black font-mono text-[#2A0E0E] dark:text-[#F3E6D5]">
                Dial 1930
              </div>
              <p className="text-[11px] text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                National Cybercrime Reporting Helpline to immediately freeze fraudulent banking transactions in transit.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold font-mono text-[#A82020] dark:text-[#FBE6C2] hover:underline"
              >
                <span>cybercrime.gov.in</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://sancharsaathi.gov.in/sfc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold font-mono text-[#6C1A1A] dark:text-[#C9B29B] hover:underline"
              >
                <span>Chakshu (Fake Calls & SMS)</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* United States */}
          <div className="p-5 rounded-2xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/20 dark:border-[#A82020]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A82020] dark:text-[#FBE6C2]">
                United States (FBI & FTC)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-mono font-bold">
                Federal
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-black font-mono text-[#2A0E0E] dark:text-[#F3E6D5]">
                FBI IC3 & FTC
              </div>
              <p className="text-[11px] text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                Federal Bureau of Investigation Internet Crime Complaint Center and Federal Trade Commission.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold font-mono text-[#A82020] dark:text-[#FBE6C2] hover:underline"
              >
                <span>ic3.gov (FBI IC3)</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold font-mono text-[#6C1A1A] dark:text-[#C9B29B] hover:underline"
              >
                <span>reportfraud.ftc.gov</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* UK & International */}
          <div className="p-5 rounded-2xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/20 dark:border-[#A82020]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A82020] dark:text-[#FBE6C2]">
                UK & International
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 font-mono font-bold">
                Global
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-black font-mono text-[#2A0E0E] dark:text-[#F3E6D5]">
                Action Fraud (0300 123 2040)
              </div>
              <p className="text-[11px] text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                UK National Fraud and Cyber Crime Reporting Centre, plus free 7726 SMS scam forwarding.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://www.actionfraud.police.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold font-mono text-[#A82020] dark:text-[#FBE6C2] hover:underline"
              >
                <span>actionfraud.police.uk</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://apwg.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-bold font-mono text-[#6C1A1A] dark:text-[#C9B29B] hover:underline"
              >
                <span>APWG (Anti-Phishing Group)</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation: Spot The Scam */}
      <section id="quiz" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
          <div>
            <h2 className="font-display text-2xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#A82020]" />
              <span>Spot The Scam Simulation Quiz</span>
            </h2>
            <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-0.5">
              Test your ability to recognize manipulative urgency, credential harvesting, and deceptive domains.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {showResults && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#A82020]/10 text-[#A82020] dark:text-[#FBE6C2]">
                Score: {calculateScore()} / {QUIZ_QUESTIONS.length}
              </span>
            )}
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 text-xs font-mono font-bold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUIZ_QUESTIONS.map((q) => {
            const selectedIdx = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A82020] dark:text-[#FBE6C2]">
                      Case File #{q.id} &bull; {q.title}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 text-xs font-mono leading-relaxed text-[#2A0E0E] dark:text-[#F3E6D5]">
                    {q.scenario}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                            isChosen
                              ? 'border-[#A82020] bg-[#A82020]/10 font-bold'
                              : 'border-[#6C1A1A]/20 dark:border-[#A82020]/20 hover:bg-[#FBE6C2]/70 dark:hover:bg-[#3A1313]/50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-mono mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showResults && selectedIdx !== undefined && (
                  <div
                    className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      q.options[selectedIdx].isCorrect
                        ? 'bg-teal-500/10 border border-teal-500/30 text-teal-900 dark:text-teal-200'
                        : 'bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {q.options[selectedIdx].isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          <span>Correct Decision</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Vulnerable Choice</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">{q.options[selectedIdx].explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-center">
          <button
            onClick={() => setShowResults(!showResults)}
            className="px-8 py-3.5 rounded-2xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            {showResults ? 'Hide Detailed Forensic Rationales' : 'Check Answers & View Forensic Explanations'}
          </button>
        </div>
      </section>

      {/* Searchable Scam Glossary */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
          <div>
            <h2 className="font-display text-2xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-wide">
              Cybercrime Terminology & Glossary
            </h2>
            <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-0.5">
              Authoritative definitions and forensic clues for common fraud mechanisms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7E3E3E] dark:text-[#C9B29B]" />
              <input
                type="text"
                placeholder="Search glossary..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#A82020]"
              />
            </div>

            <div className="flex items-center gap-1 self-start sm:self-auto">
              {(['All', 'Technical', 'Psychological', 'Actors & Methods'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGlossaryCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                    glossaryCategory === cat
                      ? 'bg-[#A82020] text-white font-bold'
                      : 'border border-[#6C1A1A]/20 dark:border-[#A82020]/30 hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-base uppercase tracking-wide text-[#2A0E0E] dark:text-[#F3E6D5]">
                    {item.term}
                  </h3>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#6C1A1A]/10 dark:bg-[#FBE6C2]/10 text-[#6C1A1A] dark:text-[#FBE6C2]">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                  {item.definition}
                </p>
              </div>

              <div className="pt-3 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20 text-[11px] font-mono">
                <strong className="text-[#A82020] dark:text-[#FBE6C2] uppercase text-[10px] block">
                  Forensic Indicator:
                </strong>
                <span className="opacity-90">{item.forensicClue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessible FAQ Accordion */}
      <section className="space-y-6">
        <div className="pb-2 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
          <h2 className="font-display text-2xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-wide flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#A82020]" />
            <span>Frequently Asked Questions & Incident Advice</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FBE6C2]/50 dark:hover:bg-[#3A1313]/50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm text-[#2A0E0E] dark:text-[#F3E6D5]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#A82020] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7E3E3E] dark:text-[#C9B29B] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#5C2222] dark:text-[#C9B29B] leading-relaxed border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20 bg-[#F3E6D5]/40 dark:bg-[#1A0707]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
