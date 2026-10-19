import React from 'react';
import { ShieldCheck, Scale, Lock, Database } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="pb-6 border-b border-border-subtle">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border-subtle bg-surface text-[10px] font-mono uppercase tracking-wider text-accent-primary mb-2">
          Forensic Transparency & Standards
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
          About & Forensic Methodology
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Open architecture, machine learning boundaries, dataset provenance, privacy protections, and responsible disclosure.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        {/* Architecture Section */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent-primary" />
            <span>Architecture & Principles</span>
          </h2>
          <p>
            ScamTrace AI separates machine learning predictions, deterministic forensic rules, and language-model reasoning into strictly segregated layers. A spam classification score is explicitly never treated as proof of financial crime.
          </p>
          <div className="p-5 rounded-2xl bg-surface border border-border-subtle space-y-2">
            <h3 className="font-mono font-bold uppercase text-xs text-accent-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span>Strict Zero-Fetch URL Policy</span>
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Under no circumstances does ScamTrace AI resolve, fetch, or open any submitted URL. Analysis is 100% lexical and structural (evaluating subdomain counts, character entropy, path depth, and known high-risk TLDs locally).
            </p>
          </div>
        </section>

        {/* Dataset Provenance */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
            <Database className="w-5 h-5 text-accent-primary" />
            <span>Dataset Provenance & Attribution</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-2">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wide">
                SMS Spam Collection
              </h4>
              <p className="text-xs text-text-secondary">
                Curated by Tiago A. Almeida and José María Gómez Hidalgo. Used for text-based deceptive lure modeling under academic research attribution.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-2">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wide">
                Phishing URLs with Extracted Features
              </h4>
              <p className="text-xs text-text-secondary">
                Curated by Victus Adi (Kaggle), licensed under CC BY-SA 4.0. ScamTrace AI trains exclusively on the locally reproducible lexical subset.
              </p>
            </div>
          </div>
        </section>

        {/* Limitations & Legal Notice */}
        <section id="limitations" className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
            <Scale className="w-5 h-5 text-accent-primary" />
            <span>Limitations & Non-Attribution Policy</span>
          </h2>
          <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-xs text-text-secondary space-y-2">
            <p>
              ScamTrace AI is an educational decision-support tool. It does not provide official law enforcement attribution, identify individuals, or verify telecom subscriber identity. Entities identified as appearing in suspicious contexts should be independently audited.
            </p>
          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent-primary" />
            <span>Privacy & Cookie Policy</span>
          </h2>
          <div className="p-5 rounded-2xl bg-surface border border-border-subtle text-xs text-text-secondary space-y-2">
            <p>
              We do not deploy third-party trackers, external advertising pixels, or invasive telemetry. Local storage is strictly utilized for UI themes, case drafts, and optional first-party referrer context when enabled.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
