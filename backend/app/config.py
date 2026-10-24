import os
from typing import List

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


def _demo_mode(value: str) -> bool:
    return value.lower() in ("true", "1", "yes")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True, extra="ignore")

    PROJECT_NAME: str = "Legal Rights Awareness Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    PORT: int = int(os.getenv("PORT", "8000"))

    # Database (defaults to local SQLite for instant zero-dependency execution)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./legal_assistant.db",
    )

    # Security & Privacy
    SECRET_KEY: str = os.getenv("SECRET_KEY", "hacktoberfest-legal-privacy-secure-key-2026")
    # Comma-separated origins, or "*" (default) so a separately hosted frontend can call the API.
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    # Document Upload Limits
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt", ".md"]

    # External AI / LLM Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    DEMO_MODE: bool = _demo_mode(os.getenv("DEMO_MODE", "true"))

    def cors_origins(self) -> List[str]:
        raw = (self.ALLOWED_ORIGINS or "*").strip()
        if raw == "*":
            return ["*"]
        origins = [item.strip() for item in raw.split(",") if item.strip()]
        return origins or ["*"]


settings = Settings()
