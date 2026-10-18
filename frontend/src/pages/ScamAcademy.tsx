import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, PhoneCall, Globe } from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'EXAMPLE: You receive an SMS: "Dear customer, your SBI NetBanking profile is locked due to overdue KYC. Submit Aadhaar to http://sbi-profile-unlock.xyz immediately to prevent police report."',
    options: [
      { text: 'Click the link immediately to prevent the police report.', isCorrect: false, explanation: 'Incorrect. Urgency and threats of police action are common psychological coercion tactics. Banks never send third-party .xyz links.' },
      { text: 'Ignore and report to cybercrime helpline 1930; verify via official bank app.', isCorrect: true, explanation: 'Correct! Real banks never send coercive SMS threats or request Aadhaar on unauthorized domains.' },
      { text: 'Forward the message to friends to check if their accounts are also locked.', isCorrect: false, explanation: 'Incorrect. Forwarding unverified phishing links risks spreading scam infrastructure.' },
    ],
  },
  {
    id: 2,
    scenario: 'EXAMPLE: A caller claiming to be an India Post official asks for 50 INR to redeliver a parcel and asks you to install AnyDesk or TeamViewer to verify your payment.',
    options: [
      { text: 'Install the app since 50 INR is a very small amount.', isCorrect: false, explanation: 'Incorrect! Installing remote desktop tools like AnyDesk allows criminals to take over your device and empty your bank accounts.' },
      { text: 'Refuse to install any software, terminate the call, and verify at the local post office.', isCorrect: true, explanation: 'Correct! Postal services will never request remote access software to process a delivery.' },
    ],
  },
];

export const ScamAcademy: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev: Record<number, number>) => ({ ...prev, [questionId]: optionIdx }));
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

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
          Scam Academy & Cyber Defense Field Guide
        </h1>
        <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
          Learn how psychological coercion and deceptive infrastructure operate, test your instincts with interactive simulations, and master verified defense tactics.
        </p>
      </div>

      {/* Emergency Reporting Banner (Verified India Resources) */}
      <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 dark:bg-red-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 dark:text-red-400">
            Emergency Victim Response (India)
          </span>
          <h2 className="text-base font-bold text-[#2A0E0E] dark:text-[#F3E6D5]">
            Have you been defrauded or shared an OTP within the last 2 hours?
          </h2>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] max-w-2xl leading-relaxed">
            Immediately call the National Cybercrime Reporting Helpline <strong>1930</strong> (formerly 155260) to freeze fraudulent transfers in transit. File an official complaint at <strong>cybercrime.gov.in</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:1930"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A82020] text-white font-bold text-xs shadow-md hover:bg-red-700 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1930 Helpline</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#6C1A1A] dark:border-[#A82020] text-xs font-bold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>cybercrime.gov.in</span>
          </a>
        </div>
      </div>

      {/* Interactive Quiz Section */}
      <div id="quiz" className="space-y-6">
        <div className="flex items-center gap-2 pb-2">
          <BookOpen className="w-5 h-5 text-[#A82020]" />
          <h2 className="font-bold text-lg text-[#2A0E0E] dark:text-[#F3E6D5] uppercase tracking-wide">
            Interactive Simulation: Spot The Scam
          </h2>
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-4"
            >
              <div className="p-3 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 text-xs font-mono">
                {q.scenario}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#A82020] bg-[#A82020]/10 font-bold'
                          : 'border-[#6C1A1A]/20 dark:border-[#A82020]/20 hover:bg-[#FBE6C2]/60 dark:hover:bg-[#3A1313]/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResults && selectedAnswers[q.id] !== undefined && (
                <div className={`p-4 rounded-xl text-xs space-y-1 ${
                  q.options[selectedAnswers[q.id]].isCorrect
                    ? 'bg-teal-500/10 border border-teal-500/30 text-teal-900 dark:text-teal-200'
                    : 'bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {q.options[selectedAnswers[q.id]].isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                  <p>{q.options[selectedAnswers[q.id]].explanation}</p>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowResults(!showResults)}
              className="px-6 py-2.5 rounded-xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {showResults ? 'Hide Explanations' : 'Check Answers & View Analysis'}
            </button>
            {showResults && (
              <span className="text-xs font-bold font-mono">
                Score: {calculateScore()} / {QUIZ_QUESTIONS.length} Correct
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
