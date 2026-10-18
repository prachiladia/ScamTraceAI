import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Database, Plus, RefreshCw } from 'lucide-react';
import { fetchDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';

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
      setError(err.message || 'Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
            Incident Command Center
          </h1>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Real-time telemetry, risk distribution, and active investigation monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            className="p-2 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] transition-colors cursor-pointer"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/investigate"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Investigation</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-300 dark:border-red-900 bg-red-100/60 dark:bg-red-950/40 text-xs text-red-900 dark:text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <Link to="/settings" className="font-bold underline ml-4">
            Check Settings / Enable Demo Mode
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7E3E3E] dark:text-[#C9B29B] font-semibold uppercase">Total Analyzed</div>
            <div className="text-2xl font-black text-[#2A0E0E] dark:text-[#F3E6D5] mt-1">
              {stats ? stats.total_investigations : '—'}
            </div>
          </div>
          <Database className="w-8 h-8 text-[#6C1A1A] dark:text-[#FBE6C2] opacity-70" />
        </div>

        <div className="p-5 rounded-xl border border-[#A82020]/30 bg-red-500/10 dark:bg-red-950/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-red-800 dark:text-red-300 font-semibold uppercase">High Concern</div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
              {stats ? stats.high_concern_count : '—'}
            </div>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-600 opacity-70" />
        </div>

        <div className="p-5 rounded-xl border border-amber-600/30 bg-amber-500/10 dark:bg-amber-950/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold uppercase">Suspicious</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stats ? stats.suspicious_count : '—'}
            </div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-600 opacity-70" />
        </div>

        <div className="p-5 rounded-xl border border-teal-600/30 bg-teal-500/10 dark:bg-teal-950/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-teal-800 dark:text-teal-300 font-semibold uppercase">Lower Concern</div>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
              {stats ? stats.lower_concern_count : '—'}
            </div>
          </div>
          <CheckCircle className="w-8 h-8 text-teal-600 opacity-70" />
        </div>
      </div>

      {/* Recent Investigations Feed */}
      <div className="rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 p-6">
        <h2 className="font-bold text-lg text-[#2A0E0E] dark:text-[#F3E6D5] mb-4">
          Recent Investigation Telemetry
        </h2>
        {(!stats || stats.recent_investigations.length === 0) ? (
          <div className="text-center py-10 text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
            No investigations recorded yet. Click "New Investigation" above to analyze your first message.
          </div>
        ) : (
          <div className="divide-y divide-[#6C1A1A]/10 dark:divide-[#A82020]/20">
            {stats.recent_investigations.map((inv) => (
              <div key={inv.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      inv.risk_level === 'High concern'
                        ? 'bg-red-500 text-white'
                        : inv.risk_level === 'Suspicious'
                        ? 'bg-amber-500 text-white'
                        : 'bg-teal-600 text-white'
                    }`}>
                      {inv.risk_level}
                    </span>
                    <span className="text-xs font-mono opacity-70">
                      Score: {inv.risk_score.toFixed(1)}/100
                    </span>
                    {inv.is_demo && (
                      <span className="text-[10px] bg-purple-700 text-white font-bold px-1.5 py-0.2 rounded">
                        DEMO DATA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#2A0E0E] dark:text-[#F3E6D5] line-clamp-1 mt-1 font-medium">
                    {inv.input_text}
                  </p>
                </div>
                <Link
                  to={`/investigate?id=${inv.id}`}
                  className="text-xs font-bold text-[#A82020] dark:text-[#FBE6C2] hover:underline shrink-0"
                >
                  View Evidence →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
