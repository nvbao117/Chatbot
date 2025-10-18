from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Topic(Base):
    __tablename__ = "topics"
    
    topic_id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id", ondelete="CASCADE"), nullable=False, index=True)
    topic_name = Column(String(200), nullable=False)
    topic_description = Column(String(500))
    order_index = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    subject = relationship("Subject", back_populates="topics")
    quiz_questions = relationship("QuizQuestion", back_populates="topic", cascade="all, delete-orphan")
    quiz_sessions = relationship("QuizSession", back_populates="topic", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="topic", cascade="all, delete-orphan")

    