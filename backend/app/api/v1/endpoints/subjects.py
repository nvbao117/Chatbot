# backend/app/api/v1/endpoints/subjects.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.subject import Subject
from backend.app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse

router = APIRouter()

@router.get("/", response_model=List[SubjectResponse])
def list_subjects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Subject)
        .filter(Subject.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [SubjectResponse.model_validate(x) for x in rows]

@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(payload: SubjectCreate, db: Session = Depends(get_db)):
    subject = Subject(**payload.model_dump())
    db.add(subject)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(subject)
    return SubjectResponse.model_validate(subject)

@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if not subject or not subject.is_active:
        raise HTTPException(status_code=404, detail="Subject not found")
    return SubjectResponse.model_validate(subject)

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(subject_id: int, payload: SubjectUpdate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if not subject or not subject.is_active:
        raise HTTPException(status_code=404, detail="Subject not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(subject, k, v)
    db.commit()
    db.refresh(subject)
    return SubjectResponse.model_validate(subject)

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if not subject or not subject.is_active:
        raise HTTPException(status_code=404, detail="Subject not found")
    subject.is_active = False
    db.commit()
    return None