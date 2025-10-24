# backend/app/api/v1/endpoints/quiz_sesions.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.quiz_session import QuizSession
from backend.app.schemas.quiz_session import QuizSessionCreate, QuizSessionUpdate, QuizSessionResponse

router = APIRouter()

@router.get("/", response_model=List[QuizSessionResponse])
def list_quiz_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: UUID = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(QuizSession).filter(QuizSession.status == "in_progress")
    
    if user_id:
        query = query.filter(QuizSession.user_id == user_id)
    
    rows = query.offset(skip).limit(limit).all()
    return [QuizSessionResponse.model_validate(x) for x in rows]

@router.post("/", response_model=QuizSessionResponse, status_code=status.HTTP_201_CREATED)
def create_quiz_session(payload: QuizSessionCreate, db: Session = Depends(get_db)):
    session = QuizSession(**payload.model_dump())
    db.add(session)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(session)
    return QuizSessionResponse.model_validate(session)

@router.get("/{session_id}", response_model=QuizSessionResponse)
def get_quiz_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(QuizSession).filter(QuizSession.session_id == session_id).first()
    if not session or not session.is_active:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    return QuizSessionResponse.model_validate(session)

@router.put("/{session_id}", response_model=QuizSessionResponse)
def update_quiz_session(session_id: UUID, payload: QuizSessionUpdate, db: Session = Depends(get_db)):
    session = db.query(QuizSession).filter(QuizSession.session_id == session_id).first()
    if not session or not session.is_active:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(session, k, v)
    db.commit()
    db.refresh(session)
    return QuizSessionResponse.model_validate(session)

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(QuizSession).filter(QuizSession.session_id == session_id).first()
    if not session or not session.is_active:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    session.is_active = False
    db.commit()
    return None