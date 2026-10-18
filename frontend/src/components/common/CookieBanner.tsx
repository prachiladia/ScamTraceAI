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
      className="cookie-banner fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-40 p-5 rounded-xl border shadow-2xl bg-[#FBE6C2] dark:bg-[#2A0D0D] border-[#6C1A1A] dark:border-[#A82020] text-[#2A0E0E] dark:text-[#F3E6D5] transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-[#A82020] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 text-sm">
          <h3 className="font-bold text-base mb-1 text-[#2A0E0E] dark:text-[#FBE6C2]">
            Privacy & Essential Storage
          </h3>
          <p className="text-xs leading-relaxed opacity-90 mb-3">
            ScamTrace AI uses only local storage for essential features (dark mode, investigation drafts, and optional first-party referrer context). We use zero third-party analytics trackers.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConsent(true)}
              className="px-3 py-1.5 bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Accept Essential
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="px-3 py-1.5 border border-[#6C1A1A] dark:border-[#A82020] hover:bg-[#ECDCC8] dark:hover:bg-[#3A1313] text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Decline
            </button>
            <a
              href="#/about#privacy"
              className="text-xs underline ml-auto hover:text-[#A82020] dark:hover:text-[#FBE6C2]"
            >
              Learn more
            </a>
          </div>
        </div>
        <button
          onClick={() => handleConsent(false)}
          className="text-[#7E3E3E] dark:text-[#C9B29B] hover:text-[#2A0E0E] dark:hover:text-[#F3E6D5] p-1 rounded focus:outline-none"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
