import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Zap, Search, Eye, Lock } from 'lucide-react';
import { EvidenceTapePreloader } from '../components/EvidenceTapePreloader';
import { PullMeHeroTape } from '../components/PullMeHeroTape';
import { MarqueeBanner } from '../components/MarqueeBanner';
import { MiniLiveExtractor } from '../components/MiniLiveExtractor';
import { ScamTypeSlider } from '../components/ScamTypeSlider';

export const Home: React.FC = () => {
  // Kinetic Headline Words for animated reveal
  const headlineWords = ["DON'T", "JUST", "DETECT", "THE", "SCAM.", "EXPOSE", "THE", "EVIDENCE."];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Evidence Tape Preloader (plays once per session, skippable, reduced-motion friendly) */}
      <EvidenceTapePreloader />

      {/* Top Educational Marquee Banner */}
      <MarqueeBanner speedSeconds={28} variant="crimson" />

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        {/* Kinetic Hero Section */}
        <section className="text-center py-8 sm:py-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/60 dark:bg-[#2A0D0D] text-xs font-bold text-[#A82020] dark:text-[#FBE6C2] shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#A82020] dark:text-[#FBE6C2]" />
            <span className="font-mono tracking-wider">NEXT-GENERATION FORENSIC SCAM EVIDENCE ENGINE</span>
          </div>

          {/* Kinetic Headline with Word-by-Word Reveal */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#6C1A1A] dark:text-[#F3E6D5] uppercase leading-none max-w-5xl mx-auto flex flex-wrap justify-center gap-x-3 gap-y-1">
            {headlineWords.map((word, index) => {
              const isAccent = word === "EXPOSE" || word === "THE" || word === "EVIDENCE.";
              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className={isAccent ? "text-[#A82020] underline decoration-[#FBE6C2] dark:decoration-[#6C1A1A]" : ""}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>

          <p className="text-base sm:text-xl text-[#5C2222] dark:text-[#C9B29B] max-w-3xl mx-auto leading-relaxed font-sans">
            ScamTrace AI breaks down coercive messages, dissects fraudulent URLs lexically without exposing your network, isolates psychological pressure points, and equips you with a defensive user safety playbook.
          </p>

          {/* Draggable PULL ME Hero Element (Sweet-tape inspired) */}
          <PullMeHeroTape />

          {/* Standard Navigation CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/investigate"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-bold text-base shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-0.5 border border-[#6C1A1A]/30"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Launch Evidence Analyzer</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/academy"
              className="flex items-center gap-2 px-7 py-4 rounded-2xl border-2 border-[#6C1A1A] dark:border-[#A82020] text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] font-bold text-base transition-colors"
            >
              <span>Explore Scam Academy & Quiz</span>
            </Link>
          </div>
        </section>

        {/* Scroll Storytelling Sections ("TO CREATE / TO FIX / TO PROTECT" => "TO DETECT / TO EXPLAIN / TO PROTECT") */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#A82020] dark:text-[#FBE6C2]">
              The Three Forensic Imperatives
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
              How ScamTrace AI Protects You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story Card 1: TO DETECT */}
            <div className="p-8 rounded-3xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#A82020] text-white flex items-center justify-center font-display text-xl font-black">
                  01
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#A82020] dark:text-[#FBE6C2]">
                  <Search className="w-4 h-4" />
                  <span>Dual Classification ML</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[#2A0E0E] dark:text-[#F3E6D5] uppercase tracking-wide">
                  TO DETECT
                </h3>
                <p className="text-xs sm:text-sm text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                  Calibrated text classifiers score message coercion while our 10-feature lexical URL engine analyzes character entropy, suspicious TLDs, and IP addresses locally—without making a single network fetch or exposing you to malicious payloads.
                </p>
              </div>
              <div className="pt-4 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20 font-mono text-[11px] text-[#7E3E3E] dark:text-[#C9B29B]">
                ✓ 97.68% SMS Spam Accuracy &bull; 100% Lexical URL Accuracy
              </div>
            </div>

            {/* Story Card 2: TO EXPLAIN */}
            <div className="p-8 rounded-3xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6C1A1A] text-white flex items-center justify-center font-display text-xl font-black">
                  02
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#6C1A1A] dark:text-[#FBE6C2]">
                  <Eye className="w-4 h-4" />
                  <span>Evidence Span Isolation</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[#2A0E0E] dark:text-[#F3E6D5] uppercase tracking-wide">
                  TO EXPLAIN
                </h3>
                <p className="text-xs sm:text-sm text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                  Every threat score is deconstructed into tangible evidence. We highlight manipulative urgency phrases, authority impersonations, and credential demands in the raw text, distinguishing predatory threats from legitimate protective advisories.
                </p>
              </div>
              <div className="pt-4 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20 font-mono text-[11px] text-[#7E3E3E] dark:text-[#C9B29B]">
                ✓ Contextual NLP Spans &bull; No Black-Box Mysticism
              </div>
            </div>

            {/* Story Card 3: TO PROTECT */}
            <div className="p-8 rounded-3xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1E6E60] text-white flex items-center justify-center font-display text-xl font-black">
                  03
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#1E6E60] dark:text-[#14B8A6]">
                  <Lock className="w-4 h-4" />
                  <span>Actionable User Playbook</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[#2A0E0E] dark:text-[#F3E6D5] uppercase tracking-wide">
                  TO PROTECT
                </h3>
                <p className="text-xs sm:text-sm text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
                  We generate calm, step-by-step user defense playbooks. Never retaliation, never vigilantism—only verified self-defense actions, carrier reporting codes, and direct links to official cybercrime helplines (India 1930 / cybercrime.gov.in).
                </p>
              </div>
              <div className="pt-4 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20 font-mono text-[11px] text-[#7E3E3E] dark:text-[#C9B29B]">
                ✓ Safe De-escalation &bull; Zero Network Leaks
              </div>
            </div>
          </div>

          {/* Live Mini Interactive Dissector Demo */}
          <div className="pt-6">
            <MiniLiveExtractor />
          </div>
        </section>

        {/* Card Slider / Library of Scam Types */}
        <section className="space-y-6">
          <ScamTypeSlider />
        </section>

        {/* Secondary Educational Marquee Banner (Reversed direction) */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <MarqueeBanner speedSeconds={34} reverse variant="peach" />
        </div>

        {/* Big Bold Footer Wordmark & Technical Grid Detail */}
        <section className="pt-12 pb-6 border-t-2 border-[#6C1A1A]/20 dark:border-[#A82020]/30 space-y-8 text-center">
          <div className="space-y-3">
            <div className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase text-[#6C1A1A]/15 dark:text-[#F3E6D5]/10 select-none tracking-tighter">
              SCAMTRACE AI
            </div>
            <p className="font-mono text-xs text-[#7E3E3E] dark:text-[#C9B29B] max-w-xl mx-auto">
              Open-source cybercrime decision support and cognitive defense platform. Operating 100% offline lexical analysis. Decision support only; not legal evidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-bold text-[#6C1A1A] dark:text-[#FBE6C2]">
            <Link to="/investigate" className="hover:underline">Evidence Analyzer</Link>
            <span>&bull;</span>
            <Link to="/graph" className="hover:underline">Investigation Graph</Link>
            <span>&bull;</span>
            <Link to="/models" className="hover:underline">Model Lab & Metrics</Link>
            <span>&bull;</span>
            <Link to="/academy" className="hover:underline">Scam Academy & Quiz</Link>
            <span>&bull;</span>
            <Link to="/history" className="hover:underline">Case Archive</Link>
          </div>
        </section>
      </main>
    </div>
  );
};
