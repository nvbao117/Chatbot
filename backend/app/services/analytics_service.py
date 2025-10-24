# backend/app/services/analytics_service.py
from typing import Dict, Any, List
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from backend.app.models.user import User
from backend.app.models.learning_progress import LearningProgress
from backend.app.models.quiz_session import QuizSession
from backend.app.models.achievement import Achievement
from backend.app.models.user_achievement import UserAchievement
from backend.app.models.conversation import Conversation


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_stats(self) -> Dict[str, Any]:
        total_users = self.db.query(User).filter(User.is_active == True).count()
        total_progress = self.db.query(LearningProgress).filter(LearningProgress.is_active == True).count()
        total_quiz_sessions = self.db.query(QuizSession).filter(QuizSession.is_active == True).count()
        total_achievements = self.db.query(Achievement).filter(Achievement.is_active == True).count()
        total_conversations = self.db.query(Conversation).filter(Conversation.is_active == True).count()
        
        return {
            "total_users": total_users,
            "total_progress_records": total_progress,
            "total_quiz_sessions": total_quiz_sessions,
            "total_achievements": total_achievements,
            "total_conversations": total_conversations
        }

    def get_user_stats(self, user_id: UUID) -> Dict[str, Any]:
        user = self.db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        progress_count = self.db.query(LearningProgress).filter(LearningProgress.user_id == user_id).count()
        quiz_sessions = self.db.query(QuizSession).filter(QuizSession.user_id == user_id).count()
        achievements = self.db.query(UserAchievement).filter(UserAchievement.user_id == user_id).count()
        conversations = self.db.query(Conversation).filter(Conversation.user_id == user_id).count()
        
        return {
            "user_id": str(user_id),
            "progress_records": progress_count,
            "quiz_sessions": quiz_sessions,
            "achievements_earned": achievements,
            "conversations": conversations
        }

    def get_learning_analytics(self, user_id: UUID, days: int = 30) -> Dict[str, Any]:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Daily study time
        daily_progress = self.db.query(
            func.date(LearningProgress.last_activity_at).label('date'),
            func.sum(LearningProgress.total_time_minutes).label('minutes')
        ).filter(
            LearningProgress.user_id == user_id,
            LearningProgress.last_activity_at >= start_date
        ).group_by(func.date(LearningProgress.last_activity_at)).all()
        
        daily_study_time = {str(record.date): record.minutes for record in daily_progress}
        
        # Subject progress
        subject_progress = self.db.query(LearningProgress).filter(
            LearningProgress.user_id == user_id
        ).all()
        
        return {
            "daily_study_time": daily_study_time,
            "subject_progress": [{"subject_id": str(p.subject_id), "progress": p.progress_percentage} for p in subject_progress],
            "total_study_days": len(daily_study_time),
            "average_daily_time": sum(daily_study_time.values()) / len(daily_study_time) if daily_study_time else 0
        }