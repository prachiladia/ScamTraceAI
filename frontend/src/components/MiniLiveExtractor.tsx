import React, { useState, useEffect } from 'react';
import { createInvestigation } from '../services/api';
import type { Investigation, EvidenceItem } from '../types';
import { Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeverityChip } from './ui/SeverityChip';
import { Button } from './ui/Button';

const SAMPLE_PROMPTS = [
  {
    label: 'Bank KYC Threat',
    text: 'URGENT: Your SBI account will be suspended in 2 hours due to unverified KYC. Visit http://sbi-kyc-verify.top/login immediately to update Aadhaar or face police action.',
  },
  {
    label: 'Unpaid Parcel Delivery',
    text: 'IndiaPost: Your courier #IN98412 cannot be delivered due to an invalid address and unpaid ₹48 customs duty. Update details at http://post-customs-clearance.xyz within 24h.',
  },
  {
    label: 'Telegram Task Scam',
    text: 'Congratulation! You are selected for YouTube remote job. Like 3 videos and earn ₹2,500 daily. Join VIP Telegram group @daily_cash_earn to receive bonus immediately.',
  },
];

export const MiniLiveExtractor: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_PROMPTS[0].text);
  const [result, setResult] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runExtraction = async (textToRun: string) => {
    if (!textToRun.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await createInvestigation({
        text: textToRun,
        generate_ai_report: false,
      });
      setResult(data);
    } catch (err: any) {
      console.warn('Backend live extraction error:', err);
      setError('Live backend extraction unavailable. Deterministic engine offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runExtraction(inputText);
  }, []);

  // Highlight matches in input text
  const renderHighlightedText = () => {
    if (!result || !result.evidence || result.evidence.length === 0) {
      return <span className="text-[var(--text-primary)]">{inputText}</span>;
    }

    // Sort evidence by start_idx
    const sortedSpans = [...result.evidence]
      .filter((e) => e.start_idx !== undefined && e.end_idx !== undefined)
      .sort((a, b) => (a.start_idx || 0) - (b.start_idx || 0));

    if (sortedSpans.length === 0) {
      return <span className="text-[var(--text-primary)]">{inputText}</span>;
    }

    const elements: React.ReactNode[] = [];
    let currentIdx = 0;

    sortedSpans.forEach((ev: EvidenceItem, idx: number) => {
      const start = ev.start_idx || 0;
      const end = ev.end_idx || 0;

      if (start > currentIdx) {
        elements.push(
          <span key={`text-${currentIdx}`} className="text-[var(--text-primary)]">
            {inputText.slice(currentIdx, start)}
          </span>
        );
      }

      const isHigh = ev.severity === 'high';
      elements.push(
        <mark
          key={`mark-${idx}`}
          className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-help transition-all ${
            isHigh
              ? 'bg-[#F87171]/20 text-[#F87171] border-b-2 border-[#F87171]'
              : 'bg-[#FBBF24]/20 text-[#FBBF24] border-b-2 border-[#FBBF24]'
          }`}
          title={`${ev.type}: ${ev.explanation}`}
        >
          {inputText.slice(start, end)}
        </mark>
      );

      currentIdx = Math.max(currentIdx, end);
    });

    if (currentIdx < inputText.length) {
      elements.push(
        <span key="text-end" className="text-[var(--text-primary)]">
          {inputText.slice(currentIdx)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
          <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
            Live Forensic Dissector (Verified Backend Engine)
          </h4>
        </div>

        {/* Preset quick test chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Presets:</span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p.text);
                runExtraction(p.text);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                inputText === p.text
                  ? 'bg-[var(--accent-primary)] text-[#080D18] border-[var(--accent-primary)] font-bold shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input textarea */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
          className="w-full p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-secondary)] text-[var(--text-primary)] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          placeholder="Paste suspicious text to test live extraction..."
        />
        <div className="flex justify-end mt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => runExtraction(inputText)}
            loading={loading}
          >
            {loading ? 'Dissecting...' : 'Run Forensic Dissection'}
          </Button>
        </div>
      </div>

      {/* Live Dissection Highlights */}
      <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Evidence Span Isolation:
          </span>
          {result && (
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)]">Risk Index:</span>
              <SeverityChip
                level={result.risk_level}
                score={result.risk_score}
                size="sm"
              />
            </div>
          )}
        </div>

        {error ? (
          <div className="flex items-center gap-2 text-xs text-[#FBBF24] p-2 bg-[#FBBF24]/10 rounded-lg border border-[#FBBF24]/20">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="text-xs font-mono leading-relaxed p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]/50">
            {renderHighlightedText()}
          </div>
        )}

        {result && result.evidence.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap gap-2 text-[10px] font-mono">
            {result.evidence.map((ev, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              >
                ● <strong className="text-[var(--text-primary)]">{ev.type}</strong>: "{ev.matched_text}"
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Deep Link to Full Workspace */}
      <div className="text-right">
        <Link
          to={`/investigate?text=${encodeURIComponent(inputText)}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
        >
          <span>Open in Full 3-Column Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
