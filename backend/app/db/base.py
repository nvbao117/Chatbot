from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base 
from backend.app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL,pool_pre_ping=True) 
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()