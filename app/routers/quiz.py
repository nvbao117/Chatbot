from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import SessionLocal
from app.schemas.quiz import QuizSessionCreate, QuizSessionResponse, QuizAnswerCreate, QuizAnswerResponse
from app.services.quiz_service import QuizService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/sessions", response_model=QuizSessionResponse)
async def create_quiz_session(
    session_data: QuizSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tạo phiên quiz mới"""
    quiz_service = QuizService(db)
    return await quiz_service.create_quiz_session(current_user.user_id, session_data)

@router.get("/sessions", response_model=List[QuizSessionResponse])
async def get_user_quiz_sessions(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách phiên quiz của user"""
    quiz_service = QuizService(db)
    return await quiz_service.get_user_quiz_sessions(current_user.user_id, skip, limit)

@router.get("/sessions/{session_id}", response_model=QuizSessionResponse)
async def get_quiz_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy thông tin phiên quiz"""
    quiz_service = QuizService(db)
    session = await quiz_service.get_quiz_session(session_id, current_user.user_id)
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    return session

@router.post("/sessions/{session_id}/answers", response_model=QuizAnswerResponse)
async def submit_answer(
    session_id: str,
    answer_data: QuizAnswerCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Nộp câu trả lời cho câu hỏi quiz"""
    quiz_service = QuizService(db)
    return await quiz_service.submit_answer(session_id, current_user.user_id, answer_data)

@router.get("/sessions/{session_id}/questions")
async def get_quiz_questions(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách câu hỏi trong phiên quiz"""
    quiz_service = QuizService(db)
    return await quiz_service.get_quiz_questions(session_id, current_user.user_id)

@router.post("/sessions/{session_id}/complete")
async def complete_quiz_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Hoàn thành phiên quiz và tính điểm"""
    quiz_service = QuizService(db)
    return await quiz_service.complete_quiz_session(session_id, current_user.user_id)
