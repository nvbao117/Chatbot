# backend/app/api/v1/endpoints/quizzes.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.quiz_question import QuizQuestion
from backend.app.schemas.quiz import QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionResponse

router = APIRouter()

@router.get("/", response_model=List[QuizQuestionResponse])
def list_quiz_questions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    subject_id: UUID = Query(None),
    topic_id: UUID = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(QuizQuestion).filter(QuizQuestion.is_active == True)
    
    if subject_id:
        query = query.filter(QuizQuestion.subject_id == subject_id)
    if topic_id:
        query = query.filter(QuizQuestion.topic_id == topic_id)
    
    rows = query.offset(skip).limit(limit).all()
    return [QuizQuestionResponse.model_validate(x) for x in rows]

@router.post("/", response_model=QuizQuestionResponse, status_code=status.HTTP_201_CREATED)
def create_quiz_question(payload: QuizQuestionCreate, db: Session = Depends(get_db)):
    question = QuizQuestion(**payload.model_dump())
    db.add(question)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(question)
    return QuizQuestionResponse.model_validate(question)

@router.get("/{question_id}", response_model=QuizQuestionResponse)
def get_quiz_question(question_id: UUID, db: Session = Depends(get_db)):
    question = db.query(QuizQuestion).filter(QuizQuestion.question_id == question_id).first()
    if not question or not question.is_active:
        raise HTTPException(status_code=404, detail="Quiz question not found")
    return QuizQuestionResponse.model_validate(question)

@router.put("/{question_id}", response_model=QuizQuestionResponse)
def update_quiz_question(question_id: UUID, payload: QuizQuestionUpdate, db: Session = Depends(get_db)):
    question = db.query(QuizQuestion).filter(QuizQuestion.question_id == question_id).first()
    if not question or not question.is_active:
        raise HTTPException(status_code=404, detail="Quiz question not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(question, k, v)
    db.commit()
    db.refresh(question)
    return QuizQuestionResponse.model_validate(question)

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz_question(question_id: UUID, db: Session = Depends(get_db)):
    question = db.query(QuizQuestion).filter(QuizQuestion.question_id == question_id).first()
    if not question or not question.is_active:
        raise HTTPException(status_code=404, detail="Quiz question not found")
    question.is_active = False
    db.commit()
    return None