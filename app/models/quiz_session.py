from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class QuizSession(Base):
    __tablename__ = "quiz_sessions"
    
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.topic_id", ondelete="CASCADE"), nullable=True, index=True)
    session_name = Column(String(200))
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_score = Column(DECIMAL(5,2), default=0.00)
    accuracy_percentage = Column(DECIMAL(5,2), default=0.00)
    time_spent_seconds = Column(Integer, default=0)
    status = Column(String(20), default='in_progress', index=True)  # 'in_progress', 'completed', 'abandoned'
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True, index=True)
    
    # Relationships
    user = relationship("User", back_populates="quiz_sessions")
    subject = relationship("Subject", back_populates="quiz_sessions")
    topic = relationship("Topic", back_populates="quiz_sessions")
    answers = relationship("QuizAnswer", back_populates="session", cascade="all, delete-orphan")