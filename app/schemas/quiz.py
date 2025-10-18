from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class QuizSessionBase(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    total_questions: Optional[int] = Field(default=10, ge=1, le=100)

class QuizSessionCreate(QuizSessionBase):
    pass

class QuizSessionResponse(QuizSessionBase):
    session_id: UUID
    user_id: UUID
    status: str = "in_progress"
    correct_answers: Optional[int] = 0
    accuracy_percentage: Optional[float] = 0.0
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuizAnswerBase(BaseModel):
    question_id: UUID
    selected_option_id: Optional[UUID] = None
    is_correct: Optional[bool] = False
    time_taken_seconds: Optional[int] = Field(default=0, ge=0)

class QuizAnswerCreate(QuizAnswerBase):
    pass

class QuizAnswerResponse(QuizAnswerBase):
    answer_id: UUID
    session_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class QuizQuestionResponse(BaseModel):
    question_id: UUID
    question_text: str
    difficulty_level: str
    points: int
    options: List[dict]

    class Config:
        from_attributes = True
