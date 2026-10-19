import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('scamtrace_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('scamtrace_cookie_consent', accepted ? 'accepted' : 'declined');
    if (accepted) {
      // If accepted, persist session UTM to localStorage if present
      const utmSource = sessionStorage.getItem('scamtrace_utm_source');
      const utmMedium = sessionStorage.getItem('scamtrace_utm_medium');
      const utmCampaign = sessionStorage.getItem('scamtrace_utm_campaign');
      if (utmSource) localStorage.setItem('scamtrace_utm_source', utmSource);
      if (utmMedium) localStorage.setItem('scamtrace_utm_medium', utmMedium);
      if (utmCampaign) localStorage.setItem('scamtrace_utm_campaign', utmCampaign);
    } else {
      localStorage.removeItem('scamtrace_utm_source');
      localStorage.removeItem('scamtrace_utm_medium');
      localStorage.removeItem('scamtrace_utm_campaign');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Notice"
      className="cookie-banner fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-40 p-5 rounded-2xl border shadow-2xl bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--accent-secondary)] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 text-sm font-sans">
          <h3 className="font-display font-bold text-sm mb-1 text-[var(--text-primary)]">
            Privacy & Essential Storage
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
            ScamTrace AI uses only local storage for essential features (dark mode, investigation drafts, and optional first-party referrer context). We use zero third-party analytics trackers.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConsent(true)}
              className="px-3 py-1.5 bg-[var(--accent-primary)] hover:bg-[#06B6D4] text-[#080D18] text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Accept Essential
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Decline
            </button>
            <a
              href="#/about#privacy"
              className="text-xs underline ml-auto text-[var(--accent-primary)] hover:underline"
            >
              Learn more
            </a>
          </div>
        </div>
        <button
          onClick={() => handleConsent(false)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded focus:outline-none cursor-pointer"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
