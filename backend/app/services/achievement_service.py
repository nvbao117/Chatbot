# backend/app/services/achievement_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.achievement import Achievement
from backend.app.models.user_achievement import UserAchievement
from backend.app.schemas.achievement import AchievementCreate, AchievementUpdate, AchievementResponse
from backend.app.schemas.user_achievement import UserAchievementResponse


class AchievementService:
    def __init__(self, db: Session):
        self.db = db

    def list_achievements(self, skip: int = 0, limit: int = 100) -> List[AchievementResponse]:
        achievements = (
            self.db.query(Achievement)
            .filter(Achievement.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [AchievementResponse.model_validate(achievement) for achievement in achievements]

    def get_achievement(self, achievement_id: UUID) -> Optional[Achievement]:
        return self.db.query(Achievement).filter(Achievement.achievement_id == achievement_id).first()

    def create_achievement(self, payload: AchievementCreate) -> AchievementResponse:
        achievement = Achievement(**payload.model_dump())
        self.db.add(achievement)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Achievement creation failed")
        self.db.refresh(achievement)
        return AchievementResponse.model_validate(achievement)

    def list_user_achievements(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[UserAchievementResponse]:
        user_achievements = (
            self.db.query(UserAchievement)
            .filter(UserAchievement.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [UserAchievementResponse.model_validate(ua) for ua in user_achievements]

    def award_achievement(self, user_id: UUID, achievement_id: UUID) -> UserAchievementResponse:
        # Check if user already has this achievement
        existing = self.db.query(UserAchievement).filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement_id
        ).first()
        
        if existing:
            raise ValueError("User already has this achievement")
        
        achievement = self.get_achievement(achievement_id)
        if not achievement:
            raise ValueError("Achievement not found")
        
        user_achievement = UserAchievement(
            user_id=user_id,
            achievement_id=achievement_id,
            points_earned=achievement.points_required
        )
        self.db.add(user_achievement)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Failed to award achievement")
        self.db.refresh(user_achievement)
        return UserAchievementResponse.model_validate(user_achievement)