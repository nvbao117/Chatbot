# backend/app/services/quiz_session_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.quiz_session import QuizSession
from backend.app.schemas.quiz_session import QuizSessionCreate, QuizSessionUpdate, QuizSessionResponse


class QuizSessionService:
    def __init__(self, db: Session):
        self.db = db


    def list_sessions(self,skip:int=0,limit:int=100,user_id:Optional[UUID]=None) -> List[QuizSessionResponse] : 
        query = self.db.query(QuizSession).filter(QuizSession.status=="in_progress") 
        if user_id:
            query = query.filter(QuizSession.user_id == user_id) 
            
        sessions = query.offset(skip).limit(limit).all()
        return [QuizSessionResponse.model_validate(session) for session in sessions]
    
    
    def get_session(self, session_id: UUID) -> Optional[QuizSession]:
        return self.db.query(QuizSession).filter(QuizSession.session_id == session_id).first()


    def create_session(self,payload:QuizSessionCreate,user_id:UUID) -> QuizSessionResponse: 
        session_data = payload.model_dump()
        session_data['user_id']= user_id
        session = QuizSession(**session_data) 
        self.db.add(session) 
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Session creation failed")
        self.db.refresh(session) 
        return QuizSessionResponse.model_validate(session)
    
    
    def update_session(self, session: QuizSession, payload: QuizSessionUpdate) -> QuizSessionResponse:
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(session, field, value)
        self.db.commit()
        self.db.refresh(session)
        return QuizSessionResponse.model_validate(session)

    def complete_session(self, session: QuizSession, correct_answers: int) -> QuizSessionResponse:
        session.correct_answers = correct_answers
        session.accuracy_percentage = (correct_answers / session.total_questions) * 100
        session.status = "completed"
        self.db.commit()
        self.db.refresh(session)
        return QuizSessionResponse.model_validate(session)