import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  const buildDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--background-secondary)] transition-colors py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--border-subtle)]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block" aria-label="ScamTrace AI Home">
              <BrandLogo size="md" showWordmark={true} />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed font-sans">
              AI-powered scam investigation and cognitive cyber-defense platform. Don't just detect the scam. Expose the evidence behind it.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>System operational</span>
              </span>
              <span>•</span>
              <span>Offline Lexical Engine v2.4</span>
              <span>•</span>
              <span>Updated: {buildDate}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Investigation Tools
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link to="/investigate" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Evidence Analyzer
                </Link>
              </li>
              <li>
                <Link to="/command-center" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Command Center
                </Link>
              </li>
              <li>
                <Link to="/graph" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Entity Relationship Graph
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Campaign Intelligence
                </Link>
              </li>
              <li>
                <Link to="/model-lab" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Model Lab & Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Education & Support
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link to="/academy" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Scam Academy Lessons
                </Link>
              </li>
              <li>
                <Link to="/academy#quiz" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Spot-the-Scam Quiz
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                  Methodology & Limitations
                </Link>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] hover:underline transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>India Helpline (1930)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-4 font-mono">
          <p>
            © {new Date().getFullYear()} ScamTrace AI. Open source under MIT License. Educational decision support only. Not legal evidence or law enforcement attribution.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about#privacy" className="hover:text-[var(--accent-primary)] transition-colors underline">
              Privacy & Cookies
            </Link>
            <Link to="/about#licences" className="hover:text-[var(--accent-primary)] transition-colors underline">
              Dataset & Model Licences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
