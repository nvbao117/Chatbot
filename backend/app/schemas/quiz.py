# backend/app/schemas/quiz.py
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field


class QuizOptionBase(BaseModel):
    option_text: str = Field(..., min_length=1, max_length=500)
    option_order: int = 0
    is_correct: bool = False


class QuizOptionCreate(QuizOptionBase):
    pass


class QuizOptionUpdate(BaseModel):
    option_text: Optional[str] = Field(None, min_length=1, max_length=500)
    option_order: Optional[int] = None
    is_correct: Optional[bool] = None


class QuizOptionResponse(QuizOptionBase):
    option_id: UUID
    question_id: UUID

    class Config:
        from_attributes = True


class QuizQuestionBase(BaseModel):
    subject_id: UUID
    topic_id: Optional[UUID] = None
    question_text: str = Field(..., min_length=1, max_length=2000)
    question_type: str = "multiple_choice"
    difficulty_level: str = "Medium"
    points: int = Field(default=1, ge=1, le=10)
    time_limit_seconds: int = Field(default=60, ge=10, le=600)
    explanation: Optional[str] = None


class QuizQuestionCreate(QuizQuestionBase):
    options: List[QuizOptionCreate] = Field(..., min_items=2, max_items=6)


class QuizQuestionUpdate(BaseModel):
    subject_id: Optional[UUID] = None
    topic_id: Optional[UUID] = None
    question_text: Optional[str] = Field(None, min_length=1, max_length=2000)
    question_type: Optional[str] = None
    difficulty_level: Optional[str] = None
    points: Optional[int] = Field(None, ge=1, le=10)
    time_limit_seconds: Optional[int] = Field(None, ge=10, le=600)
    explanation: Optional[str] = None
    is_active: Optional[bool] = None


class QuizQuestionResponse(QuizQuestionBase):
    question_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    options: List[QuizOptionResponse] = []

    class Config:
        from_attributes = True


class QuizSessionCreate(BaseModel):
    subject_id: UUID
    topic_id: Optional[UUID] = None
    total_questions: int = Field(default=10, ge=1, le=100)
    time_limit_minutes: Optional[int] = Field(None, ge=5, le=180)


class QuizSessionUpdate(BaseModel):
    status: Optional[str] = None
    correct_answers: Optional[int] = None
    accuracy_percentage: Optional[float] = None
    completed_at: Optional[datetime] = None


class QuizSessionResponse(BaseModel):
    session_id: UUID
    user_id: UUID
    subject_id: UUID
    topic_id: Optional[UUID] = None
    total_questions: int
    correct_answers: int
    accuracy_percentage: float
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    time_limit_minutes: Optional[int] = None

    class Config:
        from_attributes = True


class QuizAnswerCreate(BaseModel):
    question_id: UUID
    selected_option_id: Optional[UUID] = None
    is_correct: Optional[bool] = None
    time_spent_seconds: int = 0
    answer_text: Optional[str] = None


class QuizAnswerResponse(BaseModel):
    answer_id: UUID
    session_id: UUID
    question_id: UUID
    user_id: UUID
    selected_option_id: Optional[UUID] = None
    is_correct: bool
    time_spent_seconds: int
    answer_text: Optional[str] = None
    answered_at: datetime

    class Config:
        from_attributes = True