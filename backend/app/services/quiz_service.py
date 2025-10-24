# backend/app/services/quiz_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.quiz_question import QuizQuestion
from backend.app.models.quiz_option import QuizOption
from backend.app.schemas.quiz import QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionResponse


class QuizService:
    def __init__(self, db: Session):
        self.db = db

    def list_questions(self, skip: int = 0, limit: int = 100, 
                          subject_id: Optional[UUID] = None, 
                          topic_id: Optional[UUID] = None) -> List[QuizQuestionResponse]:
        query = self.db.query(QuizQuestion).filter(QuizQuestion.is_active == True)
        
        if subject_id:
            query = query.filter(QuizQuestion.subject_id == subject_id)
        if topic_id:
            query = query.filter(QuizQuestion.topic_id == topic_id)
        
        questions = query.offset(skip).limit(limit).all()
        return [QuizQuestionResponse.model_validate(q) for q in questions]
    

    def get_question(self, question_id: UUID) -> Optional[QuizQuestion]:
        return self.db.query(QuizQuestion).filter(QuizQuestion.question_id == question_id).first()

    def create_question(self, payload: QuizQuestionCreate) -> QuizQuestionResponse:
        question_data = payload.model_dump(exclude={'options'})
        question = QuizQuestion(**question_data)
        self.db.add(question)
        self.db.flush()  # Get the question_id
        
        # Create options
        for option_data in payload.options:
            option = QuizOption(question_id=question.question_id, **option_data.model_dump())
            self.db.add(option)
        
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Question creation failed")
        self.db.refresh(question)
        return QuizQuestionResponse.model_validate(question)

    def update_question(self, question: QuizQuestion, payload: QuizQuestionUpdate) -> QuizQuestionResponse:
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(question, field, value)
        self.db.commit()
        self.db.refresh(question)
        return QuizQuestionResponse.model_validate(question)

    def deactivate_question(self, question: QuizQuestion) -> None:
        question.is_active = False
        self.db.commit()