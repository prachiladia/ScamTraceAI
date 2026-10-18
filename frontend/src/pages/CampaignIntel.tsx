import React, { useEffect, useState } from 'react';
import { Layers, Sliders, RefreshCw } from 'lucide-react';
import { fetchCampaigns } from '../services/api';
import type { CampaignCluster } from '../types';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
            Campaign & Cluster Intelligence
          </h1>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Detect coordinated scam waves through TF-IDF cosine similarity clustering over stored investigations.
          </p>
        </div>

        {/* Threshold Slider */}
        <div className="flex items-center gap-3 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 px-4 py-2 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30">
          <Sliders className="w-4 h-4 text-[#A82020]" />
          <div className="text-xs">
            <span className="font-bold">Cosine Threshold: </span>
            <span className="font-mono">{similarityThreshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
            className="accent-[#A82020] cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#A82020]" />
            <span>Loading campaign clusters...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#6C1A1A]/30 dark:border-[#A82020]/40 p-12 text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
            No correlated campaign clusters detected at the current threshold. As more investigations are recorded, shared indicators and template similarities form automated cluster groups.
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#A82020]" />
                  <h3 className="font-bold text-base text-[#2A0E0E] dark:text-[#F3E6D5]">
                    {camp.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#E2CEB9] dark:bg-[#3A1313] px-2.5 py-1 rounded-md">
                  Similarity: {(camp.similarity_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">Shared Anchor:</span>
                  <div className="font-mono font-bold text-[#A82020] dark:text-[#E04848] truncate">{camp.indicator_value}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">Correlated Incidents:</span>
                  <div className="font-bold">{camp.investigation_count} submissions</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">Active Window:</span>
                  <div className="text-[11px] opacity-80">{new Date(camp.first_seen).toLocaleDateString()} – {new Date(camp.last_seen).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
