import os
import httpx
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["System"])

def check_models_status() -> dict:
    models_dir = settings.MODELS_DIR
    message_model_path = os.path.join(models_dir, "message_classifier.joblib")
    message_metrics_path = os.path.join(models_dir, "message_classifier_metrics.json")
    url_model_path = os.path.join(models_dir, "url_classifier.joblib")
    url_metrics_path = os.path.join(models_dir, "url_classifier_metrics.json")

    return {
        "message_classifier": {
            "trained": os.path.exists(message_model_path),
            "metrics_available": os.path.exists(message_metrics_path),
            "path": message_model_path if os.path.exists(message_model_path) else None,
        },
        "url_classifier": {
            "trained": os.path.exists(url_model_path),
            "metrics_available": os.path.exists(url_metrics_path),
            "path": url_model_path if os.path.exists(url_model_path) else None,
        }
    }

async def check_ollama_status() -> dict:
    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/tags"
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                model_present = any(settings.OLLAMA_MODEL in m for m in models)
                return {
                    "reachable": True,
                    "target_model": settings.OLLAMA_MODEL,
                    "model_installed": model_present,
                    "available_models": models,
                    "status_message": f"Ollama is running ({len(models)} models found)"
                }
            return {
                "reachable": False,
                "target_model": settings.OLLAMA_MODEL,
                "model_installed": False,
                "available_models": [],
                "status_message": f"Ollama returned HTTP status {resp.status_code}"
            }
    except Exception as e:
        return {
            "reachable": False,
            "target_model": settings.OLLAMA_MODEL,
            "model_installed": False,
            "available_models": [],
            "status_message": f"Ollama service unreachable at {settings.OLLAMA_BASE_URL} ({type(e).__name__})"
        }

@router.get("/health", response_model=HealthResponse)
async def get_health(db: Session = Depends(get_db)):
    # Check DB
    db_status = "operational"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    models_status = check_models_status()
    ollama_status = await check_ollama_status()

    return HealthResponse(
        status="healthy" if db_status == "operational" else "degraded",
        version=settings.APP_VERSION,
        timestamp=datetime.now(timezone.utc).isoformat(),
        models_status=models_status,
        ollama_status=ollama_status,
        database_status=db_status
    )

@router.get("/settings/model-status")
async def get_model_status():
    models_status = check_models_status()
    ollama_status = await check_ollama_status()
    return {
        "models": models_status,
        "ollama": ollama_status,
        "config": {
            "ollama_base_url": settings.OLLAMA_BASE_URL,
            "ollama_model": settings.OLLAMA_MODEL,
            "models_dir": settings.MODELS_DIR,
        }
    }
