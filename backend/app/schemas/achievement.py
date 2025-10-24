# backend/app/schemas/achievement.py
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class AchievementBase(BaseModel):
    achievement_name: str = Field(..., min_length=1, max_length=200)
    achievement_description: Optional[str] = None
    icon: Optional[str] = None
    category: str = "learning"
    points_required: int = Field(default=0, ge=0)
    badge_color: Optional[str] = None
    is_hidden: bool = False


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    achievement_name: Optional[str] = Field(None, min_length=1, max_length=200)
    achievement_description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    points_required: Optional[int] = Field(None, ge=0)
    badge_color: Optional[str] = None
    is_hidden: Optional[bool] = None
    is_active: Optional[bool] = None


class AchievementResponse(AchievementBase):
    achievement_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AchievementProgress(BaseModel):
    achievement_id: UUID
    achievement_name: str
    progress_percentage: float
    points_earned: int
    points_required: int
    is_unlocked: bool