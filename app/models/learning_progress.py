from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class LearningProgress(Base):
    __tablename__ = "learning_progress"
    
    progress_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.topic_id", ondelete="CASCADE"), nullable=True, index=True)
    progress_percentage = Column(DECIMAL(5,2), default=0.00)
    total_time_minutes = Column(Integer, default=0)
    lessons_completed = Column(Integer, default=0)
    quizzes_completed = Column(Integer, default=0)
    average_score = Column(DECIMAL(5,2), default=0.00)
    last_activity_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="learning_progress")
    subject = relationship("Subject", back_populates="learning_progress")
    topic = relationship("Topic", back_populates="learning_progress")
    
    # Unique constraint
    __table_args__ = (
        {'extend_existing': True}
    )