from datetime import datetime, timezone
from typing import List
from collections import defaultdict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database import get_db
from backend.app.models.db_models import Investigation
from backend.app.models.schemas import CampaignItem

router = APIRouter(prefix="/api", tags=["Campaigns"])

@router.get("/campaigns", response_model=List[CampaignItem])
def get_campaign_clusters(db: Session = Depends(get_db)):
    investigations = db.query(Investigation).order_by(desc(Investigation.created_at)).limit(100).all()
    if not investigations:
        return []

    # Group investigations by template hash or shared URL
    clusters_by_indicator = defaultdict(list)

    for inv in investigations:
        if inv.entities:
            for ent in inv.entities:
                if ent["type"] in ["template_hash", "url"]:
                    key = (ent["type"], ent["value"])
                    clusters_by_indicator[key].append(inv)

    results: List[CampaignItem] = []
    cluster_idx = 1

    for (ind_type, ind_val), inv_list in clusters_by_indicator.items():
        if len(inv_list) >= 1: # Include single or multi-occurrence campaigns
            first_seen = min(inv.created_at for inv in inv_list)
            last_seen = max(inv.created_at for inv in inv_list)
            
            name = f"Cluster: {ind_val}"
            if ind_type == "template_hash":
                name = f"Coordinated Template Lure #{ind_val[:8]}"
            elif ind_type == "url":
                name = f"Campaign Infrastructure ({ind_val})"

            results.append(CampaignItem(
                id=f"camp-{cluster_idx}",
                name=name,
                indicator_type=ind_type,
                indicator_value=ind_val,
                similarity_score=round(0.85 + (len(inv_list) * 0.03), 2) if len(inv_list) > 1 else 0.80,
                investigation_count=len(inv_list),
                first_seen=first_seen.isoformat(),
                last_seen=last_seen.isoformat(),
                investigation_ids=[inv.id for inv in inv_list]
            ))
            cluster_idx += 1

    # Sort by investigation count descending
    return sorted(results, key=lambda c: c.investigation_count, reverse=True)
