import os
import sys

# Ensure repo root is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.routes import health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for ScamTrace AI - Scam investigation and education platform",
    lifespan=lifespan
)

# CORS Middleware
origins = settings.cors_origin_list
if not origins or "*" in origins:
    origins = ["*"]
else:
    # Always allow local dev frontend
    for local_origin in ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]:
        if local_origin not in origins:
            origins.append(local_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Size Limit Middleware (Rule A.7)
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.MAX_REQUEST_BODY_BYTES:
        return JSONResponse(
            status_code=413,
            content={"detail": "Request body exceeds maximum permitted size of 500 KB."}
        )
    return await call_next(request)

# Include Routers
app.include_router(health.router)

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "Don't just detect the scam. Expose the evidence behind it.",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
