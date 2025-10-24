# backend/app/services/subject_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.subject import Subject
from backend.app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse


class SubjectService:
    def __init__(self, db: Session):
        self.db = db

    def list_subjects(self, skip: int = 0, limit: int = 100) -> List[SubjectResponse]:
        subjects = (
            self.db.query(Subject)
            .filter(Subject.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [SubjectResponse.model_validate(subject) for subject in subjects]

    def get_subject(self, subject_id: int) -> Optional[Subject]:
        return self.db.query(Subject).filter(Subject.subject_id == subject_id).first()

    def create_subject(self, payload: SubjectCreate) -> SubjectResponse:
        subject = Subject(**payload.model_dump())
        self.db.add(subject)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Subject with this code already exists")
        self.db.refresh(subject)
        return SubjectResponse.model_validate(subject)

    def update_subject(self, subject: Subject, payload: SubjectUpdate) -> SubjectResponse:
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(subject, field, value)
        self.db.commit()
        self.db.refresh(subject)
        return SubjectResponse.model_validate(subject)

    def deactivate_subject(self, subject: Subject) -> None:
        subject.is_active = False
        self.db.commit()