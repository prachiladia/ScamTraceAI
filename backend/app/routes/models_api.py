import os
import json
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.app.config import settings
from backend.app.ml.predictor import predictor
from backend.app.models.schemas import ModelPrediction

router = APIRouter(prefix="/api/models", tags=["Model Laboratory"])

class TextPredictionRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=15000)

class UrlPredictionRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048)

@router.get("/metrics")
def get_model_metrics():
    msg_path = os.path.join(settings.MODELS_DIR, "message_classifier_metrics.json")
    url_path = os.path.join(settings.MODELS_DIR, "url_classifier_metrics.json")

    msg_data = None
    url_data = None

    if os.path.exists(msg_path):
        try:
            with open(msg_path, "r", encoding="utf-8") as f:
                msg_data = json.load(f)
        except Exception as e:
            msg_data = {"error": f"Failed to parse metrics: {str(e)}"}

    if os.path.exists(url_path):
        try:
            with open(url_path, "r", encoding="utf-8") as f:
                url_data = json.load(f)
        except Exception as e:
            url_data = {"error": f"Failed to parse metrics: {str(e)}"}

    if not msg_data and not url_data:
        raise HTTPException(
            status_code=404,
            detail="Model metrics not yet generated. Run 'python -m scripts.train_all' to train models and produce evaluation benchmarks."
        )

    return {
        "message_model": msg_data,
        "url_model": url_data
    }

@router.post("/message/predict", response_model=ModelPrediction)
def predict_message_text(payload: TextPredictionRequest):
    pred = predictor.predict_message(payload.text)
    if not pred:
        raise HTTPException(status_code=503, detail="Message model artifact is not loaded. Run 'python -m scripts.train_message'.")
    return pred

@router.post("/url/predict", response_model=ModelPrediction)
def predict_url_structure(payload: UrlPredictionRequest):
    pred = predictor.predict_url(payload.url)
    if not pred:
        raise HTTPException(status_code=503, detail="URL model artifact is not loaded. Run 'python -m scripts.train_url'.")
    return pred
