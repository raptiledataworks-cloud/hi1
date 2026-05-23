"""Application configuration from environment variables."""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # FastAPI
    SECRET_KEY: str  # Required - no default (will crash if not set)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    MONGODB_URL: str  # Required
    MONGODB_DB_NAME: str = "rupeeriser"
    
    # Google Gemini API
    GOOGLE_API_KEY: str = ""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080"
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string into list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


# Load settings from .env file
settings = Settings()

# Validate required settings
if not settings.SECRET_KEY or settings.SECRET_KEY == "your-super-secret-key-change-this-in-production":
    raise ValueError("? SECRET_KEY must be set in .env file (not the default placeholder)")
if not settings.MONGODB_URL:
    raise ValueError("❌ MONGODB_URL must be set in .env file")