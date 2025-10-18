from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.quiz import QuizSessionCreate, QuizSessionResponse, QuizAnswerCreate, QuizAnswerResponse
from app.models.quiz_session import QuizSession
from app.models.quiz_question import QuizQuestion
from app.models.quiz_answer import QuizAnswer
from app.models.user import User
import uuid
from datetime import datetime

class QuizService:
    def __init__(self, db: Session):
        self.db = db

    async def create_quiz_session(self, user_id: str, session_data: QuizSessionCreate) -> QuizSessionResponse:
        """Tạo phiên quiz mới"""
        user_uuid = uuid.UUID(user_id)
        
        db_session = QuizSession(
            user_id=user_uuid,
            subject_id=session_data.subject_id,
            topic_id=session_data.topic_id,
            total_questions=session_data.total_questions or 10,
            status="in_progress"
        )

        self.db.add(db_session)
        self.db.commit()
        self.db.refresh(db_session)

        return QuizSessionResponse.from_orm(db_session)

    async def get_user_quiz_sessions(self, user_id: str, skip: int = 0, limit: int = 100) -> List[QuizSessionResponse]:
        """Lấy danh sách phiên quiz của user"""
        user_uuid = uuid.UUID(user_id)
        
        sessions = self.db.query(QuizSession).filter(
            QuizSession.user_id == user_uuid
        ).order_by(QuizSession.created_at.desc()).offset(skip).limit(limit).all()

        return [QuizSessionResponse.from_orm(session) for session in sessions]

    async def get_quiz_session(self, session_id: str, user_id: str) -> Optional[QuizSessionResponse]:
        """Lấy thông tin phiên quiz"""
        try:
            session_uuid = uuid.UUID(session_id)
            user_uuid = uuid.UUID(user_id)
            
            session = self.db.query(QuizSession).filter(
                QuizSession.session_id == session_uuid,
                QuizSession.user_id == user_uuid
            ).first()

            if session:
                return QuizSessionResponse.from_orm(session)
            return None
        except ValueError:
            return None

    async def submit_answer(self, session_id: str, user_id: str, answer_data: QuizAnswerCreate) -> QuizAnswerResponse:
        """Nộp câu trả lời cho câu hỏi quiz"""
        session_uuid = uuid.UUID(session_id)
        user_uuid = uuid.UUID(user_id)

        # Kiểm tra session tồn tại và thuộc về user
        session = self.db.query(QuizSession).filter(
            QuizSession.session_id == session_uuid,
            QuizSession.user_id == user_uuid,
            QuizSession.status == "in_progress"
        ).first()

        if not session:
            raise ValueError("Quiz session not found or not in progress")

        db_answer = QuizAnswer(
            session_id=session_uuid,
            question_id=answer_data.question_id,
            selected_option_id=answer_data.selected_option_id,
            is_correct=answer_data.is_correct,
            time_taken_seconds=answer_data.time_taken_seconds
        )

        self.db.add(db_answer)
        self.db.commit()
        self.db.refresh(db_answer)

        return QuizAnswerResponse.from_orm(db_answer)

    async def get_quiz_questions(self, session_id: str, user_id: str) -> List[dict]:
        """Lấy danh sách câu hỏi trong phiên quiz"""
        session_uuid = uuid.UUID(session_id)
        user_uuid = uuid.UUID(user_id)

        # Kiểm tra quyền truy cập
        session = self.db.query(QuizSession).filter(
            QuizSession.session_id == session_uuid,
            QuizSession.user_id == user_uuid
        ).first()

        if not session:
            raise ValueError("Quiz session not found or access denied")

        # Lấy câu hỏi theo subject và topic
        query = self.db.query(QuizQuestion).filter(
            QuizQuestion.subject_id == session.subject_id,
            QuizQuestion.is_active == True
        )

        if session.topic_id:
            query = query.filter(QuizQuestion.topic_id == session.topic_id)

        questions = query.limit(session.total_questions).all()

        return [
            {
                "question_id": str(q.question_id),
                "question_text": q.question_text,
                "difficulty_level": q.difficulty_level,
                "points": q.points,
                "options": [
                    {
                        "option_id": str(opt.option_id),
                        "option_text": opt.option_text,
                        "is_correct": opt.is_correct
                    } for opt in q.options
                ]
            } for q in questions
        ]

    async def complete_quiz_session(self, session_id: str, user_id: str) -> dict:
        """Hoàn thành phiên quiz và tính điểm"""
        session_uuid = uuid.UUID(session_id)
        user_uuid = uuid.UUID(user_id)

        session = self.db.query(QuizSession).filter(
            QuizSession.session_id == session_uuid,
            QuizSession.user_id == user_uuid,
            QuizSession.status == "in_progress"
        ).first()

        if not session:
            raise ValueError("Quiz session not found or not in progress")

        # Tính điểm
        total_questions = session.total_questions
        correct_answers = self.db.query(QuizAnswer).filter(
            QuizAnswer.session_id == session_uuid,
            QuizAnswer.is_correct == True
        ).count()

        accuracy_percentage = (correct_answers / total_questions * 100) if total_questions > 0 else 0

        # Cập nhật session
        session.status = "completed"
        session.completed_at = datetime.utcnow()
        session.correct_answers = correct_answers
        session.accuracy_percentage = accuracy_percentage

        self.db.commit()

        return {
            "session_id": str(session.session_id),
            "total_questions": total_questions,
            "correct_answers": correct_answers,
            "accuracy_percentage": accuracy_percentage,
            "status": "completed"
        }
