import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/50 dark:bg-[#2A0D0D] text-xs font-bold text-[#A82020] dark:text-[#FBE6C2]">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Generation Scam Evidence Engine</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#6C1A1A] dark:text-[#F3E6D5] uppercase leading-none max-w-5xl mx-auto">
          Don't just detect the scam. <br />
          <span className="text-[#A82020] underline decoration-[#FBE6C2] dark:decoration-[#6C1A1A]">Expose the evidence</span> behind it.
        </h1>

        <p className="text-base sm:text-xl text-[#5C2222] dark:text-[#C9B29B] max-w-3xl mx-auto leading-relaxed">
          ScamTrace AI deconstructs coercive messages, dissects fraudulent URLs lexically without visiting them, highlights deceptive language spans, and arms you with a personalized user safety playbook.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/investigate"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Launch Evidence Analyzer</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/academy"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#6C1A1A] dark:border-[#A82020] text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] font-bold text-base transition-colors"
          >
            <span>Explore Scam Academy & Quiz</span>
          </Link>
        </div>
      </div>

      {/* Quick 3 Pillar Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#A82020] text-white flex items-center justify-center font-black">
            01
          </div>
          <h3 className="font-bold text-lg text-[#2A0E0E] dark:text-[#F3E6D5]">TO DETECT</h3>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
            Calibrated message ML classifiers combined with pure offline lexical URL analysis flag urgency, deceptive TLDs, and suspicious structure without exposing your network.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C1A1A] text-white flex items-center justify-center font-black">
            02
          </div>
          <h3 className="font-bold text-lg text-[#2A0E0E] dark:text-[#F3E6D5]">TO EXPLAIN</h3>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
            Every score is broken down into specific psychological triggers: artificial deadlines, authority impersonation, bank suspension claims, and prize lures with highlighted text spans.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E6E60] text-white flex items-center justify-center font-black">
            03
          </div>
          <h3 className="font-bold text-lg text-[#2A0E0E] dark:text-[#F3E6D5]">TO PROTECT</h3>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
            Receive actionable, non-retaliatory safety playbooks tailored to your situation, complete with verified national reporting helplines (India 1930 / cybercrime.gov.in).
          </p>
        </div>
      </div>
    </div>
  );
};
