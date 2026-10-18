import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkBackendHealth } from '../services/api';
import type { HealthStatus } from '../types';
import { useToast } from '../components/common/Toast';

export const SettingsPage: React.FC = () => {
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('scamtrace_demo_mode') === 'true');
  const [adminPass, setAdminPass] = useState(() => localStorage.getItem('scamtrace_admin_pass') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  const { showToast } = useToast();

  const loadStatus = async () => {
    setLoading(true);
    const data = await checkBackendHealth();
    setHealth(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleToggleDemo = (enabled: boolean) => {
    setDemoMode(enabled);
    localStorage.setItem('scamtrace_demo_mode', enabled ? 'true' : 'false');
    showToast(enabled ? 'Demo Mode enabled (labelled sample fixtures active)' : 'Demo Mode disabled', 'info');
  };

  const handleSavePass = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('scamtrace_admin_pass', adminPass);
    showToast('Admin passphrase saved locally', 'success');
  };

  const handleResetSettings = () => {
    localStorage.removeItem('scamtrace_demo_mode');
    localStorage.removeItem('scamtrace_admin_pass');
    localStorage.removeItem('scamtrace_cookie_consent');
    setDemoMode(false);
    setAdminPass('');
    setShowResetModal(false);
    showToast('All local settings have been reset', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="pb-6 border-b border-[#6C1A1A]/20 dark:border-[#A82020]/30 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-[#6C1A1A] dark:text-[#F3E6D5] uppercase">
            System & Environment Settings
          </h1>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] mt-1">
            Monitor local Ollama service, model artifacts, demo mode, and deployment administrative keys.
          </p>
        </div>
        <button
          onClick={loadStatus}
          className="p-2 rounded-lg border border-[#6C1A1A]/30 dark:border-[#A82020]/40 hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D] cursor-pointer"
          title="Refresh system status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Model & Service Telemetry */}
      <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[#6C1A1A] dark:text-[#FBE6C2] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#A82020]" />
          <span>Local Service Health</span>
        </h2>

        {health ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">Backend API</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Healthy (v{health.version})</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">Local Ollama</span>
              <div className="flex items-center gap-1.5 font-bold">
                {health.ollama_status.reachable ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Reachable
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Offline / Not Running
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3E6D5] dark:bg-[#1A0707] border border-[#6C1A1A]/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7E3E3E] dark:text-[#C9B29B]">ML Artifacts</span>
              <div className="font-bold">
                {health.models_status.message_classifier.trained && health.models_status.url_classifier.trained ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Both Models Loaded
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Pending Training
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200">
            Backend API is unreachable at the configured URL. Check if <code>python -m backend.main</code> is running.
          </div>
        )}
      </div>

      {/* Demo Mode Toggle */}
      <div className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-[#2A0E0E] dark:text-[#F3E6D5]">
            Explicit Demo Mode
          </h2>
          <p className="text-xs text-[#5C2222] dark:text-[#C9B29B] max-w-md mt-0.5">
            When enabled, clearly labelled "DEMO DATA" sample fixtures appear if the backend or models are offline.
          </p>
        </div>
        <button
          onClick={() => handleToggleDemo(!demoMode)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            demoMode ? 'bg-[#A82020] text-white shadow-md' : 'bg-[#E2CEB9] dark:bg-[#3A1313] text-[#7E3E3E] dark:text-[#C9B29B]'
          }`}
        >
          {demoMode ? 'Demo Mode Active' : 'Enable Demo Mode'}
        </button>
      </div>

      {/* Admin Passphrase with Password Visibility Toggle (H.13) */}
      <form onSubmit={handleSavePass} className="p-6 rounded-2xl border border-[#6C1A1A]/20 dark:border-[#A82020]/30 bg-[#FBE6C2]/30 dark:bg-[#2A0D0D]/40 space-y-3">
        <h2 className="font-bold text-sm text-[#2A0E0E] dark:text-[#F3E6D5]">
          Admin Action Passphrase
        </h2>
        <p className="text-xs text-[#5C2222] dark:text-[#C9B29B]">
          Required for destructive operations (e.g., permanently deleting case records) on public deployments.
        </p>
        <div className="relative max-w-md">
          <input
            type={showPassword ? 'text' : 'password'}
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Enter passphrase configured in ADMIN_PASSPHRASE"
            className="w-full px-3 py-2 pr-10 rounded-xl border border-[#6C1A1A]/30 dark:border-[#A82020]/40 bg-[#F3E6D5] dark:bg-[#1A0707] text-xs text-[#2A0E0E] dark:text-[#F3E6D5] focus:outline-none focus:ring-1 focus:ring-[#A82020]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
            className="absolute right-2.5 top-2.5 text-[#7E3E3E] hover:text-[#2A0E0E] dark:hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#6C1A1A] hover:bg-[#A82020] text-[#F3E6D5] text-xs font-bold transition-colors cursor-pointer"
        >
          Save Passphrase
        </button>
      </form>

      {/* Reset Settings Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="text-xs text-red-600 hover:underline cursor-pointer"
        >
          Reset All Stored Settings to Default
        </button>
      </div>

      {/* Confirmation Modal (H.17) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl border border-red-500 bg-[#F3E6D5] dark:bg-[#1A0707] p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-red-600">Reset All Settings?</h3>
            <p className="text-xs text-[#5C2222] dark:text-[#C9B29B]">
              This will clear your local admin keys, theme preferences, and demo mode flags from browser storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#FBE6C2] dark:hover:bg-[#2A0D0D]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
