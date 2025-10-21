from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, DECIMAL, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from backend.app.db import Base


class QuizAnswer(Base):
    __tablename__ = "quiz_answers"
    
    answer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("quiz_sessions.session_id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("quiz_questions.question_id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option_id = Column(Integer, ForeignKey("quiz_options.option_id", ondelete="SET NULL"), nullable=True)
    user_answer_text = Column(Text)
    is_correct = Column(Boolean, default=False, index=True)
    points_earned = Column(DECIMAL(3,2), default=0.00)
    time_spent_seconds = Column(Integer, default=0)
    answered_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("QuizSession", back_populates="answers")
    question = relationship("QuizQuestion", back_populates="answers")
    user = relationship("User", back_populates="quiz_answers")
    selected_option = relationship("QuizOption", back_populates="answers")