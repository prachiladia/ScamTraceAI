import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Copy, Printer, Sparkles, Send, Loader2 } from 'lucide-react';
import { createInvestigation } from '../services/api';
import type { Investigation } from '../types';
import { useToast } from '../components/common/Toast';

const EXAMPLE_MESSAGES = [
  {
    label: 'State Bank KYC Suspension (High Risk)',
    text: 'URGENT: Your State Bank account 4921 has been suspended due to pending KYC verification. Update immediately at http://sbi-kyc-verify-portal.top/login or your funds will be frozen within 2 hours.',
    url: 'http://sbi-kyc-verify-portal.top/login',
  },
  {
    label: 'India Post Courier Redelivery (High Risk)',
    text: 'IndiaPost: Your package IN948291 cannot be delivered due to an incorrect address. Please confirm your delivery address and pay the 25 INR fee at http://indiapost-redelivery-notice.xyz/track',
    url: 'http://indiapost-redelivery-notice.xyz/track',
  },
  {
    label: 'Legitimate Bank OTP Notice (Neutral/Low Risk)',
    text: '748291 is your OTP for transaction of INR 1,500 at Amazon India. Never share your OTP with anyone, including bank staff. State Bank of India.',
    url: '',
  },
];

export const NewInvestigation: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [includeAiReport, setIncludeAiReport] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleRunInvestigation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await createInvestigation({
        text: inputText,
        url: urlInput.trim() || undefined,
        generate_ai_report: includeAiReport,
      });
      setInvestigation(result);
      showToast('Investigation completed successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'Investigation failed. Ensure the backend API is running.');
      showToast('Analysis failed. Check backend connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!investigation) return;
    navigator.clipboard.writeText(investigation.share_summary);
    showToast('Share-safe summary copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
            Evidence Analyzer & Investigation Workspace
          </h1>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Deconstruct suspicious messages, analyze deceptive URLs safely, and review extracted forensic indicators.
          </p>
        </div>
        {investigation && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main 3-Column Incident Command Layout (ref3 inspired) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Panel & Example Pickers (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleRunInvestigation} className="rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 p-5 space-y-4">
            <h2 className="font-bold text-sm text-[#2A0E0E] dark:text-[#F3E6D5] uppercase tracking-wider">
              Input Evidence
            </h2>

            {/* Example Presets */}
            <div>
              <label className="block text-[11px] font-bold text-[#7E3E3E] dark:text-[#C9B29B] uppercase mb-1">
                Load Example Lure:
              </label>
              <select
                onChange={(e) => {
                  const idx = parseInt(e.target.value);
                  if (!isNaN(idx) && EXAMPLE_MESSAGES[idx]) {
                    setInputText(EXAMPLE_MESSAGES[idx].text);
                    setUrlInput(EXAMPLE_MESSAGES[idx].url);
                  }
                }}
                defaultValue=""
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5]"
              >
                <option value="" disabled>Select a verified test fixture...</option>
                {EXAMPLE_MESSAGES.map((ex, i) => (
                  <option key={i} value={i}>{ex.label}</option>
                ))}
              </select>
            </div>

            {/* Raw Message Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-[#7E3E3E] dark:text-[#C9B29B] uppercase mb-1">
                Suspicious Message / Email / SMS Text:
              </label>
              <textarea
                required
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the raw text of the suspicious SMS, WhatsApp message, email body, or job offer..."
                className="w-full px-3 py-2 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none focus:ring-1 focus:ring-[#A82020] resize-y"
              />
            </div>

            {/* Optional URL */}
            <div>
              <label className="block text-[11px] font-bold text-[#7E3E3E] dark:text-[#C9B29B] uppercase mb-1">
                Associated Link / Domain (Optional):
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://suspect-domain.example/login"
                className="w-full px-3 py-2 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none focus:ring-1 focus:ring-[#A82020]"
              />
              <span className="block text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] mt-1">
                * Safe Lexical Inspection: The link is never fetched, resolved, or visited.
              </span>
            </div>

            {/* Gemma AI Report Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="ai-report-toggle"
                checked={includeAiReport}
                onChange={(e) => setIncludeAiReport(e.target.checked)}
                className="rounded accent-[#A82020] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="ai-report-toggle" className="text-xs text-[#2A0E0E] dark:text-[#F3E6D5] cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C27803]" />
                <span>Generate Local Gemma 4 Analytical Report (if Ollama online)</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setInputText(''); setUrlInput(''); }}
                className="text-xs text-[#7E3E3E] dark:text-[#C9B29B] hover:underline"
              >
                Clear Input
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-bold text-xs shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Evidence...</span>
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

          {error && (
            <div className="p-4 rounded-xl border border-red-300 dark:border-red-900 bg-red-100/60 dark:bg-red-950/40 text-xs text-red-900 dark:text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Center & Right Columns: Findings & Safety Playbook (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!investigation ? (
            <div className="rounded-2xl border border-dashed border-[#6C1A1A]/30 dark:border-[#A82020]/40 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <ShieldAlert className="w-12 h-12 text-[#A82020] opacity-50" />
              <h3 className="font-bold text-base text-[#2A0E0E] dark:text-[#F3E6D5]">
                Awaiting Evidence Input
              </h3>
              <p className="text-xs text-[#7E3E3E] dark:text-[#C9B29B] max-w-sm">
                Paste a suspicious message or choose one of the preset example lures on the left to trigger the analysis engine.
              </p>
            </div>
          ) : (
            <div className="investigation-report-container space-y-6">
              {/* Risk Level Gauge & Summary */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E3E3E] dark:text-[#C9B29B]">
                    Overall Threat Assessment
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xl font-black uppercase px-3 py-1 rounded-lg ${
                      investigation.risk_level === 'High concern'
                        ? 'bg-red-500 text-white'
                        : investigation.risk_level === 'Suspicious'
                        ? 'bg-amber-500 text-white'
                        : 'bg-teal-600 text-white'
                    }`}>
                      {investigation.risk_level}
                    </span>
                    <span className="text-sm font-mono font-bold">
                      Risk Index: {investigation.risk_score.toFixed(1)}/100
                    </span>
                  </div>
                  <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-2 max-w-lg leading-relaxed">
                    {investigation.risk_rationale}
                  </p>
                </div>
              </div>

              {/* Forensic Evidence Items */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/20 dark:bg-[#2A0D0D]/30 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                  Extracted Deceptive Spans & Flags ({investigation.evidence.length})
                </h3>
                <div className="space-y-3">
                  {investigation.evidence.map((ev) => (
                    <div key={ev.id} className="p-3.5 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#A82020] dark:text-[#E04848] uppercase">
                          {ev.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#E2CEB9] dark:bg-[#3A1313] font-bold">
                          Severity: {ev.severity}
                        </span>
                      </div>
                      <div className="font-bold text-[#2A0E0E] dark:text-white">
                        Matched: "{ev.matched_text}"
                      </div>
                      <p className="text-[#5C2222] dark:text-[#C9B29B] text-[11px]">
                        {ev.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Playbook (ref3 inspired) */}
              <div className="p-6 rounded-2xl border border-[#1E6E60]/40 bg-teal-500/10 dark:bg-teal-950/20 space-y-3">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <span>Immediate User Safety Playbook</span>
                </div>
                <ul className="space-y-2 text-xs text-[#2A0E0E] dark:text-[#F3E6D5]">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-teal-600">•</span>
                    <span><strong>Never engage:</strong> Do not reply, click links, or dial back numbers sent in suspicious SMS.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-teal-600">•</span>
                    <span><strong>Verify independently:</strong> Contact your financial institution via official statements or bank branch.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-teal-600">•</span>
                    <span><strong>Report:</strong> Report cyber fraud in India via national portal <strong>cybercrime.gov.in</strong> or dial <strong>1930</strong> immediately.</span>
                  </li>
                </ul>
              </div>

              {/* Gemma AI Report Section */}
              <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C27803]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                    Local Gemma 4 Analytical Report
                  </h3>
                </div>
                {investigation.gemma_report ? (
                  <div className="text-xs space-y-3 text-[#2A0E0E] dark:text-[#F3E6D5]">
                    <p className="font-medium italic">{investigation.gemma_report.executive_summary}</p>
                    <div>
                      <strong className="block text-[11px] uppercase mb-1">Key Findings:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        {investigation.gemma_report.main_findings.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] border-t border-[#6C1A1A]/10 pt-2">
                      {investigation.gemma_report.disclaimer}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#E2CEB9]/50 dark:bg-[#3A1313]/50 text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
                    AI report unavailable. Local Ollama server is offline or Gemma 4 model was not loaded. Deterministic ML scores and rule-based evidence extractions remain fully functional above.
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
