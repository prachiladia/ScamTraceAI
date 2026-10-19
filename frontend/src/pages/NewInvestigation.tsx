import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldAlert, CheckCircle2, Copy, Printer, Sparkles, Send, Loader2,
  AlertTriangle, Globe, Check, ArrowRight, ShieldCheck, Terminal
} from 'lucide-react';
import { createInvestigation, fetchInvestigationById } from '../services/api';
import type { Investigation } from '../types';
import { useToast } from '../components/common/Toast';
import { SeverityChip } from '../components/ui/SeverityChip';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const EXAMPLE_MESSAGES = [
  {
    label: 'State Bank KYC Suspension (High Risk Phishing)',
    text: 'URGENT: Your State Bank account 4921 has been suspended due to pending KYC verification. Update immediately at http://sbi-kyc-verify-portal.top/login or your funds will be frozen within 2 hours.',
    url: 'http://sbi-kyc-verify-portal.top/login',
  },
  {
    label: 'India Post Delivery Fee (Customs/Redelivery Smish)',
    text: 'IndiaPost: Your package IN948291 cannot be delivered due to an incorrect address. Please confirm your delivery address and pay the 25 INR fee at http://indiapost-redelivery-notice.xyz/track',
    url: 'http://indiapost-redelivery-notice.xyz/track',
  },
  {
    label: 'Legitimate Bank OTP Notice (Authentic Neutral Ham)',
    text: '748291 is your OTP for transaction of INR 1,500 at Amazon India. Never share your OTP with anyone, including bank staff. State Bank of India.',
    url: '',
  },
  {
    label: 'Job / Task Scam (Telegram / YouTube Reviews)',
    text: 'Congratulations! You have been selected for online part-time job. Earn Rs. 3000 to 5000 daily by liking YouTube videos. Contact our HR manager immediately on WhatsApp +91 98765 43210 to claim reward.',
    url: '',
  }
];

const ANALYSIS_STAGES = [
  "Sanitizing input & verifying structural boundaries...",
  "Running calibrated TF-IDF message classifier...",
  "Computing offline lexical URL entropy & structure...",
  "Extracting forensic deception spans & authority cues...",
  "Computing multi-factor risk index & saturation curve...",
  "Generating actionable user safety playbook..."
];

export const NewInvestigation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [inputText, setInputText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [includeAiReport, setIncludeAiReport] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hoveredEvidenceId, setHoveredEvidenceId] = useState<string | null>(null);

  const { showToast } = useToast();

  // Load by ID or pre-fill from query string
  useEffect(() => {
    const id = searchParams.get('id');
    const textParam = searchParams.get('text');

    if (id) {
      const loadById = async () => {
        setIsLoading(true);
        try {
          const inv = await fetchInvestigationById(id);
          setInvestigation(inv);
          setInputText(inv.input_text);
          setUrlInput(inv.url || '');
        } catch (err: any) {
          setError(err.message || 'Failed to load investigation record.');
        } finally {
          setIsLoading(false);
        }
      };
      loadById();
    } else if (textParam) {
      setInputText(textParam);
    }
  }, [searchParams]);

  const handleRunInvestigation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setStageIndex(0);

    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 320);

    try {
      const result = await createInvestigation({
        text: inputText,
        url: urlInput.trim() || undefined,
        generate_ai_report: includeAiReport,
      });
      clearInterval(interval);
      setInvestigation(result);
      showToast('Forensic analysis completed', 'success');
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Investigation failed. Check backend connection.');
      showToast('Analysis error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!investigation) return;
    navigator.clipboard.writeText(investigation.share_summary);
    setCopied(true);
    showToast('Share-safe summary copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render text with bidirectional highlighted evidence spans
  const renderHighlightedText = () => {
    if (!investigation || !investigation.evidence.length) {
      return (
        <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
          {investigation?.input_text || inputText}
        </p>
      );
    }

    const text = investigation.input_text;
    const spansWithIndices = investigation.evidence
      .filter((ev) => ev.start_idx !== null && ev.end_idx !== null && ev.start_idx !== undefined && ev.end_idx !== undefined)
      .sort((a, b) => (a.start_idx! - b.start_idx!));

    if (!spansWithIndices.length) {
      return (
        <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
          {text}
        </p>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastIdx = 0;

    spansWithIndices.forEach((ev, i) => {
      const start = ev.start_idx!;
      const end = ev.end_idx!;

      if (start >= lastIdx && start < text.length) {
        if (start > lastIdx) {
          elements.push(
            <span key={`plain-${lastIdx}`} className="text-[var(--text-primary)]">
              {text.slice(lastIdx, start)}
            </span>
          );
        }
        const slice = text.slice(start, Math.min(end, text.length));
        const isProtective = ev.type === 'protective_disclaimer';
        const isHovered = hoveredEvidenceId === ev.id;

        elements.push(
          <mark
            key={`mark-${ev.id || i}`}
            onMouseEnter={() => setHoveredEvidenceId(ev.id)}
            onMouseLeave={() => setHoveredEvidenceId(null)}
            className={`px-1.5 py-0.5 rounded font-mono text-xs font-bold cursor-pointer transition-all duration-150 ${
              isHovered
                ? 'ring-2 ring-[var(--accent-primary)] shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10'
                : ''
            } ${
              isProtective
                ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-b-2 border-[#2DD4BF]'
                : ev.severity === 'high'
                ? 'bg-[#F87171]/25 text-[#F87171] border-b-2 border-[#F87171]'
                : 'bg-[#FBBF24]/25 text-[#FBBF24] border-b-2 border-[#FBBF24]'
            }`}
            title={`${ev.type}: ${ev.explanation}`}
          >
            {slice}
          </mark>
        );
        lastIdx = Math.max(lastIdx, end);
      }
    });

    if (lastIdx < text.length) {
      elements.push(
        <span key="plain-end" className="text-[var(--text-primary)]">
          {text.slice(lastIdx)}
        </span>
      );
    }

    return <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{elements}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--accent-primary)]">
              FORENSIC INVESTIGATION WORKSPACE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Evidence Analyzer
            </h1>
            {investigation?.is_demo && (
              <Badge variant="warning" size="sm">
                DEMO DATA
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
            Deconstruct deceptive lures, extract psychological pressure spans, inspect offline lexical indicators, and generate mitigation playbooks.
          </p>
        </div>

        {investigation && (
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--surface-elevated)] transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main 3-Column Incident Command Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <form
            onSubmit={handleRunInvestigation}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                1. Suspicious Input Data
              </h2>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                Zero Network Leaks
              </span>
            </div>

            {/* Quick Test Presets */}
            <div>
              <label className="block text-[11px] font-mono font-semibold text-[var(--text-secondary)] uppercase mb-1">
                Load Preset Test Fixture:
              </label>
              <select
                onChange={(e) => {
                  const idx = parseInt(e.target.value);
                  if (!isNaN(idx) && EXAMPLE_MESSAGES[idx]) {
                    setInputText(EXAMPLE_MESSAGES[idx].text);
                    setUrlInput(EXAMPLE_MESSAGES[idx].url);
                    setInvestigation(null);
                  }
                }}
                defaultValue=""
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-secondary)] text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
              >
                <option value="" disabled>Select a realistic test lure...</option>
                {EXAMPLE_MESSAGES.map((ex, i) => (
                  <option key={i} value={i}>{ex.label}</option>
                ))}
              </select>
            </div>

            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono font-semibold text-[var(--text-secondary)] uppercase">
                  Raw Message Body:
                </label>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {inputText.length} / 15,000
                </span>
              </div>
              <textarea
                required
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the suspicious SMS, WhatsApp notice, account alert, or job offer here..."
                className="w-full p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-secondary)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-y"
              />
            </div>

            {/* Optional URL */}
            <div>
              <label className="block text-[11px] font-mono font-semibold text-[var(--text-secondary)] uppercase mb-1">
                Embedded Link / Domain (Optional):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="http://suspect-portal.top/login"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-secondary)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
                <Globe className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Zero-Fetch Guarantee: URL analyzed purely via local lexical math.</span>
              </p>
            </div>

            {/* Gemma AI Report Option */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <input
                type="checkbox"
                id="gemma-opt"
                checked={includeAiReport}
                onChange={(e) => setIncludeAiReport(e.target.checked)}
                className="rounded accent-[var(--accent-primary)] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="gemma-opt" className="text-xs text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Request Local Gemma 4 Analytical Report</span>
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setInputText(''); setUrlInput(''); setInvestigation(null); }}
                className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline cursor-pointer"
              >
                Clear Form
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading || !inputText.trim()}
                loading={isLoading}
                icon={<Send className="w-4 h-4" />}
              >
                Expose Evidence
              </Button>
            </div>
          </form>

          {/* Progress Stage Indicator during loading */}
          {isLoading && (
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--accent-primary)]">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
                  <span>Processing Stage {stageIndex + 1} of {ANALYSIS_STAGES.length}</span>
                </span>
                <span>{Math.round(((stageIndex + 1) / ANALYSIS_STAGES.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[var(--background)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)] h-full transition-all duration-300"
                  style={{ width: `${((stageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                {ANALYSIS_STAGES[stageIndex]}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-xs text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Columns: Structured Findings & Incident Playbook (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!investigation ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-12 text-center flex flex-col items-center justify-center space-y-3 bg-[var(--surface)]/30">
              <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Awaiting Evidence Input
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm font-sans">
                Paste a suspicious message or choose one of the preset example lures on the left to trigger the forensic engine.
              </p>
            </div>
          ) : (
            <div className="investigation-report-container space-y-6">
              {/* Threat Tier & Risk Gauge */}
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                      Forensic Threat Assessment
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <SeverityChip
                        level={investigation.risk_level}
                        score={investigation.risk_score}
                        size="lg"
                      />
                    </div>
                  </div>

                  <Link
                    to={`/graph?investigation_id=${investigation.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs font-mono font-bold text-[var(--accent-primary)] hover:bg-[var(--surface)] transition-all no-print"
                  >
                    <span>View in Entity Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-3 border-t border-[var(--border-subtle)] font-sans">
                  {investigation.risk_rationale}
                </p>
              </div>

              {/* Message Span Inspector with Highlights */}
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    Deconstructive Span Analysis
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Hover chips below or text to inspect connections
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  {renderHighlightedText()}
                </div>
              </div>

              {/* Model Decision Breakdown & Lexical URL Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Message Classifier */}
                <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
                    <span className="font-bold uppercase text-[11px] text-[var(--accent-primary)]">
                      Message Classifier (TF-IDF LR)
                    </span>
                    <Terminal className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </div>
                  {investigation.message_prediction ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Class:</span>
                        <strong className="text-[var(--text-primary)] uppercase">{investigation.message_prediction.predicted_class}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Calibrated Probability:</span>
                        <strong className="text-[var(--accent-primary)]">{(investigation.message_prediction.score * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] pt-1 border-t border-[var(--border-subtle)]">
                        Active features: {investigation.message_prediction.features_used.join(', ') || 'N/A'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[var(--text-secondary)]">Model prediction unavailable.</span>
                  )}
                </div>

                {/* URL Classifier */}
                <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
                    <span className="font-bold uppercase text-[11px] text-[var(--accent-secondary)]">
                      Lexical URL Classifier (Offline RF)
                    </span>
                    <Globe className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </div>
                  {investigation.url_prediction ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Class:</span>
                        <strong className="text-[var(--text-primary)] uppercase">{investigation.url_prediction.predicted_class}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Decision Score:</span>
                        <strong className="text-[var(--accent-secondary)]">{(investigation.url_prediction.score * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] pt-1 border-t border-[var(--border-subtle)]">
                        Features: {investigation.url_prediction.features_used.join(', ') || 'N/A'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[var(--text-secondary)]">No external URL was provided for analysis.</span>
                  )}
                </div>
              </div>

              {/* Extracted Forensic Evidence Items (With Bidirectional Hover) */}
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    Extracted Indicators & Patterns ({investigation.evidence.length})
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Interactive Evidence Cards
                  </span>
                </div>
                <div className="space-y-2.5">
                  {investigation.evidence.map((ev) => {
                    const isHovered = hoveredEvidenceId === ev.id;
                    return (
                      <div
                        key={ev.id}
                        onMouseEnter={() => setHoveredEvidenceId(ev.id)}
                        onMouseLeave={() => setHoveredEvidenceId(null)}
                        className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all duration-150 cursor-pointer ${
                          isHovered
                            ? 'bg-[var(--surface-elevated)] border-[var(--accent-primary)] shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            : 'bg-[var(--background-secondary)] border-[var(--border-subtle)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[var(--accent-primary)] uppercase">
                            {ev.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-semibold">
                            Severity: {ev.severity}
                          </span>
                        </div>
                        <div className="font-semibold text-[var(--text-primary)] font-mono">
                          Matched: "{ev.matched_text}"
                        </div>
                        <p className="text-[var(--text-secondary)] text-[11px] font-sans">
                          {ev.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actionable User Safety Playbook */}
              <div className="p-6 rounded-2xl border border-teal-500/30 bg-teal-950/20 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-400 font-display font-bold text-sm uppercase">
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    <span>Personalized Safety Playbook</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-teal-400">
                    Non-Retaliatory Defense
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
                  <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-teal-500/20 space-y-1">
                    <div className="font-bold text-teal-400 font-mono text-[11px]">1. DO NOT ENGAGE</div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      Do not click links, dial back provided numbers, or reply to confirm phone validity.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-teal-500/20 space-y-1">
                    <div className="font-bold text-teal-400 font-mono text-[11px]">2. INDEPENDENT AUDIT</div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      Verify directly via official bank passbook, official banking app, or customer care phone number printed on your card.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-teal-500/20 space-y-1">
                    <div className="font-bold text-teal-400 font-mono text-[11px]">3. OFFICIAL REPORTING</div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      Report cyber threats in India by dialing <strong className="text-[var(--text-primary)]">1930</strong> or visiting <strong className="text-[var(--text-primary)]">cybercrime.gov.in</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Local Gemma 4 Analytical Report */}
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                      Explanatory AI Report (Local Gemma 4)
                    </h3>
                  </div>
                  {investigation.gemma_report && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] font-mono">
                      {investigation.gemma_report.model_identifier}
                    </span>
                  )}
                </div>

                {investigation.gemma_report ? (
                  <div className="space-y-4 text-xs text-[var(--text-primary)] font-sans">
                    <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] italic font-medium leading-relaxed text-[var(--text-primary)]">
                      "{investigation.gemma_report.summary || investigation.gemma_report.executive_summary}"
                    </div>

                    {investigation.gemma_report.threat_narrative && (
                      <div className="space-y-1">
                        <strong className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                          Threat Narrative:
                        </strong>
                        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                          {investigation.gemma_report.threat_narrative}
                        </p>
                      </div>
                    )}

                    {investigation.gemma_report.psychological_mechanisms && investigation.gemma_report.psychological_mechanisms.length > 0 && (
                      <div className="space-y-1.5">
                        <strong className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                          Psychological Mechanisms:
                        </strong>
                        <div className="flex flex-wrap gap-1.5">
                          {investigation.gemma_report.psychological_mechanisms.map((mech, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-secondary)] text-[11px] font-mono">
                              {mech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {investigation.gemma_report.likely_next_steps && investigation.gemma_report.likely_next_steps.length > 0 && (
                      <div className="space-y-1">
                        <strong className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                          Likely Next Steps:
                        </strong>
                        <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                          {investigation.gemma_report.likely_next_steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {investigation.gemma_report.educational_analogy && (
                      <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-xs">
                        <strong className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Educational Analogy:
                        </strong>
                        <p className="italic text-[var(--text-secondary)]">
                          {investigation.gemma_report.educational_analogy}
                        </p>
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                      {investigation.gemma_report.disclaimer}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1.5 font-mono">
                    <div className="font-bold text-[var(--accent-primary)]">
                      AI synthesis unavailable. Deterministic and model evidence above are fully functional.
                    </div>
                    <p className="text-[11px] leading-relaxed font-sans">
                      ScamTrace AI prioritizes factual, deterministic extraction over generative hallucinations. Local Gemma 4 reports require an active local Ollama daemon (e.g. <code>ollama run gemma4:e2b</code>). All trained classifiers, extracted spans, and safety rules remain 100% active.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
