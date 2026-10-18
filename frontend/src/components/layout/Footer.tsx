import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const buildDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <footer className="w-full border-t border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/60 dark:bg-[#1A0707] transition-colors py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#6C1A1A]/10 dark:border-[#A82020]/20">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#A82020] flex items-center justify-center text-[#F3E6D5] shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-2xl text-[#6C1A1A] dark:text-[#F3E6D5]">
                SCAMTRACE<span className="text-[#A82020]">.AI</span>
              </span>
            </div>
            <p className="text-sm text-[#5C2222] dark:text-[#C9B29B] max-w-md leading-relaxed">
              AI-powered scam investigation and cyber-resilience education platform. Don't just detect the scam. Expose the evidence behind it.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#7E3E3E] dark:text-[#FBE6C2]/70">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System operational</span>
              <span>•</span>
              <span>Last updated: {buildDate}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2] mb-3">
              Investigation Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/investigate" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Evidence Analyzer
                </Link>
              </li>
              <li>
                <Link to="/command-center" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Command Center
                </Link>
              </li>
              <li>
                <Link to="/graph" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Entity Relationship Graph
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Campaign Intelligence
                </Link>
              </li>
              <li>
                <Link to="/model-lab" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Model Lab & Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2] mb-3">
              Education & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/academy" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Scam Academy Lessons
                </Link>
              </li>
              <li>
                <Link to="/academy#quiz" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Spot-the-Scam Quiz
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors">
                  Methodology & Limitations
                </Link>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#A82020] dark:hover:text-[#FBE6C2] transition-colors"
                >
                  India Helpline (1930) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7E3E3E] dark:text-[#C9B29B]/70 gap-4">
          <p>
            © {new Date().getFullYear()} ScamTrace AI. Open source under MIT License. Educational decision support only. Not legal evidence or law enforcement attribution.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about#privacy" className="underline hover:text-[#A82020] dark:hover:text-[#F3E6D5]">
              Privacy & Cookies
            </Link>
            <Link to="/about#licences" className="underline hover:text-[#A82020] dark:hover:text-[#F3E6D5]">
              Dataset & Model Licences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
