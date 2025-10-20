from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class QuizOption(Base):
    __tablename__ = "quiz_options"
    
    option_id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("quiz_questions.question_id", ondelete="CASCADE"), nullable=False, index=True)
    option_text = Column(Text, nullable=False)
    option_order = Column(Integer, nullable=False, index=True)
    is_correct = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    question = relationship("QuizQuestion", back_populates="options")
    answers = relationship("QuizAnswer", back_populates="selected_option", cascade="all, delete-orphan")