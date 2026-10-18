import os
import uuid
import json
import hashlib
from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models.db_models import Investigation
from backend.app.models.schemas import (
    InvestigationCreate, InvestigationResponse, InvestigationGraphResponse,
    GraphNode, GraphEdge, DashboardStatsResponse, EvidenceItem, EntityItem,
    ModelPrediction, GemmaReport
)
from backend.app.engine.validator import sanitize_and_validate_input
from backend.app.engine.evidence_extractor import extract_evidence
from backend.app.engine.entity_extractor import extract_entities
from backend.app.engine.risk_scorer import compute_risk_assessment
from backend.app.ml.predictor import predictor
from backend.app.llm.report_generator import generate_gemma_report

router = APIRouter(prefix="/api", tags=["Investigations"])

@router.post("/investigations", response_model=InvestigationResponse)
async def create_investigation(
    payload: InvestigationCreate,
    db: Session = Depends(get_db)
):
    # 1. Validation & Sanitization (Rule A.7)
    clean_text, clean_url, error_msg = sanitize_and_validate_input(payload.text, payload.url)
    if error_msg:
        raise HTTPException(status_code=400, detail=error_msg)

    # 2. ML Classifiers
    message_pred = predictor.predict_message(clean_text)
    url_pred = predictor.predict_url(clean_url) if clean_url else None

    # 3. Heuristic & NLP Evidence Extraction
    evidence = extract_evidence(clean_text, clean_url)

    # 4. Masked Entity Extraction (Rule F)
    entities = extract_entities(clean_text, clean_url)

    # 5. Multi-factor Risk Scoring
    risk_level, risk_score, risk_rationale = compute_risk_assessment(
        clean_text, evidence, message_pred, url_pred, has_url=bool(clean_url)
    )

    # 6. Optional Gemma 4 LLM Analytical Report
    gemma_rep = None
    if payload.generate_ai_report:
        gemma_rep = await generate_gemma_report(
            evidence, risk_level, risk_score, message_pred, url_pred
        )

    # 7. Share-safe Summary
    share_summary = f"ScamTrace AI Analysis: {risk_level} (Risk Index: {risk_score}/100). {risk_rationale} Verified decision support; not law enforcement attribution."

    # 8. Persistence to SQLite
    inv_id = str(uuid.uuid4())
    db_item = Investigation(
        id=inv_id,
        created_at=datetime.now(timezone.utc),
        input_text=clean_text,
        url=clean_url,
        risk_level=risk_level,
        risk_score=risk_score,
        risk_rationale=risk_rationale,
        message_prediction=message_pred.model_dump() if message_pred else None,
        url_prediction=url_pred.model_dump() if url_pred else None,
        evidence=[ev.model_dump() for ev in evidence],
        entities=[ent.model_dump() for ent in entities],
        gemma_report=gemma_rep.model_dump() if gemma_rep else None,
        share_summary=share_summary,
        is_demo=payload.is_demo
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return InvestigationResponse(
        id=db_item.id,
        created_at=db_item.created_at.isoformat(),
        input_text=db_item.input_text,
        url=db_item.url,
        risk_level=db_item.risk_level,
        risk_score=db_item.risk_score,
        risk_rationale=db_item.risk_rationale,
        message_prediction=message_pred,
        url_prediction=url_pred,
        evidence=evidence,
        entities=entities,
        gemma_report=gemma_rep,
        share_summary=db_item.share_summary,
        is_demo=db_item.is_demo
    )

@router.get("/investigations", response_model=List[InvestigationResponse])
def get_investigations(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    items = db.query(Investigation).order_by(desc(Investigation.created_at)).offset(skip).limit(limit).all()
    results = []
    for item in items:
        results.append(InvestigationResponse(
            id=item.id,
            created_at=item.created_at.isoformat(),
            input_text=item.input_text,
            url=item.url,
            risk_level=item.risk_level,
            risk_score=item.risk_score,
            risk_rationale=item.risk_rationale,
            message_prediction=ModelPrediction(**item.message_prediction) if item.message_prediction else None,
            url_prediction=ModelPrediction(**item.url_prediction) if item.url_prediction else None,
            evidence=[EvidenceItem(**ev) for ev in item.evidence] if item.evidence else [],
            entities=[EntityItem(**ent) for ent in item.entities] if item.entities else [],
            gemma_report=GemmaReport(**item.gemma_report) if item.gemma_report else None,
            share_summary=item.share_summary,
            is_demo=item.is_demo
        ))
    return results

@router.get("/investigations/graph", response_model=InvestigationGraphResponse)
def get_investigation_graph(
    investigation_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Investigation)
    if investigation_id:
        query = query.filter(Investigation.id == investigation_id)
    items = query.order_by(desc(Investigation.created_at)).limit(20).all()

    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []
    seen_nodes = set()
    seen_edges = set()
    entity_investigations = defaultdict(list)

    for item in items:
        inv_node_id = f"inv-{item.id[:8]}"
        if inv_node_id not in seen_nodes:
            seen_nodes.add(inv_node_id)
            nodes.append(GraphNode(
                id=inv_node_id,
                label=f"Case #{item.id[:6]}",
                type="investigation",
                data={"risk": item.risk_level, "score": item.risk_score, "date": item.created_at.isoformat()}
            ))

        # Add entity nodes and edges
        if item.entities:
            for ent in item.entities:
                val_hash = hashlib.md5(ent["value"].encode("utf-8")).hexdigest()[:8]
                ent_node_id = f"ent-{ent['type']}-{val_hash}"
                entity_investigations[ent_node_id].append(inv_node_id)

                if ent_node_id not in seen_nodes:
                    seen_nodes.add(ent_node_id)
                    nodes.append(GraphNode(
                        id=ent_node_id,
                        label=ent["value"],
                        type=ent["type"],
                        data={"display_type": ent["display_type"], "context": ent["context"]}
                    ))

                edge_key = (inv_node_id, ent_node_id)
                if edge_key not in seen_edges:
                    seen_edges.add(edge_key)
                    edges.append(GraphEdge(
                        id=f"e-{len(edges)+1}",
                        source=inv_node_id,
                        target=ent_node_id,
                        label="CONTAINS",
                        type="CONTAINS"
                    ))

    # Add SHARES_INDICATOR_WITH edges between investigations sharing any entity
    if not investigation_id:
        for ent_id, linked_invs in entity_investigations.items():
            if len(linked_invs) >= 2:
                for i in range(len(linked_invs)):
                    for j in range(i + 1, len(linked_invs)):
                        src, tgt = linked_invs[i], linked_invs[j]
                        share_key = tuple(sorted([src, tgt]))
                        if share_key not in seen_edges:
                            seen_edges.add(share_key)
                            edges.append(GraphEdge(
                                id=f"e-share-{len(edges)+1}",
                                source=src,
                                target=tgt,
                                label="SHARES_INDICATOR_WITH",
                                type="SHARES_INDICATOR_WITH"
                            ))

    return InvestigationGraphResponse(
        investigation_id=investigation_id,
        nodes=nodes,
        edges=edges
    )

@router.get("/investigations/{inv_id}/graph", response_model=InvestigationGraphResponse)
def get_single_investigation_graph(inv_id: str, db: Session = Depends(get_db)):
    return get_investigation_graph(investigation_id=inv_id, db=db)

@router.get("/investigations/{inv_id}", response_model=InvestigationResponse)
def get_investigation_by_id(inv_id: str, db: Session = Depends(get_db)):
    item = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Investigation record not found.")

    return InvestigationResponse(
        id=item.id,
        created_at=item.created_at.isoformat(),
        input_text=item.input_text,
        url=item.url,
        risk_level=item.risk_level,
        risk_score=item.risk_score,
        risk_rationale=item.risk_rationale,
        message_prediction=ModelPrediction(**item.message_prediction) if item.message_prediction else None,
        url_prediction=ModelPrediction(**item.url_prediction) if item.url_prediction else None,
        evidence=[EvidenceItem(**ev) for ev in item.evidence] if item.evidence else [],
        entities=[EntityItem(**ent) for ent in item.entities] if item.entities else [],
        gemma_report=GemmaReport(**item.gemma_report) if item.gemma_report else None,
        share_summary=item.share_summary,
        is_demo=item.is_demo
    )

@router.delete("/investigations/{inv_id}")
def delete_investigation(
    inv_id: str,
    x_admin_passphrase: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if settings.ADMIN_PASSPHRASE and x_admin_passphrase != settings.ADMIN_PASSPHRASE:
        raise HTTPException(status_code=403, detail="Invalid admin passphrase.")

    item = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    db.delete(item)
    db.commit()
    return {"status": "success", "message": f"Investigation {inv_id} deleted."}

@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Investigation).count()
    high = db.query(Investigation).filter(Investigation.risk_level == "High concern").count()
    suspicious = db.query(Investigation).filter(Investigation.risk_level == "Suspicious").count()
    lower = db.query(Investigation).filter(Investigation.risk_level == "Lower concern").count()
    insufficient = db.query(Investigation).filter(Investigation.risk_level == "Insufficient evidence").count()

    recent_items = db.query(Investigation).order_by(desc(Investigation.created_at)).limit(5).all()
    recent = []
    for item in recent_items:
        recent.append(InvestigationResponse(
            id=item.id,
            created_at=item.created_at.isoformat(),
            input_text=item.input_text,
            url=item.url,
            risk_level=item.risk_level,
            risk_score=item.risk_score,
            risk_rationale=item.risk_rationale,
            message_prediction=ModelPrediction(**item.message_prediction) if item.message_prediction else None,
            url_prediction=ModelPrediction(**item.url_prediction) if item.url_prediction else None,
            evidence=[EvidenceItem(**ev) for ev in item.evidence] if item.evidence else [],
            entities=[EntityItem(**ent) for ent in item.entities] if item.entities else [],
            gemma_report=GemmaReport(**item.gemma_report) if item.gemma_report else None,
            share_summary=item.share_summary,
            is_demo=item.is_demo
        ))

    # Read model metrics from disk if available
    msg_metrics = None
    url_metrics = None
    msg_path = os.path.join(settings.MODELS_DIR, "message_classifier_metrics.json")
    url_path = os.path.join(settings.MODELS_DIR, "url_classifier_metrics.json")

    if os.path.exists(msg_path):
        try:
            with open(msg_path, "r", encoding="utf-8") as f:
                msg_metrics = json.load(f)
        except Exception:
            pass

    if os.path.exists(url_path):
        try:
            with open(url_path, "r", encoding="utf-8") as f:
                url_metrics = json.load(f)
        except Exception:
            pass

    return DashboardStatsResponse(
        total_investigations=total,
        high_concern_count=high,
        suspicious_count=suspicious,
        lower_concern_count=lower,
        insufficient_evidence_count=insufficient,
        recent_investigations=recent,
        message_model_metrics=msg_metrics,
        url_model_metrics=url_metrics
    )
