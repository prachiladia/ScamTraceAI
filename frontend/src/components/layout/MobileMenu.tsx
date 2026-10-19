import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';

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
    `flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[var(--surface-elevated)] text-[var(--accent-primary)] border border-[var(--border-subtle)] shadow-[0_0_12px_rgba(34,211,238,0.12)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Drawer content */}
      <div
        ref={drawerRef}
        className="w-4/5 max-w-sm h-full bg-[var(--background-secondary)] border-l border-[var(--border-subtle)] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
            <BrandLogo size="sm" showWordmark={true} />
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1.5 mt-6" aria-label="Mobile Navigation">
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
        <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono">
          <span className="text-xs text-[var(--text-secondary)]">Interface Theme</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
          >
            {resolvedTheme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-[var(--accent-primary)]" /> Switch to Dark
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-[var(--accent-secondary)]" /> Switch to Light
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
