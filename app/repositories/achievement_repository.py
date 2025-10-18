from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement
import uuid

class AchievementRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, achievement: Achievement) -> Achievement:
        """Tạo achievement mới"""
        self.db.add(achievement)
        self.db.commit()
        self.db.refresh(achievement)
        return achievement

    def get_by_id(self, achievement_id: str) -> Optional[Achievement]:
        """Lấy achievement theo ID"""
        try:
            a_uuid = uuid.UUID(achievement_id)
            return self.db.query(Achievement).filter(Achievement.achievement_id == a_uuid).first()
        except ValueError:
            return None

    def get_all(self, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[Achievement]:
        """Lấy danh sách achievements"""
        query = self.db.query(Achievement)
        if active_only:
            query = query.filter(Achievement.is_active == True)
        return query.offset(skip).limit(limit).all()

    def get_by_category(self, category: str, skip: int = 0, limit: int = 100) -> List[Achievement]:
        """Lấy achievements theo category"""
        return self.db.query(Achievement).filter(
            Achievement.category == category,
            Achievement.is_active == True
        ).offset(skip).limit(limit).all()

    def get_by_difficulty(self, difficulty: str, skip: int = 0, limit: int = 100) -> List[Achievement]:
        """Lấy achievements theo difficulty"""
        return self.db.query(Achievement).filter(
            Achievement.difficulty_level == difficulty,
            Achievement.is_active == True
        ).offset(skip).limit(limit).all()

    def search_achievements(self, search_term: str, skip: int = 0, limit: int = 100) -> List[Achievement]:
        """Tìm kiếm achievements"""
        search_pattern = f"%{search_term}%"
        return self.db.query(Achievement).filter(
            Achievement.is_active == True,
            (Achievement.name.ilike(search_pattern) | Achievement.description.ilike(search_pattern))
        ).offset(skip).limit(limit).all()

    def update(self, achievement_id: str, update_data: dict) -> Optional[Achievement]:
        """Cập nhật achievement"""
        achievement = self.get_by_id(achievement_id)
        if not achievement:
            return None

        for field, value in update_data.items():
            if hasattr(achievement, field):
                setattr(achievement, field, value)

        self.db.commit()
        self.db.refresh(achievement)
        return achievement

    def delete(self, achievement_id: str) -> bool:
        """Xóa achievement (soft delete)"""
        achievement = self.get_by_id(achievement_id)
        if not achievement:
            return False

        achievement.is_active = False
        self.db.commit()
        return True

class UserAchievementRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_achievement: UserAchievement) -> UserAchievement:
        """Tạo user achievement mới"""
        self.db.add(user_achievement)
        self.db.commit()
        self.db.refresh(user_achievement)
        return user_achievement

    def get_by_id(self, user_achievement_id: str) -> Optional[UserAchievement]:
        """Lấy user achievement theo ID"""
        try:
            ua_uuid = uuid.UUID(user_achievement_id)
            return self.db.query(UserAchievement).filter(UserAchievement.user_achievement_id == ua_uuid).first()
        except ValueError:
            return None

    def get_user_achievements(self, user_id: str, skip: int = 0, limit: int = 100) -> List[UserAchievement]:
        """Lấy achievements của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(UserAchievement).filter(
                UserAchievement.user_id == user_uuid
            ).order_by(UserAchievement.earned_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def get_achievement_users(self, achievement_id: str, skip: int = 0, limit: int = 100) -> List[UserAchievement]:
        """Lấy users đã đạt achievement"""
        try:
            a_uuid = uuid.UUID(achievement_id)
            return self.db.query(UserAchievement).filter(
                UserAchievement.achievement_id == a_uuid
            ).order_by(UserAchievement.earned_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def has_achievement(self, user_id: str, achievement_id: str) -> bool:
        """Kiểm tra user đã có achievement chưa"""
        try:
            user_uuid = uuid.UUID(user_id)
            a_uuid = uuid.UUID(achievement_id)
            return self.db.query(UserAchievement).filter(
                UserAchievement.user_id == user_uuid,
                UserAchievement.achievement_id == a_uuid
            ).first() is not None
        except ValueError:
            return False

    def get_user_achievement_count(self, user_id: str) -> int:
        """Đếm số achievements của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(UserAchievement).filter(UserAchievement.user_id == user_uuid).count()
        except ValueError:
            return 0

    def get_achievement_user_count(self, achievement_id: str) -> int:
        """Đếm số users đã đạt achievement"""
        try:
            a_uuid = uuid.UUID(achievement_id)
            return self.db.query(UserAchievement).filter(UserAchievement.achievement_id == a_uuid).count()
        except ValueError:
            return 0

    def get_recent_achievements(self, user_id: str, days: int = 7) -> List[UserAchievement]:
        """Lấy achievements gần đây của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            from datetime import datetime, timedelta
            since_date = datetime.utcnow() - timedelta(days=days)
            
            return self.db.query(UserAchievement).filter(
                UserAchievement.user_id == user_uuid,
                UserAchievement.earned_at >= since_date
            ).order_by(UserAchievement.earned_at.desc()).all()
        except ValueError:
            return []

    def delete(self, user_achievement_id: str) -> bool:
        """Xóa user achievement"""
        user_achievement = self.get_by_id(user_achievement_id)
        if not user_achievement:
            return False

        self.db.delete(user_achievement)
        self.db.commit()
        return True
