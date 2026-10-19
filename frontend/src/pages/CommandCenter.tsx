import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ShieldCheck, Database, Plus, RefreshCw, ArrowRight, Activity, Terminal } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { fetchDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';
import { SeverityChip } from '../components/ui/SeverityChip';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const CommandCenter: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to backend telemetry service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Format chart data for threat distribution
  const chartData = stats
    ? [
        {
          name: 'High Concern',
          count: stats.high_concern_count,
          color: '#F87171',
        },
        {
          name: 'Suspicious',
          count: stats.suspicious_count,
          color: '#FBBF24',
        },
        {
          name: 'Lower Concern',
          count: stats.lower_concern_count,
          color: '#2DD4BF',
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--accent-primary)]">
              SOC TELEMETRY STREAM
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
            Incident Command Center
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
            Real-time threat monitoring, distribution metrics, and active investigation logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label="Refresh dashboard telemetry"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--accent-primary)] ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/investigate">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              New Investigation
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <Link to="/settings" className="font-mono font-bold underline hover:text-white ml-4">
            Check Settings / Toggle Mode →
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyzed */}
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-[var(--text-secondary)] font-mono font-semibold uppercase tracking-wider">
              Total Analyzed
            </div>
            <div className="text-3xl font-mono font-black text-[var(--text-primary)] mt-1">
              {stats ? stats.total_investigations : '—'}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">
              Deterministic + ML Telemetry
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
            <Database className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
        </div>

        {/* High Concern */}
        <div className="p-5 rounded-2xl border border-red-500/20 bg-[var(--surface)] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-red-400 font-mono font-semibold uppercase tracking-wider">
              High Concern
            </div>
            <div className="text-3xl font-mono font-black text-[#F87171] mt-1">
              {stats ? stats.high_concern_count : '—'}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">
              {stats && stats.total_investigations > 0
                ? `${((stats.high_concern_count / stats.total_investigations) * 100).toFixed(1)}% of cases`
                : 'Active alerts'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-[#F87171]" />
          </div>
        </div>

        {/* Suspicious */}
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-[var(--surface)] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-amber-400 font-mono font-semibold uppercase tracking-wider">
              Suspicious
            </div>
            <div className="text-3xl font-mono font-black text-[#FBBF24] mt-1">
              {stats ? stats.suspicious_count : '—'}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">
              {stats && stats.total_investigations > 0
                ? `${((stats.suspicious_count / stats.total_investigations) * 100).toFixed(1)}% of cases`
                : 'Elevated anomaly'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6 text-[#FBBF24]" />
          </div>
        </div>

        {/* Lower Concern */}
        <div className="p-5 rounded-2xl border border-teal-500/20 bg-[var(--surface)] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-teal-400 font-mono font-semibold uppercase tracking-wider">
              Lower Concern
            </div>
            <div className="text-3xl font-mono font-black text-[#2DD4BF] mt-1">
              {stats ? stats.lower_concern_count : '—'}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">
              {stats && stats.total_investigations > 0
                ? `${((stats.lower_concern_count / stats.total_investigations) * 100).toFixed(1)}% of cases`
                : 'Neutral / ham'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <ShieldCheck className="w-6 h-6 text-[#2DD4BF]" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Chart + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Threat Distribution Bar Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
                Threat Classification Distribution
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              Normalized Case Aggregation
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            {stats && stats.total_investigations > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={11}
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101827',
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      color: '#F1F5F9',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    }}
                    cursor={{ fill: 'rgba(34, 211, 238, 0.05)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs font-mono text-[var(--text-secondary)] space-y-2">
                <Database className="w-8 h-8 text-[var(--text-secondary)]/40" />
                <span>No investigation telemetry recorded yet.</span>
                <Link to="/investigate" className="text-[var(--accent-primary)] hover:underline">
                  Analyze first suspicious sample →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* System & Engine Architecture Telemetry (1 col) */}
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-[var(--accent-secondary)]" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
                Engine Telemetry
              </h2>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[var(--text-secondary)] uppercase text-[10px]">Text Classifier</div>
                <div className="font-bold text-[var(--text-primary)]">TF-IDF + Calibrated Logistic Regression</div>
                <div className="text-emerald-400 text-[10px]">Status: Active (97.68% Test Acc)</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[var(--text-secondary)] uppercase text-[10px]">URL Classifier</div>
                <div className="font-bold text-[var(--text-primary)]">10-Feature Lexical Random Forest</div>
                <div className="text-emerald-400 text-[10px]">Status: Active (100% Offline)</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[var(--text-secondary)] uppercase text-[10px]">Local LLM Integration</div>
                <div className="font-bold text-[var(--text-primary)]">Gemma 4 via Ollama</div>
                <div className="text-[var(--accent-primary)] text-[10px]">Configured: gemma4:e2b</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
            Database: SQLite • WAL Mode Active
          </div>
        </div>
      </div>

      {/* Recent Investigations Feed */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-[var(--text-primary)] uppercase tracking-wide">
            Recent Investigation Telemetry
          </h2>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Latest 10 Ingested Cases
          </span>
        </div>

        {!stats || stats.recent_investigations.length === 0 ? (
          <div className="text-center py-12 text-xs font-mono text-[var(--text-secondary)] space-y-2">
            <div>No investigations recorded yet.</div>
            <div>Click "New Investigation" above to analyze your first suspicious message or URL.</div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {stats.recent_investigations.map((inv) => (
              <div
                key={inv.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--surface-elevated)]/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityChip
                      level={inv.risk_level}
                      score={inv.risk_score}
                      size="sm"
                    />
                    {inv.is_demo && (
                      <Badge variant="warning" size="sm">
                        DEMO DATA
                      </Badge>
                    )}
                    <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                      Case #{inv.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] font-mono line-clamp-1 max-w-3xl">
                    {inv.input_text}
                  </p>
                </div>
                <Link
                  to={`/investigate?id=${inv.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:underline shrink-0"
                >
                  <span>View Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
