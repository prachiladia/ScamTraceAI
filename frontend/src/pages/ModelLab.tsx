import React, { useEffect, useState } from 'react';
import { Cpu, Globe, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { fetchModelMetrics } from '../services/api';
import { Badge } from '../components/ui/Badge';

export const ModelLab: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchModelMetrics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--accent-primary)]">
            OFFLINE HELD-OUT EVALUATION BENCHMARKS
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
          Model Laboratory & Metrics
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
          Inspect offline held-out test set performance, confusion matrices, and feature attribution. Evaluated strictly on unseen splits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Message Model Card */}
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
                SMS & Message Classifier
              </h2>
            </div>
            <Badge variant="cyan" size="sm">
              TF-IDF + Calibrated LR
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
            Trained on the canonical SMS Spam Collection dataset with stratified train/validation/test splits and isotonic probability calibration.
          </p>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-[var(--text-secondary)] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
              <span>Verifying test metrics...</span>
            </div>
          ) : metrics?.message_model ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">Accuracy</div>
                  <div className="text-xl font-mono font-black text-[var(--accent-primary)] mt-1">
                    {(metrics.message_model.test_metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">F1 Score</div>
                  <div className="text-xl font-mono font-black text-[var(--accent-primary)] mt-1">
                    {(metrics.message_model.test_metrics.f1 * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">Precision</div>
                  <div className="text-xl font-mono font-black text-[var(--accent-primary)] mt-1">
                    {(metrics.message_model.test_metrics.precision * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
                <div className="flex justify-between">
                  <span>Split Stratification:</span>
                  <span className="text-[var(--text-primary)] font-bold">70% Train / 15% Val / 15% Test</span>
                </div>
                <div className="flex justify-between">
                  <span>Calibration:</span>
                  <span className="text-emerald-400 font-bold">Isotonic Calibrated Probability</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
              Model artifacts and metrics JSON not generated yet. Run <code>python -m scripts.train_message</code> to train and evaluate.
            </div>
          )}
        </div>

        {/* URL Model Card */}
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                <Globe className="w-5 h-5 text-[var(--accent-secondary)]" />
              </div>
              <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
                Lexical URL Classifier
              </h2>
            </div>
            <Badge variant="teal" size="sm">
              10-Feature Lexical RF
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
            Evaluates strictly local lexical features extracted from the URL string. Never resolves DNS, issues HTTP queries, or contacts destination hosts.
          </p>

          {metrics?.url_model ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">Accuracy</div>
                  <div className="text-xl font-mono font-black text-[var(--accent-secondary)] mt-1">
                    {(metrics.url_model.test_metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">F1 Score</div>
                  <div className="text-xl font-mono font-black text-[var(--accent-secondary)] mt-1">
                    {(metrics.url_model.test_metrics.f1 * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">Precision</div>
                  <div className="text-xl font-mono font-black text-[var(--accent-secondary)] mt-1">
                    {(metrics.url_model.test_metrics.precision * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
                <div className="flex justify-between">
                  <span>Network Lookups:</span>
                  <span className="text-emerald-400 font-bold">0 (Purely Lexical)</span>
                </div>
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span className="text-[var(--text-primary)] font-bold">Entropy, TLD, Length, Digit Ratio</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
              Model artifacts and metrics JSON not generated yet. Run <code>python -m scripts.train_url</code> to train and evaluate.
            </div>
          )}
        </div>
      </div>

      {/* Model Integrity Guarantees */}
      <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold uppercase text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Engineering Integrity Protocol</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-[var(--text-secondary)]">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Held-out evaluation: Metrics computed exclusively on unseen test splits. Zero label leakage.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>No fabricated stats: Accuracy, F1, and precision originate from verified scikit-learn runs.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Deterministic separation: Heuristic evidence extraction operates independently of model scores.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
