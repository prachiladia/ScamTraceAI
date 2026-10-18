import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.db_models import Feedback
from backend.app.models.schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/api", tags=["Feedback"])

@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    feedback_id = str(uuid.uuid4())
    db_feedback = Feedback(
        id=feedback_id,
        created_at=datetime.now(timezone.utc),
        name=payload.name.strip(),
        email=payload.email.strip(),
        category=payload.category.strip(),
        message=payload.message.strip(),
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign
    )

    try:
        db.add(db_feedback)
        db.commit()
        db.refresh(db_feedback)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to record feedback: {str(e)}")

    return FeedbackResponse(
        id=db_feedback.id,
        status="success",
        message="Your feedback and threat report have been recorded successfully."
    )
