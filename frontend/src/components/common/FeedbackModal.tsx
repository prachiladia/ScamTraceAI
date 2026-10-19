import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitFeedback } from '../../services/api';
import { useToast } from './Toast';

export const FeedbackModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('bug_report');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    // Retrieve UTM tags (H.14)
    const utmSource = sessionStorage.getItem('scamtrace_utm_source') || localStorage.getItem('scamtrace_utm_source') || undefined;
    const utmMedium = sessionStorage.getItem('scamtrace_utm_medium') || localStorage.getItem('scamtrace_utm_medium') || undefined;
    const utmCampaign = sessionStorage.getItem('scamtrace_utm_campaign') || localStorage.getItem('scamtrace_utm_campaign') || undefined;

    try {
      await submitFeedback({
        name,
        email,
        category,
        message,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      setSubmitSuccess(true);
      showToast('Feedback submitted successfully! Thank you.', 'success');
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
        setMessage('');
        setName('');
        setEmail('');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to submit feedback. The backend API may be offline.'
      );
      showToast('Submission failed. Check backend connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (H.20) */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-contact fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[var(--surface-elevated)] hover:bg-[var(--surface)] text-[var(--accent-primary)] shadow-xl border border-[var(--border-subtle)] transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer text-xs font-mono font-semibold"
        aria-label="Open contact and feedback form"
      >
        <MessageSquare className="w-4 h-4 text-[var(--accent-secondary)]" />
        <span className="hidden sm:inline">Feedback & Report</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-2xl p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 id="feedback-title" className="font-display font-bold text-lg text-[var(--text-primary)]">
                Contact & Feedback
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-5 font-sans">
              Submit scam trends, report false-positives, suggest features, or report issues.
            </p>

            {submitSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                <h3 className="font-bold text-base text-[var(--text-primary)]">Thank You!</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Your feedback was recorded securely in the local SQLite database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-primary)]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-primary)]">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-primary)]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  >
                    <option value="bug_report">Bug Report / UI Glitch</option>
                    <option value="false_positive">Model False-Positive or False-Negative</option>
                    <option value="new_scam_pattern">New Emerging Scam Pattern / Template</option>
                    <option value="feature_request">Feature Request / Enhancement</option>
                    <option value="other">General Question / Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-primary)]">
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe what you observed or what happened..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[#06B6D4] text-[#080D18] text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#080D18]" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#080D18]" /> Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
