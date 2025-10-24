# backend/app/api/v1/endpoints/progress.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.learning_progress import LearningProgress
from backend.app.schemas.progress import ProgressCreate, ProgressUpdate, ProgressResponse

router = APIRouter()

@router.get("/", response_model=List[ProgressResponse])
def list_progress(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: UUID = Query(None),
    subject_id: UUID = Query(None),
    topic_id: UUID = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(LearningProgress).filter(LearningProgress.is_active == True)
    
    if user_id:
        query = query.filter(LearningProgress.user_id == user_id)
    if subject_id:
        query = query.filter(LearningProgress.subject_id == subject_id)
    if topic_id:
        query = query.filter(LearningProgress.topic_id == topic_id)
    
    rows = query.offset(skip).limit(limit).all()
    return [ProgressResponse.model_validate(x) for x in rows]

@router.post("/", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
def create_progress(payload: ProgressCreate, db: Session = Depends(get_db)):
    progress = LearningProgress(**payload.model_dump())
    db.add(progress)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(progress)
    return ProgressResponse.model_validate(progress)

@router.get("/{progress_id}", response_model=ProgressResponse)
def get_progress(progress_id: UUID, db: Session = Depends(get_db)):
    progress = db.query(LearningProgress).filter(LearningProgress.progress_id == progress_id).first()
    if not progress or not progress.is_active:
        raise HTTPException(status_code=404, detail="Progress not found")
    return ProgressResponse.model_validate(progress)

@router.put("/{progress_id}", response_model=ProgressResponse)
def update_progress(progress_id: UUID, payload: ProgressUpdate, db: Session = Depends(get_db)):
    progress = db.query(LearningProgress).filter(LearningProgress.progress_id == progress_id).first()
    if not progress or not progress.is_active:
        raise HTTPException(status_code=404, detail="Progress not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(progress, k, v)
    db.commit()
    db.refresh(progress)
    return ProgressResponse.model_validate(progress)