# backend/app/api/v1/endpoints/achievements.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.achievement import Achievement
from backend.app.models.user_achievement import UserAchievement
from backend.app.schemas.achievement import AchievementCreate, AchievementUpdate, AchievementResponse
from backend.app.schemas.user_achievement import UserAchievementResponse

router = APIRouter()

@router.get("/", response_model=List[AchievementResponse])
def list_achievements(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Achievement)
        .filter(Achievement.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [AchievementResponse.model_validate(x) for x in rows]

@router.post("/", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
def create_achievement(payload: AchievementCreate, db: Session = Depends(get_db)):
    achievement = Achievement(**payload.model_dump())
    db.add(achievement)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(achievement)
    return AchievementResponse.model_validate(achievement)

@router.get("/{achievement_id}", response_model=AchievementResponse)
def get_achievement(achievement_id: UUID, db: Session = Depends(get_db)):
    achievement = db.query(Achievement).filter(Achievement.achievement_id == achievement_id).first()
    if not achievement or not achievement.is_active:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return AchievementResponse.model_validate(achievement)

@router.get("/user/{user_id}", response_model=List[UserAchievementResponse])
def list_user_achievements(
    user_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [UserAchievementResponse.model_validate(x) for x in rows]