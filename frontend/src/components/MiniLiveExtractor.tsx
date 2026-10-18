import React, { useState, useEffect } from 'react';
import { createInvestigation } from '../services/api';
import type { Investigation, EvidenceItem } from '../types';
import { Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      return <span>{inputText}</span>;
    }

    // Sort evidence by start_idx
    const sortedSpans = [...result.evidence]
      .filter((e) => e.start_idx !== undefined && e.end_idx !== undefined)
      .sort((a, b) => (a.start_idx || 0) - (b.start_idx || 0));

    if (sortedSpans.length === 0) {
      return <span>{inputText}</span>;
    }

    const elements: React.ReactNode[] = [];
    let currentIdx = 0;

    sortedSpans.forEach((ev: EvidenceItem, idx: number) => {
      const start = ev.start_idx || 0;
      const end = ev.end_idx || 0;

      if (start > currentIdx) {
        elements.push(
          <span key={`text-${currentIdx}`}>
            {inputText.slice(currentIdx, start)}
          </span>
        );
      }

      const isHigh = ev.severity === 'high';
      elements.push(
        <mark
          key={`mark-${idx}`}
          className={`px-1 py-0.5 rounded font-bold cursor-help transition-all ${
            isHigh
              ? 'bg-[#A82020]/25 text-[#A82020] dark:bg-[#A82020]/40 dark:text-[#FBE6C2] border-b-2 border-[#A82020]'
              : 'bg-[#B45309]/20 text-[#B45309] dark:bg-[#D97706]/30 dark:text-[#FBE6C2] border-b-2 border-[#B45309]'
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
        <span key={`text-end`}>{inputText.slice(currentIdx)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="p-6 rounded-3xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#A82020]" />
          <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
            Interactive Forensic Mini-Demo (Real Engine)
          </h4>
        </div>

        {/* Preset quick test chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-[#7E3E3E] dark:text-[#C9B29B]">Presets:</span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p.text);
                runExtraction(p.text);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                inputText === p.text
                  ? 'bg-[#A82020] text-white border-[#A82020]'
                  : 'border-[#6C1A1A]/20 dark:border-[#A82020]/30 hover:bg-[#FBE6C2] dark:hover:bg-[#3A1313]'
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
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          rows={3}
          className="w-full p-3.5 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-[#2A0E0E] dark:text-[#F3E6D5] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#A82020]"
          placeholder="Paste suspicious text to test live extraction..."
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => runExtraction(inputText)}
            disabled={loading}
            className="px-4 py-1.5 rounded-xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Dissecting...' : 'Run Forensic Dissection'}
          </button>
        </div>
      </div>

      {/* Live Dissection Highlights */}
      <div className="p-4 rounded-2xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/20 dark:border-[#A82020]/20 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="font-bold uppercase tracking-wider text-[#7E3E3E] dark:text-[#C9B29B]">
            Evidence Highlight View:
          </span>
          {result && (
            <div className="flex items-center gap-2">
              <span className="font-bold">Risk Index:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                result.risk_level === 'High concern'
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                {result.risk_score.toFixed(1)}/100 ({result.risk_level})
              </span>
            </div>
          )}
        </div>

        {error ? (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 p-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="text-xs font-mono leading-relaxed p-2 rounded-lg bg-black/5 dark:bg-white/5">
            {renderHighlightedText()}
          </div>
        )}

        {result && result.evidence.length > 0 && (
          <div className="pt-2 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20 flex flex-wrap gap-2 text-[10px] font-mono">
            {result.evidence.map((ev, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-[#6C1A1A]/10 dark:bg-[#A82020]/20 text-[#6C1A1A] dark:text-[#FBE6C2]"
              >
                ● {ev.type}: "{ev.matched_text}"
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Deep Link to Full Workspace */}
      <div className="text-right">
        <Link
          to={`/investigate?text=${encodeURIComponent(inputText)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82020] dark:text-[#FBE6C2] hover:underline cursor-pointer"
        >
          <span>Open in Full 3-Column Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
