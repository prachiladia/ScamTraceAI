import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, JSON
from backend.app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=utc_now, nullable=False, index=True)
    input_text = Column(Text, nullable=False)
    url = Column(String(2048), nullable=True)
    risk_level = Column(String(32), nullable=False, index=True) # Lower concern, Suspicious, High concern, Insufficient evidence
    risk_score = Column(Float, nullable=False) # 0.0 to 100.0
    risk_rationale = Column(Text, nullable=False)
    message_prediction = Column(JSON, nullable=True)
    url_prediction = Column(JSON, nullable=True)
    evidence = Column(JSON, nullable=False, default=list)
    entities = Column(JSON, nullable=False, default=list)
    gemma_report = Column(JSON, nullable=True)
    share_summary = Column(Text, nullable=False)
    is_demo = Column(Boolean, default=False, nullable=False)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    name = Column(String(128), nullable=False)
    email = Column(String(256), nullable=False)
    category = Column(String(64), nullable=False)
    message = Column(Text, nullable=False)
    utm_source = Column(String(128), nullable=True)
    utm_medium = Column(String(128), nullable=True)
    utm_campaign = Column(String(128), nullable=True)

class CampaignCluster(Base):
    __tablename__ = "campaign_clusters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(256), nullable=False)
    indicator_type = Column(String(64), nullable=False)
    indicator_value = Column(String(512), nullable=False, index=True)
    similarity_score = Column(Float, nullable=False)
    first_seen = Column(DateTime, default=utc_now, nullable=False)
    last_seen = Column(DateTime, default=utc_now, nullable=False)
    investigation_ids = Column(JSON, nullable=False, default=list)
