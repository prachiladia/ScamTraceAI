import { ShieldCheck, Scale, Lock, Database } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
          About & Forensic Methodology
        </h1>
        <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
          Open architecture, machine learning boundaries, dataset provenance, privacy protections, and responsible disclosure.
        </p>
      </div>

      <div className="space-y-8 text-xs text-[#2A0E0E] dark:text-[#F3E6D5] leading-relaxed">
        {/* Architecture Section */}
        <section className="space-y-3">
          <h2 className="font-bold text-base text-[#6C1A1A] dark:text-[#FBE6C2] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#A82020]" />
            <span>Architecture & Principles</span>
          </h2>
          <p>
            ScamTrace AI separates machine learning predictions, deterministic forensic rules, and language-model reasoning into strictly segregated layers. A spam classification score is explicitly never treated as proof of financial crime.
          </p>
          <div className="p-4 rounded-xl bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 border border-[#6C1A1A]/20 dark:border-[#A82020]/30 space-y-2">
            <h3 className="font-bold uppercase text-[11px] text-[#A82020] dark:text-[#FBE6C2]">
              Strict Zero-Fetch URL Policy
            </h3>
            <p>
              Under no circumstances does ScamTrace AI resolve, fetch, or open any submitted URL. Analysis is 100% lexical and structural (evaluating subdomain counts, character entropy, path depth, and known high-risk TLDs locally).
            </p>
          </div>
        </section>

        {/* Dataset Provenance */}
        <section className="space-y-3">
          <h2 className="font-bold text-base text-[#6C1A1A] dark:text-[#FBE6C2] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#A82020]" />
            <span>Dataset Provenance & Attribution</span>
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>SMS Spam Collection:</strong> Curated by Tiago A. Almeida and José María Gómez Hidalgo. Used for text-based deceptive lure modeling under academic research attribution.
            </li>
            <li>
              <strong>Phishing URLs with Extracted Features:</strong> Curated by Victus Adi (Kaggle), licensed under CC BY-SA 4.0. ScamTrace AI trains exclusively on the locally reproducible lexical subset.
            </li>
          </ul>
        </section>

        {/* Limitations & Legal Notice */}
        <section id="limitations" className="space-y-3">
          <h2 className="font-bold text-base text-[#6C1A1A] dark:text-[#FBE6C2] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#A82020]" />
            <span>Limitations & Non-Attribution Policy</span>
          </h2>
          <p>
            ScamTrace AI is an educational decision-support tool. It does not provide official law enforcement attribution, identify individuals, or verify telecom subscriber identity. Entities identified as appearing in suspicious contexts should be independently audited.
          </p>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="space-y-3">
          <h2 className="font-bold text-base text-[#6C1A1A] dark:text-[#FBE6C2] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#A82020]" />
            <span>Privacy & Cookie Policy</span>
          </h2>
          <p>
            We do not deploy third-party trackers, external advertising pixels, or invasive telemetry. Local storage is strictly utilized for UI themes, case drafts, and optional first-party referrer context when enabled.
          </p>
        </section>
      </div>
    </div>
  );
};
