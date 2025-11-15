from __future__ import annotations
from typing import List, Sequence
from urllib.parse import quote_plus
from pydantic import Field, computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )
    
    PROJECT_NAME: str = "Chatbot Study"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database (PostgreSQL by default)
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "chatbot_study"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    DATABASE_URL: str | None = None
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = Field(default_factory=list)
    
    # Security / JWT
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Third-party integrations
    ANTHROPIC_API_KEY: str | None = None
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def _assemble_cors_origins(cls, value: Sequence[str] | str | None) -> List[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return list(value)
    
    @computed_field
    @property
    def sqlalchemy_database_uri(self) -> str:
        """Return a SQLAlchemy-compatible connection URI."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        password = f":{quote_plus(self.DB_PASSWORD)}" if self.DB_PASSWORD else ""
        return (
            f"postgresql+psycopg2://{self.DB_USER}{password}@"
            f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

settings = Settings()