# backend/app/schemas/user_achievement.py
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class UserAchievementBase(BaseModel):
    user_id: UUID
    achievement_id: UUID
    points_earned: int = 0


class UserAchievementCreate(UserAchievementBase):
    pass


class UserAchievementResponse(UserAchievementBase):
    user_achievement_id: UUID
    earned_at: datetime
    is_notified: bool = False

    class Config:
        from_attributes = True


class UserAchievementSummary(BaseModel):
    total_achievements: int
    total_points: int
    recent_achievements: list[UserAchievementResponse]