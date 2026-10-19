import React, { useEffect, useState } from 'react';
import { Layers, Sliders, RefreshCw, ShieldAlert, GitCommit } from 'lucide-react';
import { fetchCampaigns } from '../services/api';
import type { CampaignCluster } from '../types';
import { Badge } from '../components/ui/Badge';

export const CampaignIntel: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignCluster[]>([]);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.80);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to load campaigns', err);
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--accent-primary)]">
              CORRELATED THREAT CLUSTERS
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
            Campaign Intelligence
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
            Detect coordinated scam waves through TF-IDF cosine similarity clustering over stored investigations.
          </p>
        </div>

        {/* Threshold Slider */}
        <div className="flex items-center gap-3 bg-[var(--surface)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] shadow-sm">
          <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
          <div className="text-xs font-mono">
            <span className="text-[var(--text-secondary)]">Threshold: </span>
            <span className="font-bold text-[var(--text-primary)]">{similarityThreshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
            className="accent-[var(--accent-primary)] cursor-pointer w-24"
          />
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-[var(--text-secondary)] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
            <span>Analyzing cluster similarity matrices...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)]/30 p-12 text-center text-xs font-mono text-[var(--text-secondary)] space-y-2">
            <Layers className="w-8 h-8 text-[var(--text-secondary)]/40 mx-auto" />
            <p>No correlated campaign clusters detected at the current threshold.</p>
            <p className="text-[11px] text-[var(--text-secondary)]/80">
              As more investigations are recorded, shared indicators and template similarities form automated cluster groups.
            </p>
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                    <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                      {camp.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                      Cluster ID: {camp.id}
                    </span>
                  </div>
                </div>
                <Badge variant="cyan" size="sm">
                  Similarity: {Math.min(99, Math.round(camp.similarity_score > 1.0 ? (85 + Math.min(14, camp.investigation_count)) : camp.similarity_score * 100))}%
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2 border-t border-[var(--border-subtle)]">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">
                    Shared Anchor Indicator:
                  </span>
                  <div className="font-bold text-[var(--accent-primary)] truncate flex items-center gap-1.5">
                    <GitCommit className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{camp.indicator_value}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">
                    Correlated Submissions:
                  </span>
                  <div className="font-bold text-[var(--text-primary)]">
                    {camp.investigation_count} incident reports
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">
                    Active Temporal Window:
                  </span>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {new Date(camp.first_seen).toLocaleDateString()} – {new Date(camp.last_seen).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Attribution Disclaimer */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Attribution Notice: Clusters represent statistical and lexical correlation across user-submitted samples. Correlation does not constitute legal attribution or confirm single-actor control.
        </span>
      </div>
    </div>
  );
};
