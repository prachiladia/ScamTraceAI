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
      <div className="pb-6 border-b border-border-subtle flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border-subtle bg-surface text-[10px] font-mono uppercase tracking-wider text-accent-primary mb-2">
            Environment & Node Configuration
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
            System & Environment Settings
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Monitor local Ollama service, model artifacts, demo mode, and deployment administrative keys.
          </p>
        </div>
        <button
          onClick={loadStatus}
          className="p-2.5 rounded-xl border border-border-subtle bg-surface hover:bg-surface-elevated text-text-secondary hover:text-accent-primary transition-all cursor-pointer"
          title="Refresh system status"
          aria-label="Refresh system status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent-primary' : ''}`} />
        </button>
      </div>

      {/* Model & Service Telemetry */}
      <div className="p-6 rounded-2xl border border-border-subtle bg-surface space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-accent-primary flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Local Service Health</span>
        </h2>

        {health ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border-subtle/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-secondary">Backend API</span>
              <div className="flex items-center gap-1.5 font-bold text-accent-secondary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Healthy (v{health.version})</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border-subtle/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-secondary">Local Ollama</span>
              <div className="flex items-center gap-1.5 font-bold">
                {health.ollama_status.reachable ? (
                  <span className="text-accent-secondary flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Reachable
                  </span>
                ) : (
                  <span className="text-risk-warning flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Offline / Standby
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border-subtle/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-secondary">ML Artifacts</span>
              <div className="font-bold">
                {health.models_status.message_classifier.trained && health.models_status.url_classifier.trained ? (
                  <span className="text-accent-secondary flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Both Models Loaded
                  </span>
                ) : (
                  <span className="text-risk-warning flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Pending Training
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-risk-warning/10 border border-risk-warning/30 text-xs text-risk-warning font-mono">
            Backend API is unreachable at the configured URL. Check if <code>python -m backend.main</code> is running.
          </div>
        )}
      </div>

      {/* Demo Mode Toggle */}
      <div className="p-6 rounded-2xl border border-border-subtle bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-sm text-text-primary">
            Explicit Demo Mode
          </h2>
          <p className="text-xs text-text-secondary max-w-md mt-0.5">
            When enabled, clearly labelled "DEMO DATA" sample fixtures appear if the backend or models are offline.
          </p>
        </div>
        <button
          onClick={() => handleToggleDemo(!demoMode)}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            demoMode
              ? 'bg-accent-primary text-[#080D18] shadow-md shadow-cyan-500/20'
              : 'border border-border-subtle bg-surface-elevated text-text-secondary hover:text-text-primary'
          }`}
        >
          {demoMode ? 'Demo Mode Active' : 'Enable Demo Mode'}
        </button>
      </div>

      {/* Admin Passphrase with Password Visibility Toggle */}
      <form onSubmit={handleSavePass} className="p-6 rounded-2xl border border-border-subtle bg-surface space-y-4">
        <div>
          <h2 className="font-bold text-sm text-text-primary">
            Admin Action Passphrase
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Required for destructive operations (e.g., permanently deleting case records) on public deployments.
          </p>
        </div>
        <div className="relative max-w-md">
          <input
            type={showPassword ? 'text' : 'password'}
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Enter passphrase configured in ADMIN_PASSPHRASE"
            className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border-subtle bg-surface-elevated text-xs font-mono text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
            className="absolute right-2.5 top-2.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-[#080D18] text-xs font-mono font-bold transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/20"
        >
          Save Passphrase
        </button>
      </form>

      {/* Reset Settings Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="text-xs text-risk-high hover:underline font-mono cursor-pointer"
        >
          Reset All Stored Settings to Default
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl border border-risk-high/30 bg-surface-elevated p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-base text-risk-high">Reset All Settings?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              This will clear your local admin keys, theme preferences, and demo mode flags from browser storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface border border-border-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="px-4 py-1.5 rounded-lg bg-risk-high text-[#080D18] text-xs font-bold shadow-md hover:bg-risk-high/90 cursor-pointer transition-colors"
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
