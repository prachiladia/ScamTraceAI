export type RiskLevel = 'Lower concern' | 'Suspicious' | 'High concern' | 'Insufficient evidence';

export interface EvidenceItem {
  id: string;
  type: string;
  matched_text: string;
  explanation: string;
  source_component: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  start_idx?: number;
  end_idx?: number;
}

export interface EntityItem {
  id: string;
  type: 'url' | 'phone' | 'email' | 'payment_id' | 'brand' | 'template_hash';
  value: string; // Masked
  display_type: string;
  context: string;
}

export interface ModelPrediction {
  model_name: string;
  model_version: string;
  predicted_class: string;
  score_type: string;
  score: number;
  features_used: string[];
  raw_scores?: Record<string, number>;
}

export interface GemmaReport {
  summary: string;
  threat_narrative: string;
  psychological_mechanisms: string[];
  likely_next_steps: string[];
  educational_analogy: string;
  executive_summary?: string;
  main_findings?: string[];
  supporting_evidence?: string[];
  contradictory_or_missing_evidence?: string[];
  uncertainties?: string[];
  user_safety_steps?: string[];
  human_verification_advisable?: boolean;
  model_identifier: string;
  generated_at: string;
  disclaimer: string;
}

export interface Investigation {
  id: string;
  created_at: string;
  input_text: string;
  url?: string;
  risk_level: RiskLevel;
  risk_score: number;
  risk_rationale: string;
  message_prediction?: ModelPrediction;
  url_prediction?: ModelPrediction;
  evidence: EvidenceItem[];
  entities: EntityItem[];
  gemma_report?: GemmaReport;
  share_summary: string;
  is_demo: boolean;
}

export interface HealthStatus {
  status: string;
  version: string;
  timestamp: string;
  models_status: {
    message_classifier: { trained: boolean; metrics_available: boolean; path?: string };
    url_classifier: { trained: boolean; metrics_available: boolean; path?: string };
  };
  ollama_status: {
    reachable: boolean;
    target_model: string;
    model_installed: boolean;
    available_models: string[];
    status_message: string;
  };
  database_status: string;
}

export interface DashboardStats {
  total_investigations: number;
  high_concern_count: number;
  suspicious_count: number;
  lower_concern_count: number;
  insufficient_evidence_count: number;
  recent_investigations: Investigation[];
  message_model_metrics?: Record<string, any>;
  url_model_metrics?: Record<string, any>;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  data: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
}

export interface InvestigationGraph {
  investigation_id?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CampaignCluster {
  id: string;
  name: string;
  indicator_type: string;
  indicator_value: string;
  similarity_score: number;
  investigation_count: number;
  first_seen: string;
  last_seen: string;
  investigation_ids: string[];
}
