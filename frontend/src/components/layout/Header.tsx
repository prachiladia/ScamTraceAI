import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sun, Moon, Search, Menu, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'text-[var(--accent-primary)] bg-[var(--surface-elevated)]/80 shadow-[0_0_12px_rgba(34,211,238,0.12)] border border-[var(--border-subtle)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]/60'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-[var(--border-subtle)] backdrop-blur-md ${
        isScrolled
          ? 'py-2.5 bg-[var(--background)]/95 shadow-lg shadow-black/20'
          : 'py-3.5 bg-[var(--background)]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] rounded-lg p-0.5 shrink-0"
          aria-label="ScamTrace AI Home"
        >
          <BrandLogo size="sm" showWordmark={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
          <NavLink to="/investigate" className={navLinkClass}>
            Investigate
          </NavLink>
          <NavLink to="/command-center" className={navLinkClass}>
            Command Center
          </NavLink>
          <NavLink to="/graph" className={navLinkClass}>
            Graph
          </NavLink>
          <NavLink to="/campaigns" className={navLinkClass}>
            Campaigns
          </NavLink>
          <NavLink to="/model-lab" className={navLinkClass}>
            Model Lab
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            History
          </NavLink>
          <NavLink to="/academy" className={navLinkClass}>
            Scam Academy
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--surface-elevated)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label="Search ScamTrace AI (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="hidden sm:inline font-sans">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[var(--background-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded">
              Ctrl K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
          >
            {resolvedTheme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-[var(--accent-secondary)]" />
            )}
          </button>

          {/* Settings (Desktop/Tablet; available in Mobile Menu) */}
          <Link
            to="/settings"
            className="hidden sm:flex p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--surface-elevated)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label="System Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={onOpenMobileMenu}
            className="xl:hidden p-1.5 sm:p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
