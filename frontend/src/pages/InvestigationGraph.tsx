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
  ArrowLeft,
  Info,
  SlidersHorizontal,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { fetchGraphData } from '../services/api';
import type { InvestigationGraph as GraphData, GraphNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Badge } from '../components/ui/Badge';

export const InvestigationGraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filterId = searchParams.get('investigation_id');

  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'legend' | 'filters'>('details');

  // Filter toggles
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

      // Arrange nodes in circular layout around root investigation
      const centerNode = data.nodes.find((n) => n.type === 'investigation') || data.nodes[0];
      const otherNodes = data.nodes.filter((n) => n.id !== centerNode?.id);

      const flowNodes = [];
      if (centerNode) {
        flowNodes.push({
          id: centerNode.id,
          position: { x: 380, y: 240 },
          data: {
            label: centerNode.label,
            type: centerNode.type,
            meta: centerNode.data,
            badge: data.edges.filter((e) => e.source === centerNode.id || e.target === centerNode.id).length,
          },
          style: {
            background: '#141F30',
            color: '#F1F5F9',
            border: '2px solid #22D3EE',
            borderRadius: '14px',
            padding: '12px 18px',
            fontWeight: 'bold',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono',
            boxShadow: '0 0 25px rgba(34, 211, 238, 0.25)',
          },
        });
      }

      const radius = 230;
      otherNodes.forEach((node, i) => {
        const angle = (i / Math.max(1, otherNodes.length)) * 2 * Math.PI;
        const x = 380 + radius * Math.cos(angle);
        const y = 240 + radius * Math.sin(angle);

        let bg = '#101827';
        let border = 'rgba(148, 163, 184, 0.3)';
        let color = '#F1F5F9';
        let glow = 'none';

        if (node.type === 'url') {
          border = '#2DD4BF';
          glow = '0 0 15px rgba(45, 212, 191, 0.2)';
        } else if (node.type === 'phone') {
          border = '#FBBF24';
          glow = '0 0 15px rgba(251, 191, 36, 0.2)';
        } else if (node.type === 'template_hash') {
          border = '#A78BFA';
          glow = '0 0 15px rgba(167, 139, 250, 0.2)';
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
            fontFamily: 'JetBrains Mono',
            fontWeight: 600,
            boxShadow: glow,
          },
        });
      });

      const flowEdges = data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22D3EE' },
        style: { stroke: 'rgba(34, 211, 238, 0.6)', strokeWidth: 1.5 },
        labelStyle: { fill: '#94A3B8', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' },
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--accent-primary)]">
              THREAT CORRELATION CANVAS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Entity Relationship Graph
            </h1>
            {filterId && (
              <Badge variant="cyan" size="sm">
                Case #{filterId.slice(0, 8)}
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
            Interactive canvas displaying structural edges between investigations, deceptive URLs, masked phone numbers, and template fingerprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {filterId && (
            <Link
              to="/graph"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Show Global Graph</span>
            </Link>
          )}
          <button
            onClick={loadGraph}
            className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            title="Reload graph"
            aria-label="Reload entity graph"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--border-subtle)] bg-[#080D18] relative overflow-hidden shadow-2xl flex flex-col h-[640px]">
          {loading ? (
            <div className="m-auto text-center text-xs font-mono text-[var(--text-secondary)] flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent-primary)]" />
              <span>Rendering React Flow entity canvas...</span>
            </div>
          ) : nodes.length === 0 ? (
            <div className="m-auto text-center text-xs font-mono text-[var(--text-secondary)] max-w-sm space-y-3">
              <Network className="w-8 h-8 text-[var(--accent-primary)] mx-auto opacity-50" />
              <p>No entity relationships found. Perform an investigation in the Evidence Analyzer to populate the graph.</p>
              <Link to="/investigate" className="inline-block font-bold text-[var(--accent-primary)] hover:underline pt-2">
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
              <Background color="#1E293B" gap={20} size={1} />
              <Controls className="[&_button]:bg-[#141F30] [&_button]:border-[rgba(148,163,184,0.2)] [&_button]:text-[#F1F5F9] [&_button:hover]:bg-[#1B293B]" />
              <MiniMap
                className="bg-[#080D18]! border border-[rgba(148,163,184,0.2)]! rounded-xl!"
                nodeColor={(node: any) => {
                  if (node.data?.type === 'investigation') return '#22D3EE';
                  if (node.data?.type === 'url') return '#2DD4BF';
                  if (node.data?.type === 'phone') return '#FBBF24';
                  return '#A78BFA';
                }}
              />
            </ReactFlow>
          )}

          {/* Bottom Toolbar & Node Count */}
          <div className="p-3 bg-[var(--surface)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] flex items-center justify-between text-xs z-10 font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold flex items-center gap-1.5 text-[var(--text-primary)]">
                <Network className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{nodes.length} Active Nodes</span>
              </span>
              <span className="text-[var(--text-secondary)]">•</span>
              <span className="text-[var(--text-secondary)]">{edges.length} Labelled Edges</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Pan / Zoom / Click node to inspect
            </div>
          </div>
        </div>

        {/* Right Tabbed Details & Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 flex flex-col justify-between h-[640px] shadow-lg">
          <div>
            {/* Tabs */}
            <div className="flex items-center border-b border-[var(--border-subtle)] pb-3 gap-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-[var(--surface-elevated)] text-[var(--accent-primary)] border border-[var(--border-subtle)] shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
              <button
                onClick={() => setActiveTab('legend')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'legend'
                    ? 'bg-[var(--surface-elevated)] text-[var(--accent-primary)] border border-[var(--border-subtle)] shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Legend</span>
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'filters'
                    ? 'bg-[var(--surface-elevated)] text-[var(--accent-primary)] border border-[var(--border-subtle)] shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Tab 1: Node Details */}
            {activeTab === 'details' && (
              <div className="pt-4 space-y-4 text-xs font-sans overflow-y-auto max-h-[500px]">
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-secondary)]">
                        Node Identifier & Label
                      </span>
                      <div className="text-sm font-mono font-bold text-[var(--text-primary)] break-all mt-0.5">
                        {selectedNode.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-secondary)]">Category:</span>
                      <Badge variant="cyan" size="sm">
                        {selectedNode.type}
                      </Badge>
                    </div>

                    {/* Metadata attributes */}
                    <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] space-y-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-[var(--text-secondary)] block">
                        Forensic Context & Attributes
                      </span>
                      {Object.entries(selectedNode.data || {}).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-[var(--border-subtle)] pb-1 text-xs">
                          <span className="text-[var(--text-secondary)] capitalize font-sans">{k.replace(/_/g, ' ')}:</span>
                          <span className="font-mono font-semibold text-[var(--text-primary)] truncate max-w-[160px]">{String(v)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[10.5px] font-mono text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        Attribution Disclaimer: Correlated indicators reveal structural overlap between reported messages; they do not establish criminal identity or carrier infrastructure ownership.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs font-mono text-[var(--text-secondary)]">
                    Click any node on the canvas to inspect its forensic properties.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Legend */}
            {activeTab === 'legend' && (
              <div className="pt-4 space-y-4 text-xs font-sans">
                <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-[var(--text-primary)]">
                  Node Categories & Semantic Colors
                </h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--accent-primary)]/30">
                    <span className="w-3.5 h-3.5 rounded-full bg-[var(--accent-primary)]" />
                    <span className="font-semibold text-[var(--text-primary)]">Investigation Incident Root</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--surface-elevated)] border border-[#2DD4BF]/30">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF]" />
                    <span className="font-semibold text-[var(--text-primary)]">Landing URL / Domain</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--surface-elevated)] border border-[#FBBF24]/30">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24]" />
                    <span className="font-semibold text-[var(--text-primary)]">Masked Contact / Phone</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--surface-elevated)] border border-[#A78BFA]/30">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#A78BFA]" />
                    <span className="font-semibold text-[var(--text-primary)]">Structural Template Hash</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2 border-t border-[var(--border-subtle)]">
                  <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-[var(--text-primary)]">
                    Edge Types
                  </h4>
                  <ul className="text-[11px] space-y-1.5 font-mono text-[var(--text-secondary)]">
                    <li><strong className="text-[var(--text-primary)]">CONTAINS:</strong> Incident text embeds this indicator.</li>
                    <li><strong className="text-[var(--text-primary)]">IMPERSONATES:</strong> Claimed authority reference.</li>
                    <li><strong className="text-[var(--text-primary)]">SHARES_INDICATOR:</strong> Correlated campaign connection.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Link Filters */}
            {activeTab === 'filters' && (
              <div className="pt-4 space-y-4 text-xs font-sans">
                <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-[var(--text-primary)]">
                  Toggle Visible Indicator Types
                </h4>
                <div className="space-y-3 font-mono">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={showUrls}
                      onChange={(e) => setShowUrls(e.target.checked)}
                      className="rounded accent-[var(--accent-primary)] w-4 h-4"
                    />
                    <span>Show Landing URLs</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={showPhones}
                      onChange={(e) => setShowPhones(e.target.checked)}
                      className="rounded accent-[var(--accent-primary)] w-4 h-4"
                    />
                    <span>Show Masked Phone Numbers</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={showTemplates}
                      onChange={(e) => setShowTemplates(e.target.checked)}
                      className="rounded accent-[var(--accent-primary)] w-4 h-4"
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
