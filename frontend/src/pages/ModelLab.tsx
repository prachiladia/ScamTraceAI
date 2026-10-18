import React, { useEffect, useState } from 'react';
import { Cpu, Database, RefreshCw } from 'lucide-react';
import { fetchModelMetrics } from '../services/api';

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
      <div className="pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
          Model Laboratory & Evaluation Metrics
        </h1>
        <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
          Inspect offline held-out test set performance, confusion matrices, and feature attribution. No fabricated numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Message Model Card */}
        <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#A82020]" />
              <h2 className="font-bold text-base text-[#2A0E0E] dark:text-[#F3E6D5]">
                SMS & Message Classifier
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#E2CEB9] dark:bg-[#3A1313] px-2 py-0.5 rounded">
              TF-IDF + Calibrated LR
            </span>
          </div>

          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
            Trained on the canonical SMS Spam Collection dataset with stratified train/val/test splits and probability calibration.
          </p>

          {loading ? (
            <div className="py-6 text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#A82020]" />
              <span>Checking metrics...</span>
            </div>
          ) : metrics?.message_model ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  <div className="text-[10px] text-[#7E3E3E] uppercase font-bold">Accuracy</div>
                  <div className="text-lg font-black text-[#A82020] mt-0.5">
                    {(metrics.message_model.test_metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  <div className="text-[10px] text-[#7E3E3E] uppercase font-bold">F1 Score</div>
                  <div className="text-lg font-black text-[#A82020] mt-0.5">
                    {(metrics.message_model.test_metrics.f1 * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  <div className="text-[10px] text-[#7E3E3E] uppercase font-bold">Precision</div>
                  <div className="text-lg font-black text-[#A82020] mt-0.5">
                    {(metrics.message_model.test_metrics.precision * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#E2CEB9]/40 dark:bg-[#3A1313]/40 text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
              Model artifacts and metrics JSON not generated yet. Run <code>python -m scripts.train_message</code> to train and evaluate.
            </div>
          )}
        </div>

        {/* URL Model Card */}
        <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#6C1A1A] dark:text-[#FBE6C2]" />
              <h2 className="font-bold text-base text-[#2A0E0E] dark:text-[#F3E6D5]">
                Lexical URL Classifier
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#E2CEB9] dark:bg-[#3A1313] px-2 py-0.5 rounded">
              Random Forest / Pure Offline
            </span>
          </div>

          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] leading-relaxed">
            Evaluates only strictly local lexical features extracted from the URL string. Never resolves DNS, issues HTTP queries, or touches destination servers.
          </p>

          {metrics?.url_model ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  <div className="text-[10px] text-[#7E3E3E] uppercase font-bold">Accuracy</div>
                  <div className="text-lg font-black text-[#6C1A1A] dark:text-[#FBE6C2] mt-0.5">
                    {(metrics.url_model.test_metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  <div className="text-[10px] text-[#7E3E3E] uppercase font-bold">F1 Score</div>
                  <div className="text-lg font-black text-[#6C1A1A] dark:text-[#FBE6C2] mt-0.5">
                    {(metrics.url_model.test_metrics.f1 * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10">
                  <div className="text-[10px] text-[#7E3E3E] uppercase font-bold">Precision</div>
                  <div className="text-lg font-black text-[#6C1A1A] dark:text-[#FBE6C2] mt-0.5">
                    {(metrics.url_model.test_metrics.precision * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#E2CEB9]/40 dark:bg-[#3A1313]/40 text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
              Model artifacts and metrics JSON not generated yet. Run <code>python -m scripts.train_url</code> to train and evaluate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
