import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X, ShieldAlert, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg text-base font-semibold transition-all ${
      isActive
        ? 'bg-[#A82020] text-[#F3E6D5]'
        : 'text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Drawer content */}
      <div
        ref={drawerRef}
        className="w-4/5 max-w-sm h-full bg-[#F3E6D5] dark:bg-[#1A0707] border-l border-[#6C1A1A]/30 dark:border-[#A82020]/40 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#A82020]" />
              <span className="font-display font-extrabold text-lg text-[#6C1A1A] dark:text-[#F3E6D5]">
                SCAMTRACE<span className="text-[#A82020]">.AI</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 mt-6" aria-label="Mobile Navigation">
            <NavLink to="/investigate" className={navLinkClass} onClick={onClose}>
              Investigate
            </NavLink>
            <NavLink to="/command-center" className={navLinkClass} onClick={onClose}>
              Command Center
            </NavLink>
            <NavLink to="/graph" className={navLinkClass} onClick={onClose}>
              Investigation Graph
            </NavLink>
            <NavLink to="/campaigns" className={navLinkClass} onClick={onClose}>
              Campaign Intelligence
            </NavLink>
            <NavLink to="/model-lab" className={navLinkClass} onClick={onClose}>
              Model Laboratory
            </NavLink>
            <NavLink to="/history" className={navLinkClass} onClick={onClose}>
              Investigation History
            </NavLink>
            <NavLink to="/academy" className={navLinkClass} onClick={onClose}>
              Scam Academy & Quiz
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={onClose}>
              About & Methodology
            </NavLink>
            <NavLink to="/settings" className={navLinkClass} onClick={onClose}>
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> System Settings
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Footer controls inside drawer */}
        <div className="pt-6 border-t border-[#6C1A1A]/20 dark:border-[#A82020]/30 flex items-center justify-between">
          <span className="text-xs text-[#7E3E3E] dark:text-[#C9B29B]">Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/60 dark:bg-[#2A0D0D]/60 text-xs font-semibold"
          >
            {resolvedTheme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-[#6C1A1A]" /> Switch to Dark
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-[#FBE6C2]" /> Switch to Light
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
