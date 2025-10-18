from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.learning_progress import LearningProgress
import uuid

class ProgressRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, progress: LearningProgress) -> LearningProgress:
        """Tạo learning progress mới"""
        self.db.add(progress)
        self.db.commit()
        self.db.refresh(progress)
        return progress

    def get_by_id(self, progress_id: str) -> Optional[LearningProgress]:
        """Lấy progress theo ID"""
        try:
            p_uuid = uuid.UUID(progress_id)
            return self.db.query(LearningProgress).filter(LearningProgress.progress_id == p_uuid).first()
        except ValueError:
            return None

    def get_user_progress(self, user_id: str, skip: int = 0, limit: int = 100) -> List[LearningProgress]:
        """Lấy progress của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid
            ).order_by(LearningProgress.last_activity_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def get_by_subject(self, user_id: str, subject_id: int) -> Optional[LearningProgress]:
        """Lấy progress theo subject"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid,
                LearningProgress.subject_id == subject_id,
                LearningProgress.topic_id.is_(None)
            ).first()
        except ValueError:
            return None

    def get_by_topic(self, user_id: str, subject_id: int, topic_id: int) -> Optional[LearningProgress]:
        """Lấy progress theo topic"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid,
                LearningProgress.subject_id == subject_id,
                LearningProgress.topic_id == topic_id
            ).first()
        except ValueError:
            return None

    def update_or_create(self, user_id: str, subject_id: int, topic_id: int = None, **kwargs) -> LearningProgress:
        """Cập nhật hoặc tạo progress mới"""
        try:
            user_uuid = uuid.UUID(user_id)
            
            # Tìm progress hiện tại
            progress = self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid,
                LearningProgress.subject_id == subject_id,
                LearningProgress.topic_id == topic_id
            ).first()

            if progress:
                # Cập nhật progress hiện tại
                for key, value in kwargs.items():
                    if hasattr(progress, key):
                        if key in ['total_time_minutes', 'lessons_completed', 'quizzes_completed']:
                            # Cộng dồn cho các trường này
                            current_value = getattr(progress, key) or 0
                            setattr(progress, key, current_value + value)
                        elif key == 'average_score':
                            # Tính điểm trung bình mới
                            current_score = progress.average_score or 0
                            new_score = value
                            progress.average_score = (current_score + new_score) / 2
                        else:
                            setattr(progress, key, value)
            else:
                # Tạo progress mới
                progress = LearningProgress(
                    user_id=user_uuid,
                    subject_id=subject_id,
                    topic_id=topic_id,
                    **kwargs
                )
                self.db.add(progress)

            self.db.commit()
            self.db.refresh(progress)
            return progress
        except ValueError:
            raise ValueError("Invalid user_id format")

    def get_user_statistics(self, user_id: str) -> dict:
        """Lấy thống kê tổng quan của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            
            # Tổng thời gian học
            total_time = self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid
            ).with_entities(
                self.db.func.sum(LearningProgress.total_time_minutes)
            ).scalar() or 0

            # Tổng số bài học hoàn thành
            total_lessons = self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid
            ).with_entities(
                self.db.func.sum(LearningProgress.lessons_completed)
            ).scalar() or 0

            # Tổng số quiz hoàn thành
            total_quizzes = self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid
            ).with_entities(
                self.db.func.sum(LearningProgress.quizzes_completed)
            ).scalar() or 0

            # Điểm trung bình
            avg_score = self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid
            ).with_entities(
                self.db.func.avg(LearningProgress.average_score)
            ).scalar() or 0

            return {
                "total_study_time_minutes": total_time,
                "total_lessons_completed": total_lessons,
                "total_quizzes_completed": total_quizzes,
                "average_score": round(avg_score, 2)
            }
        except ValueError:
            return {
                "total_study_time_minutes": 0,
                "total_lessons_completed": 0,
                "total_quizzes_completed": 0,
                "average_score": 0
            }

    def get_subject_progress(self, user_id: str, subject_id: int) -> List[LearningProgress]:
        """Lấy progress theo subject (bao gồm cả topic)"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(LearningProgress).filter(
                LearningProgress.user_id == user_uuid,
                LearningProgress.subject_id == subject_id
            ).order_by(LearningProgress.last_activity_at.desc()).all()
        except ValueError:
            return []

    def delete(self, progress_id: str) -> bool:
        """Xóa progress"""
        progress = self.get_by_id(progress_id)
        if not progress:
            return False

        self.db.delete(progress)
        self.db.commit()
        return True
