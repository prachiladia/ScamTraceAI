import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, BookOpen, Shield, HelpCircle, ArrowRight, X } from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  category: 'Pages' | 'Academy' | 'Glossary' | 'FAQ';
  path: string;
  description: string;
}

const SEARCH_ITEMS: PaletteItem[] = [
  { id: 'p-inv', title: 'New Investigation', category: 'Pages', path: '/investigate', description: 'Analyze suspicious text, SMS, or URLs for scam indicators' },
  { id: 'p-cmd', title: 'Command Center', category: 'Pages', path: '/command-center', description: 'Operations hub and investigation metrics' },
  { id: 'p-graph', title: 'Investigation Graph', category: 'Pages', path: '/graph', description: 'Interactive entity relationships and indicator links' },
  { id: 'p-camp', title: 'Campaign Intelligence', category: 'Pages', path: '/campaigns', description: 'Detect coordinated scam waves and shared infrastructure' },
  { id: 'p-lab', title: 'Model Laboratory', category: 'Pages', path: '/model-lab', description: 'Real benchmark metrics, confusion matrices, and live test' },
  { id: 'p-hist', title: 'Investigation History', category: 'Pages', path: '/history', description: 'Browse and inspect past investigations' },
  { id: 'p-acad', title: 'Scam Academy', category: 'Pages', path: '/academy', description: 'Educational lessons, red flags, and spot-the-scam quiz' },
  { id: 'p-abt', title: 'About & Methodology', category: 'Pages', path: '/about', description: 'Model provenance, dataset attribution, and limitations' },
  { id: 'p-set', title: 'Settings', category: 'Pages', path: '/settings', description: 'Manage local Ollama model, demo mode, and admin keys' },

  // Academy
  { id: 'a-otp', title: 'OTP & Credential Theft', category: 'Academy', path: '/academy#otp-scams', description: 'How scammers trick victims into sharing authentication tokens' },
  { id: 'a-kyc', title: 'Fake Bank & KYC Suspension', category: 'Academy', path: '/academy#kyc-suspension', description: 'Urgency tactics claiming bank deactivation' },
  { id: 'a-job', title: 'Part-time Task & Job Scams', category: 'Academy', path: '/academy#job-scams', description: 'Telegram task schemes and fake YouTube review fraud' },
  { id: 'a-courier', title: 'Customs & Courier Delivery Fraud', category: 'Academy', path: '/academy#courier-scams', description: 'Phishing for parcel redelivery fees' },
  { id: 'a-quiz', title: 'Spot-the-Scam Quiz', category: 'Academy', path: '/academy#quiz', description: 'Interactive scored quiz with explanation breakdowns' },

  // Glossary
  { id: 'g-smish', title: 'Smishing (SMS Phishing)', category: 'Glossary', path: '/academy#glossary-smishing', description: 'Phishing attacks conducted via SMS text messages' },
  { id: 'g-mule', title: 'Mule Accounts', category: 'Glossary', path: '/academy#glossary-mule', description: 'Bank accounts rented to launder stolen scam funds' },
  { id: 'g-vishing', title: 'Vishing (Voice Phishing)', category: 'Glossary', path: '/academy#glossary-vishing', description: 'Phone calls impersonating bank or police officials' },

  // FAQ
  { id: 'f-safety', title: 'What should I do if I already paid?', category: 'FAQ', path: '/academy#emergency-steps', description: 'Immediate emergency actions: call 1930 / freeze bank accounts' },
  { id: 'f-accuracy', title: 'Does a spam prediction prove fraud?', category: 'FAQ', path: '/about#limitations', description: 'No. Model predictions are decision support, not legal proof' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pages': return <FileText className="w-4 h-4 text-accent-primary" />;
      case 'Academy': return <BookOpen className="w-4 h-4 text-risk-warning" />;
      case 'Glossary': return <Shield className="w-4 h-4 text-accent-secondary" />;
      default: return <HelpCircle className="w-4 h-4 text-accent-primary" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
    >
      <div className="w-full max-w-xl rounded-2xl border border-border-subtle bg-surface-elevated shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-subtle gap-3">
          <Search className="w-5 h-5 text-accent-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools, Academy topics, glossary, FAQ..."
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-secondary focus:outline-none font-sans"
            aria-label="Search site"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-xs text-text-secondary hover:text-text-primary font-mono cursor-pointer">
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded text-text-secondary hover:text-text-primary cursor-pointer" aria-label="Close search">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-secondary font-mono">
              No matching topics or tools found.
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  idx === selectedIndex
                    ? 'bg-surface border border-accent-primary/60 text-text-primary shadow-xs'
                    : 'hover:bg-surface/60 border border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${idx === selectedIndex ? 'bg-accent-primary/15' : 'bg-surface'}`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span className={idx === selectedIndex ? 'text-accent-primary' : 'text-text-primary'}>{item.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-wider ${
                        idx === selectedIndex ? 'bg-accent-primary/20 text-accent-primary' : 'bg-surface border border-border-subtle text-text-secondary'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <div className={`text-xs ${idx === selectedIndex ? 'text-text-primary/90' : 'text-text-secondary'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${idx === selectedIndex ? 'text-accent-primary' : 'opacity-40'}`} />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-surface border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-secondary">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-accent-primary">Ctrl+K to toggle</span>
        </div>
      </div>
    </div>
  );
};
