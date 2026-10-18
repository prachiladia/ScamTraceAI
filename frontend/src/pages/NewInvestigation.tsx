import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldAlert, CheckCircle2, Copy, Printer, Sparkles, Send, Loader2,
  AlertTriangle, Globe, Check, ArrowRight
} from 'lucide-react';
import { createInvestigation, fetchInvestigationById } from '../services/api';
import type { Investigation } from '../types';
import { useToast } from '../components/common/Toast';

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
  "Sanitizing input & verifying boundaries...",
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

  const { showToast } = useToast();

  // Load by ID if provided in query string
  useEffect(() => {
    const id = searchParams.get('id');
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
    }
  }, [searchParams]);

  const handleRunInvestigation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setStageIndex(0);

    // Progress stepper animation
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 350);

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
      setError(err.message || 'Investigation failed. Check that backend API is running.');
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

  // Helper to render text with highlighted evidence spans
  const renderHighlightedText = () => {
    if (!investigation || !investigation.evidence.length) {
      return <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{investigation?.input_text || inputText}</p>;
    }

    const text = investigation.input_text;
    const spansWithIndices = investigation.evidence
      .filter((ev) => ev.start_idx !== null && ev.end_idx !== null && ev.start_idx !== undefined && ev.end_idx !== undefined)
      .sort((a, b) => (a.start_idx! - b.start_idx!));

    if (!spansWithIndices.length) {
      return <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{text}</p>;
    }

    const elements: React.ReactNode[] = [];
    let lastIdx = 0;

    spansWithIndices.forEach((ev, i) => {
      const start = ev.start_idx!;
      const end = ev.end_idx!;

      // Handle non-overlapping slices
      if (start >= lastIdx && start < text.length) {
        if (start > lastIdx) {
          elements.push(text.slice(lastIdx, start));
        }
        const slice = text.slice(start, Math.min(end, text.length));
        const isProtective = ev.type === 'protective_disclaimer';
        elements.push(
          <mark
            key={i}
            className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors ${
              isProtective
                ? 'bg-teal-500/20 text-teal-800 dark:text-teal-200 border border-teal-500/40'
                : 'bg-red-500/20 text-red-900 dark:text-red-200 border border-red-500/40'
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
      elements.push(text.slice(lastIdx));
    }

    return <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{elements}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-tight">
              Evidence Analyzer Workspace
            </h1>
            {investigation?.is_demo && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-700 text-white uppercase tracking-wider">
                DEMO DATA
              </span>
            )}
          </div>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Deconstruct deceptive lures, extract psychological manipulation spans, analyze offline URLs, and inspect verified indicators.
          </p>
        </div>

        {investigation && (
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main 3-Column Layout (ref3 incident command workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & Test Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <form onSubmit={handleRunInvestigation} className="rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                1. Provide Suspicious Lure
              </h2>
              <span className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B]">
                Untrusted Input Protected
              </span>
            </div>

            {/* Quick Test Presets */}
            <div>
              <label className="block text-[11px] font-bold text-[#7E3E3E] dark:text-[#C9B29B] uppercase mb-1">
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
                className="w-full px-3 py-2 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none"
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
                <label className="text-[11px] font-bold text-[#7E3E3E] dark:text-[#C9B29B] uppercase">
                  Raw Message Body (SMS / WhatsApp / Email):
                </label>
                <span className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B]">
                  {inputText.length} / 15,000
                </span>
              </div>
              <textarea
                required
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the suspicious SMS, WhatsApp notice, account alert, or job offer here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none focus:ring-1 focus:ring-[#A82020] resize-y"
              />
            </div>

            {/* Optional URL */}
            <div>
              <label className="block text-[11px] font-bold text-[#7E3E3E] dark:text-[#C9B29B] uppercase mb-1">
                Embedded Link / Domain (Optional):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="http://suspect-portal.top/login"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none focus:ring-1 focus:ring-[#A82020]"
                />
                <Globe className="w-3.5 h-3.5 text-[#7E3E3E] dark:text-[#C9B29B] absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] mt-1">
                🛡️ <strong>Zero-Fetch Guarantee:</strong> The link is never fetched, resolved, or requested. Evaluated solely via local lexical math.
              </p>
            </div>

            {/* Gemma AI Report Option */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20">
              <input
                type="checkbox"
                id="gemma-opt"
                checked={includeAiReport}
                onChange={(e) => setIncludeAiReport(e.target.checked)}
                className="rounded accent-[#A82020] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="gemma-opt" className="text-xs text-[#2A0E0E] dark:text-[#F3E6D5] cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C27803]" />
                <span>Request Local Gemma 4 Analytical Report</span>
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setInputText(''); setUrlInput(''); setInvestigation(null); }}
                className="text-xs text-[#7E3E3E] dark:text-[#C9B29B] hover:underline"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-bold text-xs shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Expose Evidence</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Progress Stage Indicator during loading (Rule H.6) */}
          {isLoading && (
            <div className="p-5 rounded-2xl border border-[#A82020]/40 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-[#A82020] dark:text-[#FBE6C2]">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#A82020]" />
                  <span>Processing Forensic Stage {stageIndex + 1} of {ANALYSIS_STAGES.length}</span>
                </span>
                <span>{Math.round(((stageIndex + 1) / ANALYSIS_STAGES.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#E2CEB9] dark:bg-[#3A1313] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#A82020] h-full transition-all duration-300"
                  style={{ width: `${((stageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-[#5C2222] dark:text-[#C9B29B]">
                {ANALYSIS_STAGES[stageIndex]}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-red-400 bg-red-100/70 dark:bg-red-950/40 text-xs text-red-900 dark:text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Columns: Structured Findings & Incident Playbook (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!investigation ? (
            <div className="rounded-2xl border border-dashed border-[#6C1A1A]/30 dark:border-[#A82020]/40 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#A82020]/10 flex items-center justify-center text-[#A82020]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2A0E0E] dark:text-[#F3E6D5]">
                Awaiting Evidence Input
              </h3>
              <p className="text-xs text-[#7E3E3E] dark:text-[#C9B29B] max-w-sm">
                Paste a suspicious message or choose one of the preset example lures on the left to trigger the analysis engine.
              </p>
            </div>
          ) : (
            <div className="investigation-report-container space-y-6">
              {/* Threat Tier & Risk Gauge */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#7E3E3E] dark:text-[#C9B29B]">
                      Forensic Threat Assessment
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xl font-black uppercase px-3 py-1 rounded-xl shadow-sm ${
                        investigation.risk_level === 'High concern'
                          ? 'bg-red-500 text-white'
                          : investigation.risk_level === 'Suspicious'
                          ? 'bg-amber-500 text-white'
                          : 'bg-teal-600 text-white'
                      }`}>
                        {investigation.risk_level}
                      </span>
                      <div className="text-xs font-mono font-bold">
                        Risk Index: <span className="text-base font-black text-[#A82020] dark:text-[#E04848]">{investigation.risk_score.toFixed(1)}</span>/100
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/graph?investigation_id=${investigation.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 text-xs font-bold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] no-print"
                  >
                    <span>View in Entity Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs text-[#2A0E0E] dark:text-[#F3E6D5] leading-relaxed pt-2 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20">
                  {investigation.risk_rationale}
                </p>
              </div>

              {/* Message Span Inspector with Highlights */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/20 dark:bg-[#2A0D0D]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                    Deconstructive Span Analysis
                  </h3>
                  <span className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B]">
                    Color-Coded Forensic Highlights
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  {renderHighlightedText()}
                </div>
              </div>

              {/* Model Decision Breakdown & Lexical URL Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Message Classifier */}
                <div className="p-4 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-2 text-xs">
                  <div className="font-bold uppercase text-[11px] text-[#6C1A1A] dark:text-[#FBE6C2]">
                    Message Classifier (TF-IDF LR)
                  </div>
                  {investigation.message_prediction ? (
                    <div className="space-y-1">
                      <div>
                        Class: <strong className="font-mono">{investigation.message_prediction.predicted_class}</strong>
                      </div>
                      <div>
                        Calibrated Probability: <strong className="font-mono">{(investigation.message_prediction.score * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B]">
                        Active features: {investigation.message_prediction.features_used.join(', ') || 'N/A'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#7E3E3E]">Model prediction unavailable.</span>
                  )}
                </div>

                {/* URL Classifier */}
                <div className="p-4 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-2 text-xs">
                  <div className="font-bold uppercase text-[11px] text-[#6C1A1A] dark:text-[#FBE6C2]">
                    Lexical URL Classifier (Offline RF)
                  </div>
                  {investigation.url_prediction ? (
                    <div className="space-y-1">
                      <div>
                        Class: <strong className="font-mono">{investigation.url_prediction.predicted_class}</strong>
                      </div>
                      <div>
                        Decision Score: <strong className="font-mono">{(investigation.url_prediction.score * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B]">
                        Features: {investigation.url_prediction.features_used.join(', ') || 'N/A'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#7E3E3E]">No external URL was provided for analysis.</span>
                  )}
                </div>
              </div>

              {/* Extracted Forensic Evidence Items */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/20 dark:bg-[#2A0D0D]/30 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                  Extracted Indicators & Patterns ({investigation.evidence.length})
                </h3>
                <div className="space-y-2.5">
                  {investigation.evidence.map((ev) => (
                    <div key={ev.id} className="p-3.5 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#A82020] dark:text-[#E04848] uppercase">
                          {ev.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#E2CEB9] dark:bg-[#3A1313] font-bold">
                          Severity: {ev.severity}
                        </span>
                      </div>
                      <div className="font-semibold text-[#2A0E0E] dark:text-white">
                        Matched: "{ev.matched_text}"
                      </div>
                      <p className="text-[#5C2222] dark:text-[#C9B29B] text-[11px]">
                        {ev.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable User Safety Playbook (ref3 inspired) */}
              <div className="p-6 rounded-2xl border border-[#1E6E60]/40 bg-teal-500/10 dark:bg-teal-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm uppercase">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <span>Personalized Safety Playbook</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">
                    Non-Retaliatory Defense
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-teal-600/20 space-y-1">
                    <div className="font-bold text-teal-700 dark:text-teal-300">1. DO NOT ENGAGE</div>
                    <p className="text-[11px] text-[#5C2222] dark:text-[#C9B29B]">
                      Do not click links, dial back provided numbers, or reply to confirm phone validity.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-teal-600/20 space-y-1">
                    <div className="font-bold text-teal-700 dark:text-teal-300">2. INDEPENDENT AUDIT</div>
                    <p className="text-[11px] text-[#5C2222] dark:text-[#C9B29B]">
                      Verify directly via official bank passbook, official banking app, or customer care phone number printed on your card.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-teal-600/20 space-y-1">
                    <div className="font-bold text-teal-700 dark:text-teal-300">3. OFFICIAL REPORTING</div>
                    <p className="text-[11px] text-[#5C2222] dark:text-[#C9B29B]">
                      Report cyber threats in India by dialing <strong>1930</strong> or visiting <strong>cybercrime.gov.in</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Local Gemma 4 Analytical Report */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C27803]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                    Local Gemma 4 Analytical Report
                  </h3>
                </div>

                {investigation.gemma_report ? (
                  <div className="space-y-4 text-xs text-[#2A0E0E] dark:text-[#F3E6D5]">
                    <div className="p-3.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 italic font-medium leading-relaxed">
                      "{investigation.gemma_report.executive_summary}"
                    </div>

                    <div className="space-y-2">
                      <strong className="block text-[11px] uppercase tracking-wider text-[#7E3E3E] dark:text-[#C9B29B]">
                        Main Findings:
                      </strong>
                      <ul className="list-disc list-inside space-y-1">
                        {investigation.gemma_report.main_findings.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <strong className="block text-[11px] uppercase tracking-wider text-[#7E3E3E] dark:text-[#C9B29B]">
                        Supporting Evidence:
                      </strong>
                      <ul className="list-disc list-inside space-y-1">
                        {investigation.gemma_report.supporting_evidence.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] pt-2 border-t border-[#6C1A1A]/10">
                      {investigation.gemma_report.disclaimer}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#E2CEB9]/50 dark:bg-[#3A1313]/50 text-xs text-[#7E3E3E] dark:text-[#C9B29B] space-y-1">
                    <div className="font-bold text-[#2A0E0E] dark:text-[#F3E6D5]">
                      AI report unavailable (Ollama service not running locally)
                    </div>
                    <p className="text-[11px]">
                      Deterministic machine learning models, character span extractors, and risk index calculations remain fully operational above. To enable local Gemma reports, start Ollama with <code>ollama run gemma4:e2b</code>.
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
