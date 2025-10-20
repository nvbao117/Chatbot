from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Subject(Base): 
    __tablename__ = "subjects"  

    subject_id = Column(Integer, primary_key=True, autoincrement=True)   
    subject_name = Column(String(100), unique=True, nullable=False, index=True)  
    subject_code = Column(String(20), unique=True, nullable=False, index=True)  
    icon = Column(String(10),nullable=False)  
    description = Column(Text)  
    difficulty_level = Column(String(20),default = "Medium") 
    estimated_hours = Column(Integer,default = 0) 
    is_active = Column(Boolean, default=True, index=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()) 

    #Relationships
    topics = relationship("Topic",back_populates="subject",cascade = "all, delete-orphan") 
    conversations = relationship("Conversation", back_populates="subject", cascade="all, delete-orphan")
    quiz_questions = relationship("QuizQuestion", back_populates="subject", cascade="all, delete-orphan")
    quiz_sessions = relationship("QuizSession", back_populates="subject", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="subject", cascade="all, delete-orphan")

