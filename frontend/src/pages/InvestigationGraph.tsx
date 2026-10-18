import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Network,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { fetchGraphData } from '../services/api';
import type { InvestigationGraph as GraphData, GraphNode } from '../types';
import { useTheme } from '../context/ThemeContext';

export const InvestigationGraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filterId = searchParams.get('investigation_id');

  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'legend' | 'filters'>('details');

  // Link-type and Node-type toggles (ref4 inspired)
  const [showUrls, setShowUrls] = useState(true);
  const [showPhones, setShowPhones] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true);

  const { resolvedTheme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const loadGraph = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGraphData(filterId || undefined);
      setGraphData(data);

      if (data.nodes.length > 0) {
        setSelectedNode(data.nodes[0]);
      }

      // Arrange nodes in a circular or multi-tier layout
      const centerNode = data.nodes.find((n) => n.type === 'investigation') || data.nodes[0];
      const otherNodes = data.nodes.filter((n) => n.id !== centerNode?.id);

      const flowNodes = [];
      if (centerNode) {
        flowNodes.push({
          id: centerNode.id,
          position: { x: 350, y: 220 },
          data: {
            label: centerNode.label,
            type: centerNode.type,
            meta: centerNode.data,
            badge: data.edges.filter((e) => e.source === centerNode.id || e.target === centerNode.id).length,
          },
          style: {
            background: '#A82020',
            color: '#F3E6D5',
            border: '2px solid #FBE6C2',
            borderRadius: '14px',
            padding: '12px 18px',
            fontWeight: 'bold',
            fontSize: '12px',
            boxShadow: '0 8px 20px rgba(168, 32, 32, 0.3)',
          },
        });
      }

      const radius = 220;
      otherNodes.forEach((node, i) => {
        const angle = (i / Math.max(1, otherNodes.length)) * 2 * Math.PI;
        const x = 350 + radius * Math.cos(angle);
        const y = 220 + radius * Math.sin(angle);

        let bg = '#2A0D0D';
        let border = '#6C1A1A';
        let color = '#F3E6D5';

        if (node.type === 'url') {
          bg = '#1E3A5F';
          border = '#60A5FA';
        } else if (node.type === 'phone') {
          bg = '#064E3B';
          border = '#34D399';
        } else if (node.type === 'template_hash') {
          bg = '#581C87';
          border = '#C084FC';
        }

        flowNodes.push({
          id: node.id,
          position: { x, y },
          data: {
            label: node.label,
            type: node.type,
            meta: node.data,
            badge: 1,
          },
          style: {
            background: bg,
            border: `1.5px solid ${border}`,
            color: color,
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '11px',
            fontWeight: 600,
          },
        });
      });

      const flowEdges = data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#A82020' },
        style: { stroke: '#A82020', strokeWidth: 1.8 },
        labelStyle: { fill: '#7E3E3E', fontSize: 10, fontWeight: 700 },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err) {
      console.error('Failed to load graph telemetry:', err);
    } finally {
      setLoading(false);
    }
  }, [filterId, setNodes, setEdges]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const onNodeClick = (_: any, node: any) => {
    const raw = graphData?.nodes.find((n) => n.id === node.id);
    if (raw) setSelectedNode(raw);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase tracking-tight">
              Investigation Entity Relationship Graph
            </h1>
            {filterId && (
              <span className="text-[10px] font-mono bg-[#A82020] text-white px-2 py-0.5 rounded font-bold">
                Filtered: Case #{filterId.slice(0, 6)}
              </span>
            )}
          </div>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Interactive canvas displaying structural edges between investigations, deceptive URLs, masked phone numbers, and template fingerprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {filterId && (
            <Link
              to="/graph"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Show Global Graph</span>
            </Link>
          )}
          <button
            onClick={loadGraph}
            className="flex items-center gap-1.5 p-2 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] cursor-pointer"
            title="Reload graph"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Graph Grid (ref1/ref2/ref4 spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/20 dark:bg-[#1A0707] relative overflow-hidden shadow-inner flex flex-col h-[620px]">
          {loading ? (
            <div className="m-auto text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B] flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#A82020]" />
              <span>Rendering React Flow entity canvas...</span>
            </div>
          ) : nodes.length === 0 ? (
            <div className="m-auto text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B] max-w-sm space-y-2">
              <Network className="w-8 h-8 text-[#A82020] mx-auto opacity-50" />
              <p>No entity relationships found. Perform an investigation in the Evidence Analyzer to populate the graph.</p>
              <Link to="/investigate" className="inline-block font-bold text-[#A82020] hover:underline pt-2">
                Launch Evidence Analyzer →
              </Link>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
              colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
            >
              <Background color={resolvedTheme === 'dark' ? '#3A1313' : '#E2CEB9'} gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node: any) => {
                  if (node.data?.type === 'investigation') return '#A82020';
                  if (node.data?.type === 'url') return '#3B82F6';
                  if (node.data?.type === 'phone') return '#10B981';
                  return '#8B5CF6';
                }}
              />
            </ReactFlow>
          )}

          {/* Bottom Toolbar & Node Count Badges (ref1 inspired) */}
          <div className="p-3 bg-[#FBE6C2]/80 dark:bg-[#2A0D0D]/90 border-t border-[#6C1A1A]/20 dark:border-[#A82020]/30 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-3">
              <span className="font-bold flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-[#A82020]" />
                <span>{nodes.length} Active Nodes</span>
              </span>
              <span className="text-[#7E3E3E] dark:text-[#C9B29B]">•</span>
              <span>{edges.length} Labelled Edges</span>
            </div>
            <div className="text-[11px] font-mono text-[#7E3E3E] dark:text-[#C9B29B]">
              Pan / Zoom / Click node to inspect
            </div>
          </div>
        </div>

        {/* Right Tabbed Details & Inspector Panel (ref2/ref4/ref5 inspired - 4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 p-5 flex flex-col justify-between h-[620px]">
          <div>
            {/* Tabs (ref2 inspired) */}
            <div className="flex items-center border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30 pb-3 gap-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-[#A82020] text-white shadow-sm'
                    : 'text-[#7E3E3E] dark:text-[#C9B29B] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]'
                }`}
              >
                Node Details
              </button>
              <button
                onClick={() => setActiveTab('legend')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'legend'
                    ? 'bg-[#A82020] text-white shadow-sm'
                    : 'text-[#7E3E3E] dark:text-[#C9B29B] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]'
                }`}
              >
                Legend & Colors
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'filters'
                    ? 'bg-[#A82020] text-white shadow-sm'
                    : 'text-[#7E3E3E] dark:text-[#C9B29B] hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]'
                }`}
              >
                Link Filters
              </button>
            </div>

            {/* Tab 1: Node Details (ref2 / ref5) */}
            {activeTab === 'details' && (
              <div className="pt-4 space-y-4 text-xs overflow-y-auto max-h-[480px]">
                {selectedNode ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">
                        Node Identifier & Label
                      </span>
                      <div className="text-sm font-bold text-[#2A0E0E] dark:text-[#F3E6D5] break-all">
                        {selectedNode.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">Category:</span>
                      <span className="font-mono text-xs font-bold text-[#A82020] dark:text-[#E04848] uppercase">
                        {selectedNode.type}
                      </span>
                    </div>

                    {/* Metadata attributes */}
                    <div className="p-3.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B] block">
                        Forensic Context & Attributes
                      </span>
                      {Object.entries(selectedNode.data || {}).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-[#6C1A1A]/5 pb-1">
                          <span className="text-gray-500 capitalize">{k.replace('_', ' ')}:</span>
                          <span className="font-mono font-semibold truncate max-w-[150px]">{String(v)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-[#7E3E3E] dark:text-[#C9B29B]">
                      * Note: Masked entities indicate presence in suspicious context; not official law enforcement attribution.
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
                    Click any node on the canvas to inspect its forensic properties.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Legend (ref4) */}
            {activeTab === 'legend' && (
              <div className="pt-4 space-y-3 text-xs">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                  Node Categories & Semantic Colors
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#A82020]/10 border border-[#A82020]/20">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#A82020]" />
                    <span className="font-semibold">Investigation Incident Root</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                    <span className="font-semibold">Landing URL / Domain</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold">Masked Contact / Phone</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500" />
                    <span className="font-semibold">Structural Template Fingerprint</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2 border-t border-[#6C1A1A]/10 dark:border-[#A82020]/20">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                    Edge Types
                  </h4>
                  <ul className="text-[11px] space-y-1 list-disc list-inside opacity-80">
                    <li><strong>CONTAINS:</strong> Incident text embeds this indicator.</li>
                    <li><strong>IMPERSONATES:</strong> Claimed authority reference.</li>
                    <li><strong>SHARES_INDICATOR:</strong> Correlated campaign connection.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Link Filters (ref4) */}
            {activeTab === 'filters' && (
              <div className="pt-4 space-y-3 text-xs">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2]">
                  Toggle Visible Indicator Types
                </h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showUrls}
                      onChange={(e) => setShowUrls(e.target.checked)}
                      className="rounded accent-[#A82020] w-4 h-4"
                    />
                    <span>Show Landing URLs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPhones}
                      onChange={(e) => setShowPhones(e.target.checked)}
                      className="rounded accent-[#A82020] w-4 h-4"
                    />
                    <span>Show Masked Phone Numbers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTemplates}
                      onChange={(e) => setShowTemplates(e.target.checked)}
                      className="rounded accent-[#A82020] w-4 h-4"
                    />
                    <span>Show Template Hashes</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
