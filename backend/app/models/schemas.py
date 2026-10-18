from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    models_status: Dict[str, Any]
    ollama_status: Dict[str, Any]
    database_status: str

class EvidenceItem(BaseModel):
    id: str
    type: str # urgency_threat, otp_credential, payment_demand, prize_lure, brand_impersonation, suspicious_url, contact_manipulation
    matched_text: str
    explanation: str
    source_component: str
    severity: str # "high", "medium", "low"
    confidence: float # 0.0 to 1.0
    start_idx: Optional[int] = None
    end_idx: Optional[int] = None

class EntityItem(BaseModel):
    id: str
    type: str # "url", "phone", "email", "payment_id", "brand", "template_hash"
    value: str # Masked for privacy
    display_type: str
    context: str

class GemmaReport(BaseModel):
    summary: str
    threat_narrative: str
    psychological_mechanisms: List[str]
    likely_next_steps: List[str]
    educational_analogy: str
    executive_summary: Optional[str] = None
    main_findings: Optional[List[str]] = None
    supporting_evidence: Optional[List[str]] = None
    contradictory_or_missing_evidence: Optional[List[str]] = None
    uncertainties: Optional[List[str]] = None
    user_safety_steps: Optional[List[str]] = None
    human_verification_advisable: Optional[bool] = True
    model_identifier: str = "Gemma 4 (Ollama)"
    generated_at: str = ""
    disclaimer: str = "Synthesized by local Gemma 4 model from structured forensic indicators. Decision support only; not legal evidence."

class ModelPrediction(BaseModel):
    model_name: str
    model_version: str
    predicted_class: str # "spam_related" / "neutral_ham" or "phishing_url" / "legitimate_url"
    score_type: str # "calibrated_probability" or "decision_score"
    score: float # 0.0 to 1.0
    features_used: List[str]
    raw_scores: Optional[Dict[str, float]] = None

class InvestigationCreate(BaseModel):
    text: str = Field(..., min_length=3, max_length=15000, description="Raw message text to investigate")
    url: Optional[str] = Field(None, max_length=2048, description="Optional raw URL associated with message")
    generate_ai_report: bool = Field(True, description="Whether to request an LLM analytical report")
    is_demo: bool = Field(False, description="Flag indicating if this is an explicit demo fixture")

class InvestigationResponse(BaseModel):
    id: str
    created_at: str
    input_text: str
    url: Optional[str] = None
    risk_level: str # "Lower concern", "Suspicious", "High concern", "Insufficient evidence"
    risk_score: float # 0.0 to 100.0
    risk_rationale: str
    message_prediction: Optional[ModelPrediction] = None
    url_prediction: Optional[ModelPrediction] = None
    evidence: List[EvidenceItem]
    entities: List[EntityItem]
    gemma_report: Optional[GemmaReport] = None
    share_summary: str
    is_demo: bool = False

class GraphNode(BaseModel):
    id: str
    label: str
    type: str # "investigation", "url", "phone", "email", "payment_id", "brand", "template"
    data: Dict[str, Any]

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    type: str # "CONTAINS", "MATCHES_TEMPLATE", "SHARES_INDICATOR_WITH"

class InvestigationGraphResponse(BaseModel):
    investigation_id: Optional[str] = None
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class CampaignItem(BaseModel):
    id: str
    name: str
    indicator_type: str
    indicator_value: str
    similarity_score: float
    investigation_count: int
    first_seen: str
    last_seen: str
    investigation_ids: List[str]

class FeedbackCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=200)
    category: str = Field(..., min_length=2, max_length=50)
    message: str = Field(..., min_length=5, max_length=3000)
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    status: str
    message: str

class DashboardStatsResponse(BaseModel):
    total_investigations: int
    high_concern_count: int
    suspicious_count: int
    lower_concern_count: int
    insufficient_evidence_count: int
    recent_investigations: List[InvestigationResponse]
    message_model_metrics: Optional[Dict[str, Any]] = None
    url_model_metrics: Optional[Dict[str, Any]] = None
