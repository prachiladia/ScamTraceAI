import React, { useEffect, useState } from 'react';
import { Network, RefreshCw } from 'lucide-react';
import { fetchGraphData } from '../services/api';
import type { InvestigationGraph as GraphData } from '../types';

export const InvestigationGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  useEffect(() => {
    const loadGraph = async () => {
      setLoading(true);
      try {
        const data = await fetchGraphData();
        setGraphData(data);
        if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
      } catch (err) {
        console.error('Failed to load graph', err);
      } finally {
        setLoading(false);
      }
    };
    loadGraph();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
            Investigation & Entity Relationship Graph
          </h1>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Explore connections between investigations, deceptive URLs, masked phone numbers, and template fingerprints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Canvas Area (ref1/ref4 inspired) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/20 dark:bg-[#1A0707] p-6 relative flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold z-10">
            <span className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#A82020]" />
              <span>Canvas ({graphData ? graphData.nodes.length : 0} nodes, {graphData ? graphData.edges.length : 0} links)</span>
            </span>
            <div className="flex items-center gap-1.5 bg-[#FBE6C2] dark:bg-[#2A0D0D] p-1 rounded-lg border border-[#6C1A1A]/20 dark:border-[#A82020]/30">
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold">Investigation</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 font-bold">URL</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">Brand</span>
            </div>
          </div>

          {/* Visual node link presentation */}
          <div className="my-auto py-12 flex flex-wrap items-center justify-center gap-6">
            {loading ? (
              <div className="text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#A82020]" />
                <span>Loading entity graph...</span>
              </div>
            ) : graphData?.nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition-all transform hover:scale-105 cursor-pointer text-left ${
                  selectedNode?.id === node.id
                    ? 'border-[#A82020] bg-[#A82020] text-white shadow-lg'
                    : 'border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/70 dark:bg-[#2A0D0D] text-[#2A0E0E] dark:text-[#F3E6D5]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-75">{node.type}</div>
                <div className="text-sm font-bold mt-1">{node.label}</div>
              </button>
            ))}
            {(!graphData || graphData.nodes.length === 0) && (
              <div className="text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
                No graph entities loaded yet. Run an investigation to generate relationships.
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] border-t border-[#6C1A1A]/10 pt-2 flex items-center justify-between">
            <span>Graph edges reflect real extracted indicators (CONTAINS, IMPERSONATES, MATCHES_TEMPLATE).</span>
            <span>Ref 1 & 4 Spec</span>
          </div>
        </div>

        {/* Right Tabbed Inspector Panel (ref2/ref5 inspired) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2] mb-4">
              Node Inspector & Indicator Details
            </h3>
            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] uppercase font-bold">Label</span>
                  <div className="text-sm font-bold text-[#2A0E0E] dark:text-[#F3E6D5]">{selectedNode.label}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] uppercase font-bold">Node Type</span>
                  <div className="font-mono text-[#A82020] dark:text-[#E04848] font-bold">{selectedNode.type}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B] uppercase font-bold">Forensic Metadata</span>
                  <pre className="mt-1 p-2.5 rounded-lg bg-[#E2CEB9]/60 dark:bg-[#1A0707] font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedNode.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
                Select any node on the graph canvas to inspect its forensic properties.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
