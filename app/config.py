from pydantic_settings import BaseSettings   
from typing import Optional 

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "your_database" 
    DB_USER: str = "your_user"
    DB_PASSWORD:str = "" 
    # JWT settings
    SECRET_KEY: str = "your-super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ChatbotStudy"
    VERSION: str = "1.0.0"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    #Claude settings 
    CLAUDE_API_KEY: Optional[str] = None 

    class Config: 
        env_file = ".env" 
        case_sensitive = True  
        extra = "ignore"
    
    @property
    def DATABASE_URL(self) -> str:
        """Tạo DATABASE_URL từ các field database"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()
DATABASE_URL = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"