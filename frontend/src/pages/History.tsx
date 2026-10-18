import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, ShieldAlert, RefreshCw } from 'lucide-react';
import { fetchInvestigations, deleteInvestigation } from '../services/api';
import type { Investigation } from '../types';
import { useToast } from '../components/common/Toast';

export const History: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchInvestigations();
      setInvestigations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestigation(id);
      showToast('Investigation removed from local history', 'success');
      setConfirmDeleteId(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed. Check admin passphrase in Settings.', 'error');
    }
  };

  const filtered = investigations.filter((inv) =>
    inv.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.risk_level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.url && inv.url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30">
        <div>
          <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
            Investigation History & Case Archive
          </h1>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Browse, inspect, and manage stored forensic case records.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#FBE6C2]/40 dark:bg-[#2A0D0D]">
          <Search className="w-3.5 h-3.5 text-[#A82020]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter records..."
            className="bg-transparent text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#A82020]" />
            <span>Loading records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#7E3E3E] dark:text-[#C9B29B]">
            No investigations match your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/60 dark:bg-[#2A0D0D]/80 font-bold uppercase tracking-wider text-[#7E3E3E] dark:text-[#C9B29B]">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Threat Level</th>
                  <th className="py-3 px-4">Risk Index</th>
                  <th className="py-3 px-4">Indicators</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6C1A1A]/10 dark:divide-[#A82020]/20">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FBE6C2]/50 dark:hover:bg-[#3A1313]/30 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-[#7E3E3E] dark:text-[#C9B29B] font-mono">
                      {new Date(inv.created_at).toLocaleDateString()} {new Date(inv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium">
                      {inv.input_text}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.risk_level === 'High concern'
                          ? 'bg-red-500 text-white'
                          : inv.risk_level === 'Suspicious'
                          ? 'bg-amber-500 text-white'
                          : 'bg-teal-600 text-white'
                      }`}>
                        {inv.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold">
                      {inv.risk_score.toFixed(1)}/100
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {inv.evidence.length} flags
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/investigate?id=${inv.id}`}
                        className="text-[#A82020] dark:text-[#FBE6C2] font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(inv.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete investigation"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal (H.17) */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl border border-red-500 bg-[#F3E6D5] dark:bg-[#1A0707] p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Confirm Record Deletion</span>
            </h3>
            <p className="text-xs text-[#5C2222] dark:text-[#C9B29B]">
              Are you sure you want to permanently delete this investigation record from the local database? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
