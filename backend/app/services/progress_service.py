# backend/app/services/progress_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.learning_progress import LearningProgress
from backend.app.schemas.progress import ProgressCreate, ProgressUpdate, ProgressResponse, ProgressSummary


class ProgressService:
    def __init__(self, db: Session):
        self.db = db

    def list_progress(self, skip: int = 0, limit: int = 100, 
                     user_id: Optional[UUID] = None,
                     subject_id: Optional[UUID] = None,
                     topic_id: Optional[UUID] = None) -> List[ProgressResponse]:
        query = self.db.query(LearningProgress).filter(LearningProgress.is_active == True)
        
        if user_id:
            query = query.filter(LearningProgress.user_id == user_id)
        if subject_id:
            query = query.filter(LearningProgress.subject_id == subject_id)
        if topic_id:
            query = query.filter(LearningProgress.topic_id == topic_id)
        
        progress_records = query.offset(skip).limit(limit).all()
        return [ProgressResponse.model_validate(progress) for progress in progress_records]

    def get_progress(self, progress_id: UUID) -> Optional[LearningProgress]:
        return self.db.query(LearningProgress).filter(LearningProgress.progress_id == progress_id).first()

    def create_progress(self, payload: ProgressCreate, user_id: UUID) -> ProgressResponse:
        progress_data = payload.model_dump()
        progress_data['user_id'] = user_id
        progress = LearningProgress(**progress_data)
        self.db.add(progress)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Progress creation failed")
        self.db.refresh(progress)
        return ProgressResponse.model_validate(progress)

    def update_progress(self, progress: LearningProgress, payload: ProgressUpdate) -> ProgressResponse:
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(progress, field, value)
        self.db.commit()
        self.db.refresh(progress)
        return ProgressResponse.model_validate(progress)

    def get_user_progress_summary(self, user_id: UUID) -> ProgressSummary:
        progress_records = self.db.query(LearningProgress).filter(
            LearningProgress.user_id == user_id
        ).all()
        
        total_study_time = sum(p.total_time_minutes for p in progress_records)
        total_lessons = sum(p.lessons_completed for p in progress_records)
        total_quizzes = sum(p.quizzes_completed for p in progress_records)
        avg_score = sum(p.average_score for p in progress_records) / len(progress_records) if progress_records else 0
        
        return ProgressSummary(
            total_study_time_minutes=total_study_time,
            total_lessons_completed=total_lessons,
            total_quizzes_completed=total_quizzes,
            average_score=avg_score
        )