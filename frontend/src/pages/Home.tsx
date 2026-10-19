import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Eye, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { IntelligenceNetwork } from '../components/canvas/IntelligenceNetwork';
import { EvidenceTapePreloader } from '../components/EvidenceTapePreloader';
import { PullMeHeroTape } from '../components/PullMeHeroTape';
import { MarqueeBanner } from '../components/MarqueeBanner';
import { MiniLiveExtractor } from '../components/MiniLiveExtractor';
import { ScamTypeSlider } from '../components/ScamTypeSlider';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  // Kinetic Headline Words for animated reveal
  const headlineWords = ["Don't", "just", "detect", "the", "scam.", "Expose", "the", "evidence."];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Evidence Tape Preloader (plays once per session, skippable, reduced-motion friendly) */}
      <EvidenceTapePreloader />

      {/* Top Educational Marquee Banner */}
      <MarqueeBanner speedSeconds={28} variant="cyan" />

      {/* Hero Container with Canvas Background */}
      <div className="relative isolate pt-6 pb-16 sm:pt-12 sm:pb-24 border-b border-[var(--border-subtle)]">
        {/* Dynamic Intelligence Network Canvas Background */}
        <IntelligenceNetwork />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/90 text-xs font-mono font-semibold text-[var(--accent-primary)] shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="tracking-wider uppercase">AI-POWERED THREAT INTELLIGENCE</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-5xl mx-auto leading-[1.08] flex flex-wrap justify-center gap-x-3 gap-y-1">
            {headlineWords.map((word, index) => {
              const isAccent = word.toLowerCase().includes('expose') || word.toLowerCase().includes('evidence');
              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className={isAccent ? "text-[var(--accent-primary)] drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]" : ""}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>

          {/* Support Copy */}
          <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-sans">
            Investigate suspicious messages, analyse potentially risky URLs, and uncover connections between digital threats with evidence-driven AI.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/investigate">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)]"
              >
                Start Investigation
              </Button>
            </Link>
            <Link to="/command-center">
              <Button
                variant="secondary"
                size="lg"
                icon={<Activity className="w-4 h-4 text-[var(--accent-secondary)]" />}
              >
                Explore Intelligence
              </Button>
            </Link>
          </div>

          {/* Draggable PULL ME Hero Element */}
          <PullMeHeroTape />

          {/* System Telemetry Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--surface)]/80 border border-[var(--border-subtle)]">
              <Terminal className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
              <span>Offline Lexical Engine • 10-Feature Inspection</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--surface)]/80 border border-[var(--border-subtle)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Zero Network Lookups • 100% Privacy Preserved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        {/* Three Forensic Imperatives */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase font-bold tracking-widest text-[var(--accent-primary)]">
              The Three Forensic Imperatives
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-wide">
              How ScamTrace AI Protects You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story Card 1: TO DETECT */}
            <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center font-mono text-lg font-bold">
                  01
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-primary)]">
                  <Search className="w-4 h-4" />
                  <span>Dual Classification ML</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[var(--text-primary)] uppercase tracking-wide">
                  TO DETECT
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  Calibrated text classifiers score message coercion while our 10-feature lexical URL engine analyzes character entropy, suspicious TLDs, and IP addresses locally—without making a single network fetch or exposing you to malicious payloads.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
                ✓ 97.68% SMS Spam Accuracy &bull; 100% Lexical URL Accuracy
              </div>
            </div>

            {/* Story Card 2: TO EXPLAIN */}
            <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-secondary)] flex items-center justify-center font-mono text-lg font-bold">
                  02
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-secondary)]">
                  <Eye className="w-4 h-4" />
                  <span>Evidence Span Isolation</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[var(--text-primary)] uppercase tracking-wide">
                  TO EXPLAIN
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  Every threat score is deconstructed into tangible evidence. We highlight manipulative urgency phrases, authority impersonations, and credential demands in the raw text, distinguishing predatory threats from legitimate protective advisories.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
                ✓ Contextual NLP Spans &bull; No Black-Box Mysticism
              </div>
            </div>

            {/* Story Card 3: TO PROTECT */}
            <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-emerald-400 flex items-center justify-center font-mono text-lg font-bold">
                  03
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Actionable User Playbook</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[var(--text-primary)] uppercase tracking-wide">
                  TO PROTECT
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  We generate calm, step-by-step user defense playbooks. Never retaliation, never vigilantism—only verified self-defense actions, carrier reporting codes, and direct links to official cybercrime helplines (India 1930 / cybercrime.gov.in).
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
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
          <MarqueeBanner speedSeconds={34} reverse variant="surface" />
        </div>

        {/* Big Bold Footer Wordmark & Technical Grid Detail */}
        <section className="pt-12 pb-6 border-t border-[var(--border-subtle)] space-y-8 text-center">
          <div className="space-y-3">
            <div className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase text-[var(--surface-elevated)] select-none tracking-tighter">
              SCAMTRACE AI
            </div>
            <p className="font-mono text-xs text-[var(--text-secondary)] max-w-xl mx-auto">
              Open-source cybercrime decision support and cognitive defense platform. Operating 100% offline lexical analysis. Decision support only; not legal evidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-semibold text-[var(--text-secondary)]">
            <Link to="/investigate" className="hover:text-[var(--accent-primary)] transition-colors">
              Evidence Analyzer
            </Link>
            <span>&bull;</span>
            <Link to="/graph" className="hover:text-[var(--accent-primary)] transition-colors">
              Investigation Graph
            </Link>
            <span>&bull;</span>
            <Link to="/model-lab" className="hover:text-[var(--accent-primary)] transition-colors">
              Model Lab & Metrics
            </Link>
            <span>&bull;</span>
            <Link to="/academy" className="hover:text-[var(--accent-primary)] transition-colors">
              Scam Academy & Quiz
            </Link>
            <span>&bull;</span>
            <Link to="/history" className="hover:text-[var(--accent-primary)] transition-colors">
              Case Archive
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
