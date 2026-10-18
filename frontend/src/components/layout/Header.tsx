import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldAlert, Sun, Moon, Search, Menu, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#A82020] text-[#F3E6D5] shadow-sm'
        : 'text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30 backdrop-blur-md ${
        isScrolled
          ? 'py-2 bg-[#F3E6D5]/90 dark:bg-[#1A0707]/90 shadow-md'
          : 'py-4 bg-[#F3E6D5] dark:bg-[#1A0707]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#A82020] rounded-lg p-1"
          aria-label="ScamTrace AI Home"
        >
          <div className="w-9 h-9 rounded-lg bg-[#A82020] flex items-center justify-center text-[#F3E6D5] shadow-md group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-wider font-extrabold text-[#6C1A1A] dark:text-[#F3E6D5] leading-none">
              SCAMTRACE<span className="text-[#A82020]">.AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7E3E3E] dark:text-[#FBE6C2]/70">
              Evidence Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
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
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/50 dark:bg-[#2A0D0D]/50 text-xs text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors cursor-pointer"
            aria-label="Search ScamTrace AI (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#A82020] dark:text-[#FBE6C2]" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#E2CEB9] dark:bg-[#3A1313] rounded">
              Ctrl K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/50 dark:bg-[#2A0D0D]/50 text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors cursor-pointer"
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
          >
            {resolvedTheme === 'light' ? (
              <Moon className="w-4 h-4 text-[#6C1A1A]" />
            ) : (
              <Sun className="w-4 h-4 text-[#FBE6C2]" />
            )}
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-2 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/50 dark:bg-[#2A0D0D]/50 text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors"
            aria-label="System Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={onOpenMobileMenu}
            className="xl:hidden p-2 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/50 dark:bg-[#2A0D0D]/50 text-[#2A0E0E] dark:text-[#F3E6D5] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
