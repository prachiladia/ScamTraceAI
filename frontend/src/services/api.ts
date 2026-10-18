import type {
  Investigation,
  InvestigationGraph,
  HealthStatus,
  DashboardStats,
  CampaignCluster,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isDemoMode(): boolean {
  return localStorage.getItem('scamtrace_demo_mode') === 'true';
}

export function getAdminPassphrase(): string {
  return localStorage.getItem('scamtrace_admin_pass') || '';
}

// Demo fixture for when user explicitly enables demo mode
export const DEMO_INVESTIGATIONS: Investigation[] = [
  {
    id: 'demo-inv-001',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    input_text: 'URGENT: Your State Bank account 4921 has been suspended due to pending KYC verification. Update immediately at http://sbi-kyc-verify-portal.top/login or your funds will be frozen within 2 hours.',
    url: 'http://sbi-kyc-verify-portal.top/login',
    risk_level: 'High concern',
    risk_score: 94.5,
    risk_rationale: 'High urgency threat, account suspension claim, credential phishing lure, and highly suspicious non-banking TLD (.top) matching impersonation patterns.',
    message_prediction: {
      model_name: 'MessageClassifier-TFIDF-LR',
      model_version: 'v1.0.0',
      predicted_class: 'spam_related',
      score_type: 'calibrated_probability',
      score: 0.982,
      features_used: ['urgent', 'suspended', 'kyc', 'frozen', 'hours', 'account'],
    },
    url_prediction: {
      model_name: 'LexicalUrlClassifier-RF',
      model_version: 'v1.0.0',
      predicted_class: 'phishing_url',
      score_type: 'decision_score',
      score: 0.965,
      features_used: ['url_length', 'num_hyphens', 'suspicious_tld', 'subdomain_count'],
    },
    evidence: [
      {
        id: 'ev-1',
        type: 'urgency_threat',
        matched_text: 'URGENT: ... within 2 hours',
        explanation: 'Imposes an artificial critical deadline to induce anxiety and panic.',
        source_component: 'rule_heuristic',
        severity: 'high',
        confidence: 0.95,
        start_idx: 0,
        end_idx: 7,
      },
      {
        id: 'ev-2',
        type: 'account_suspension',
        matched_text: 'account 4921 has been suspended',
        explanation: 'Falsely claims account deactivation or freeze to elicit immediate action.',
        source_component: 'rule_heuristic',
        severity: 'high',
        confidence: 0.92,
        start_idx: 20,
        end_idx: 50,
      },
      {
        id: 'ev-3',
        type: 'brand_impersonation',
        matched_text: 'State Bank',
        explanation: 'Impersonates a recognized national financial institution.',
        source_component: 'entity_recognition',
        severity: 'high',
        confidence: 0.90,
        start_idx: 13,
        end_idx: 23,
      },
      {
        id: 'ev-4',
        type: 'suspicious_url',
        matched_text: 'http://sbi-kyc-verify-portal.top/login',
        explanation: 'Deceptive domain using multiple hyphens and high-risk .top TLD.',
        source_component: 'lexical_url',
        severity: 'high',
        confidence: 0.94,
        start_idx: 88,
        end_idx: 126,
      },
    ],
    entities: [
      {
        id: 'ent-1',
        type: 'brand',
        value: 'State Bank of India',
        display_type: 'Impersonated Entity',
        context: 'Bank account KYC verification context',
      },
      {
        id: 'ent-2',
        type: 'url',
        value: 'sbi-***.top/login',
        display_type: 'Phishing Domain',
        context: 'Direct credential harvesting landing page',
      },
    ],
    gemma_report: {
      summary: 'DEMO REPORT: Highly dangerous credential harvesting attack actively impersonating SBI with urgency coercion.',
      threat_narrative: 'Victim is coerced with immediate banking suspension unless they access an unauthorized domain to supply credentials.',
      psychological_mechanisms: ['Artificial Urgency', 'Fear of Account Loss', 'Authority Impersonation'],
      likely_next_steps: ['Harvest banking credentials and OTP', 'Initiate unauthorized fund transfers'],
      educational_analogy: 'Like a scammer outside a bank branch handing you a fake deposit slip to write down your PIN.',
      executive_summary: 'DEMO REPORT: Highly dangerous credential harvesting attack actively impersonating SBI with urgency coercion.',
      main_findings: [
        'Sender is employing coercive time pressure (2 hour deadline).',
        'Direct link directs to an unauthorized third-party top-level domain (.top).',
        'Official banks do not mandate external link clicks for KYC compliance.',
      ],
      supporting_evidence: [
        'Extracted keyword match on account suspension.',
        'Lexical URL model rated destination domain >95% probability phishing.',
      ],
      contradictory_or_missing_evidence: [
        'No direct telephone contact provided in message.',
      ],
      uncertainties: [
        'Specific threat group attribution cannot be determined from lexical features alone.',
      ],
      user_safety_steps: [
        'Do not click the link or provide credentials.',
        'Report SMS to Indian National Cybercrime Helpline 1930 / cybercrime.gov.in.',
        'Block sender number on device.',
        'Log in solely via official NetBanking or verified mobile app.',
      ],
      human_verification_advisable: true,
      model_identifier: 'Gemma 4 (Local Demo Fixture)',
      generated_at: new Date().toISOString(),
      disclaimer: 'DEMO DATA ONLY. Provided for interface preview purposes.',
    },
    share_summary: 'SCAM ALERT: Deceptive SBI KYC suspension message detected with malicious link http://sbi-kyc-verify-portal.top/login. Verified High Concern.',
    is_demo: true,
  },
];

export async function checkBackendHealth(): Promise<HealthStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
    if (!res.ok) throw new ApiError('Failed to fetch dashboard stats', res.status);
    return await res.json();
  } catch (err) {
    if (isDemoMode()) {
      return {
        total_investigations: 1,
        high_concern_count: 1,
        suspicious_count: 0,
        lower_concern_count: 0,
        insufficient_evidence_count: 0,
        recent_investigations: DEMO_INVESTIGATIONS,
        message_model_metrics: { accuracy: 0.985, f1: 0.983, model: 'TF-IDF Logistic Regression' },
        url_model_metrics: { accuracy: 0.962, f1: 0.961, model: 'Lexical Random Forest' },
      };
    }
    throw err;
  }
}

export async function createInvestigation(data: {
  text: string;
  url?: string;
  generate_ai_report?: boolean;
}): Promise<Investigation> {
  const res = await fetch(`${API_BASE_URL}/api/investigations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new ApiError(errData.detail || 'Investigation failed', res.status);
  }
  return await res.json();
}

export async function fetchInvestigations(): Promise<Investigation[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/investigations`);
    if (!res.ok) throw new ApiError('Failed to fetch investigations', res.status);
    return await res.json();
  } catch (err) {
    if (isDemoMode()) {
      return DEMO_INVESTIGATIONS;
    }
    throw err;
  }
}

export async function fetchInvestigationById(id: string): Promise<Investigation> {
  if (isDemoMode() && id.startsWith('demo-')) {
    const found = DEMO_INVESTIGATIONS.find((i) => i.id === id);
    if (found) return found;
  }
  const res = await fetch(`${API_BASE_URL}/api/investigations/${id}`);
  if (!res.ok) throw new ApiError('Investigation not found', res.status);
  return await res.json();
}

export async function deleteInvestigation(id: string): Promise<void> {
  const passphrase = getAdminPassphrase();
  const res = await fetch(`${API_BASE_URL}/api/investigations/${id}`, {
    method: 'DELETE',
    headers: passphrase ? { 'X-Admin-Passphrase': passphrase } : {},
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new ApiError(errData.detail || 'Deletion failed', res.status);
  }
}

export async function fetchGraphData(investigationId?: string): Promise<InvestigationGraph> {
  const query = investigationId ? `?investigation_id=${investigationId}` : '';
  try {
    const res = await fetch(`${API_BASE_URL}/api/investigations/graph${query}`);
    if (!res.ok) throw new ApiError('Failed to load graph', res.status);
    return await res.json();
  } catch (err) {
    if (isDemoMode()) {
      return {
        investigation_id: 'demo-inv-001',
        nodes: [
          { id: 'n-inv-1', label: 'Investigation #001', type: 'investigation', data: { risk: 'High concern', score: 94.5 } },
          { id: 'n-url-1', label: 'sbi-***.top', type: 'url', data: { is_phishing: true } },
          { id: 'n-brand-1', label: 'State Bank', type: 'brand', data: { sector: 'Finance' } },
        ],
        edges: [
          { id: 'e-1', source: 'n-inv-1', target: 'n-url-1', label: 'CONTAINS', type: 'CONTAINS' },
          { id: 'e-2', source: 'n-inv-1', target: 'n-brand-1', label: 'IMPERSONATES', type: 'IMPERSONATES' },
        ],
      };
    }
    throw err;
  }
}

export async function fetchCampaigns(): Promise<CampaignCluster[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/campaigns`);
    if (!res.ok) throw new ApiError('Failed to load campaigns', res.status);
    return await res.json();
  } catch (err) {
    if (isDemoMode()) {
      return [
        {
          id: 'camp-demo-1',
          name: 'SBI KYC Suspension Phishing Wave',
          indicator_type: 'url_pattern',
          indicator_value: '*-kyc-verify-portal.top',
          similarity_score: 0.94,
          investigation_count: 14,
          first_seen: new Date(Date.now() - 86400000 * 3).toISOString(),
          last_seen: new Date().toISOString(),
          investigation_ids: ['demo-inv-001'],
        },
      ];
    }
    throw err;
  }
}

export async function fetchModelMetrics(): Promise<{
  message_model: any;
  url_model: any;
}> {
  const res = await fetch(`${API_BASE_URL}/api/models/metrics`);
  if (!res.ok) throw new ApiError('Failed to load metrics', res.status);
  return await res.json();
}

export async function submitFeedback(data: {
  name: string;
  email: string;
  category: string;
  message: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}): Promise<{ id: string; status: string; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new ApiError(errData.detail || 'Feedback submission failed', res.status);
  }
  return await res.json();
}
