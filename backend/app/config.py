import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "ScamTrace AI API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    
    # Network & Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,https://prachiladia.github.io"
    
    # Database
    DATABASE_URL: str = "sqlite:///./scamtrace.db"
    
    # Local LLM (Ollama / Gemma)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma4:e2b"
    OLLAMA_TIMEOUT_SECONDS: float = 45.0
    
    # Models & Artifacts Directory
    MODELS_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models"))
    
    # Admin Security
    ADMIN_PASSPHRASE: str = "scamtrace-admin-secret"
    
    # Request limits
    MAX_REQUEST_BODY_BYTES: int = 500_000 # 500 KB limit for security

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
