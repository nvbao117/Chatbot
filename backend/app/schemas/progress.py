# backend/app/schemas/progress.py
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ProgressBase(BaseModel):
    subject_id: UUID
    topic_id: Optional[UUID] = None
    progress_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    total_time_minutes: int = Field(default=0, ge=0)
    lessons_completed: int = Field(default=0, ge=0)
    quizzes_completed: int = Field(default=0, ge=0)
    average_score: float = Field(default=0.0, ge=0.0, le=100.0)


class ProgressCreate(ProgressBase):
    pass


class ProgressUpdate(BaseModel):
    subject_id: Optional[UUID] = None
    topic_id: Optional[UUID] = None
    progress_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    total_time_minutes: Optional[int] = Field(None, ge=0)
    lessons_completed: Optional[int] = Field(None, ge=0)
    quizzes_completed: Optional[int] = Field(None, ge=0)
    average_score: Optional[float] = Field(None, ge=0.0, le=100.0)


class ProgressResponse(ProgressBase):
    progress_id: UUID
    user_id: UUID
    last_activity_at: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProgressSummary(BaseModel):
    total_study_time_minutes: int
    total_lessons_completed: int
    total_quizzes_completed: int
    average_score: float
    subjects_in_progress: int
    topics_completed: int


class ProgressAnalytics(BaseModel):
    daily_study_time: dict[str, int]  # date -> minutes
    subject_progress: list[ProgressResponse]
    weekly_goals: dict[str, int]
    streak_days: int