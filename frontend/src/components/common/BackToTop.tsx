import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="back-to-top fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[var(--surface-elevated)] hover:bg-[var(--surface)] text-[var(--accent-primary)] border border-[var(--border-subtle)] shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:border-[var(--accent-primary)]/50 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
