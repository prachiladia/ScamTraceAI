import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Keyboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const KeyboardShortcutsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check for ? key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }

      // Alt shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            navigate('/investigate');
            break;
          case 'g':
            e.preventDefault();
            navigate('/graph');
            break;
          case 'c':
            e.preventDefault();
            navigate('/command-center');
            break;
          case 'l':
            e.preventDefault();
            navigate('/model-lab');
            break;
          case 'a':
            e.preventDefault();
            navigate('/academy');
            break;
          case 't':
            e.preventDefault();
            toggleTheme();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigate, toggleTheme]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', action: 'Open Global Command Palette' },
    { key: '?', action: 'Toggle Keyboard Shortcuts Cheatsheet' },
    { key: 'Esc', action: 'Close Modal or Overlay' },
    { key: 'Alt + N', action: 'Go to New Investigation Workspace' },
    { key: 'Alt + G', action: 'Go to Interactive Investigation Graph' },
    { key: 'Alt + C', action: 'Go to Incident Command Center' },
    { key: 'Alt + L', action: 'Go to Model Lab & Metrics' },
    { key: 'Alt + A', action: 'Go to Scam Academy & Quiz' },
    { key: 'Alt + T', action: 'Toggle Light / Dark Mode' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts Cheatsheet"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] shadow-2xl p-6 space-y-5 text-[#2A0E0E] dark:text-[#F3E6D5]">
        <div className="flex items-center justify-between pb-3 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#A82020]" />
            <h3 className="font-display font-black text-lg uppercase tracking-wide">
              Keyboard Shortcuts Cheatsheet
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close shortcuts cheatsheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#6C1A1A]/10 dark:divide-[#A82020]/20 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <span className="font-medium opacity-90">{sc.action}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[#FBE6C2] dark:bg-[#2A0D0D] border border-[#6C1A1A]/20 dark:border-[#A82020]/30 font-mono font-bold text-[11px] text-[#A82020] dark:text-[#FBE6C2] shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-mono text-center text-[#7E3E3E] dark:text-[#C9B29B] pt-2">
          Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Esc</kbd> or click outside to dismiss
        </div>
      </div>
    </div>
  );
};
