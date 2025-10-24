# backend/app/api/v1/endpoints/analytics.py
from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from backend.app.api.deps import get_db
from backend.app.models.user import User
from backend.app.models.learning_progress import LearningProgress
from backend.app.models.quiz_session import QuizSession
from backend.app.models.achievement import Achievement
from backend.app.models.user_achievement import UserAchievement

router = APIRouter()

@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).filter(User.is_active == True).count()
    total_progress = db.query(LearningProgress).filter(LearningProgress.is_active == True).count()
    total_quiz_sessions = db.query(QuizSession).filter(QuizSession.is_active == True).count()
    total_achievements = db.query(Achievement).filter(Achievement.is_active == True).count()
    
    return {
        "total_users": total_users,
        "total_progress_records": total_progress,
        "total_quiz_sessions": total_quiz_sessions,
        "total_achievements": total_achievements
    }

@router.get("/user/{user_id}/stats", response_model=Dict[str, Any])
def get_user_stats(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    progress_count = db.query(LearningProgress).filter(LearningProgress.user_id == user_id).count()
    quiz_sessions = db.query(QuizSession).filter(QuizSession.user_id == user_id).count()
    achievements = db.query(UserAchievement).filter(UserAchievement.user_id == user_id).count()
    
    return {
        "user_id": str(user_id),
        "progress_records": progress_count,
        "quiz_sessions": quiz_sessions,
        "achievements_earned": achievements
    }

@router.get("/topics/popular", response_model=List[Dict[str, Any]])
def get_popular_topics(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    # This would need a proper join with topics table
    # For now, returning mock data structure
    return [
        {"topic_id": "uuid", "topic_name": "Sample Topic", "progress_count": 5}
        for _ in range(min(limit, 5))
    ]