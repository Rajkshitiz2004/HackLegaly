import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy import text

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
import backend.app.models
from backend.app.seed_data.seed_database import seed_database
from backend.app.api.jurisdictions import router as jurisdictions_router
from backend.app.api.assistant import router as assistant_router
from backend.app.api.privacy import router as privacy_router
from backend.app.api.documents import router as documents_router
from backend.app.api.compare import router as compare_router
from backend.app.api.knowledge import router as knowledge_router
from backend.app.api.resources import router as resources_router
from backend.app.api.checklists import router as checklists_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("legal_assistant")

FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist and seed database on startup
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Database initialized and verified.")
    except Exception as e:
        logger.error(f"Error during startup seed: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Privacy-First India Legal Rights Awareness Assistant & Document Simplifier API.",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS Middleware — localhost-only origins break every split frontend/backend deploy.
cors_origins = settings.cors_origins()
allow_credentials = "*" not in cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response

# Include Routers
app.include_router(jurisdictions_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(privacy_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(compare_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_router, prefix=settings.API_V1_STR)
app.include_router(resources_router, prefix=settings.API_V1_STR)
app.include_router(checklists_router, prefix=settings.API_V1_STR)

def _api_root_payload():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/api/docs",
        "jurisdiction": "India (Central & States)",
        "privacy": "Zero-Knowledge Ephemeral Redaction Gate Enforced",
    }


@app.get("/")
def root():
    index = FRONTEND_DIST / "index.html"
    if index.is_file():
        return FileResponse(index)
    return _api_root_payload()


@app.get("/api/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        return JSONResponse(
            {"status": "degraded", "database": str(exc)},
            status_code=503,
        )


@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """Serve the production frontend so /api relative calls hit this same host."""
    if full_path.startswith("api"):
        return JSONResponse({"detail": "Not Found"}, status_code=404)

    index = FRONTEND_DIST / "index.html"
    if not index.is_file():
        return JSONResponse(_api_root_payload())

    candidate = FRONTEND_DIST / full_path
    if candidate.is_file():
        return FileResponse(candidate)
    return FileResponse(index)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
