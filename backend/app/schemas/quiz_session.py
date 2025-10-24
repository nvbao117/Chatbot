# backend/app/schemas/quiz_session.py
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class QuizSessionCreate(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    total_questions: int = Field(default=10, ge=1, le=100)
    time_spent_seconds: Optional[int] = Field(None, ge=5, le=180)


class QuizSessionUpdate(BaseModel):
    status: Optional[str] = None
    correct_answers: Optional[int] = None
    accuracy_percentage: Optional[float] = None
    completed_at: Optional[datetime] = None


class QuizSessionResponse(BaseModel):
    session_id: UUID
    user_id: UUID
    subject_id: int
    topic_id: Optional[int] = None
    total_questions: int
    correct_answers: int
    accuracy_percentage: float
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    time_spent_seconds: Optional[int] = None

    class Config:
        from_attributes = True