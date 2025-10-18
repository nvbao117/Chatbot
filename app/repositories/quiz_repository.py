from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.quiz_session import QuizSession
from app.models.quiz_question import QuizQuestion
from app.models.quiz_answer import QuizAnswer
from app.models.quiz_option import QuizOption
import uuid

class QuizSessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, session: QuizSession) -> QuizSession:
        """Tạo quiz session mới"""
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_id(self, session_id: str, user_id: str = None) -> Optional[QuizSession]:
        """Lấy quiz session theo ID"""
        try:
            session_uuid = uuid.UUID(session_id)
            query = self.db.query(QuizSession).filter(QuizSession.session_id == session_uuid)
            
            if user_id:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(QuizSession.user_id == user_uuid)
            
            return query.first()
        except ValueError:
            return None

    def get_user_sessions(self, user_id: str, skip: int = 0, limit: int = 100) -> List[QuizSession]:
        """Lấy danh sách quiz sessions của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(QuizSession).filter(
                QuizSession.user_id == user_uuid
            ).order_by(QuizSession.created_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def update(self, session_id: str, update_data: dict, user_id: str = None) -> Optional[QuizSession]:
        """Cập nhật quiz session"""
        session = self.get_by_id(session_id, user_id)
        if not session:
            return None

        for field, value in update_data.items():
            if hasattr(session, field):
                setattr(session, field, value)

        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_status(self, status: str, user_id: str = None, skip: int = 0, limit: int = 100) -> List[QuizSession]:
        """Lấy sessions theo status"""
        query = self.db.query(QuizSession).filter(QuizSession.status == status)
        
        if user_id:
            try:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(QuizSession.user_id == user_uuid)
            except ValueError:
                return []
        
        return query.order_by(QuizSession.created_at.desc()).offset(skip).limit(limit).all()

    def get_by_subject(self, subject_id: int, user_id: str = None, skip: int = 0, limit: int = 100) -> List[QuizSession]:
        """Lấy sessions theo subject"""
        query = self.db.query(QuizSession).filter(QuizSession.subject_id == subject_id)
        
        if user_id:
            try:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(QuizSession.user_id == user_uuid)
            except ValueError:
                return []
        
        return query.order_by(QuizSession.created_at.desc()).offset(skip).limit(limit).all()

    def count_user_sessions(self, user_id: str) -> int:
        """Đếm số sessions của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(QuizSession).filter(QuizSession.user_id == user_uuid).count()
        except ValueError:
            return 0

class QuizQuestionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, question: QuizQuestion) -> QuizQuestion:
        """Tạo quiz question mới"""
        self.db.add(question)
        self.db.commit()
        self.db.refresh(question)
        return question

    def get_by_id(self, question_id: str) -> Optional[QuizQuestion]:
        """Lấy question theo ID"""
        try:
            q_uuid = uuid.UUID(question_id)
            return self.db.query(QuizQuestion).filter(QuizQuestion.question_id == q_uuid).first()
        except ValueError:
            return None

    def get_by_subject(self, subject_id: int, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[QuizQuestion]:
        """Lấy questions theo subject"""
        query = self.db.query(QuizQuestion).filter(QuizQuestion.subject_id == subject_id)
        
        if active_only:
            query = query.filter(QuizQuestion.is_active == True)
        
        return query.offset(skip).limit(limit).all()

    def get_by_topic(self, topic_id: int, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[QuizQuestion]:
        """Lấy questions theo topic"""
        query = self.db.query(QuizQuestion).filter(QuizQuestion.topic_id == topic_id)
        
        if active_only:
            query = query.filter(QuizQuestion.is_active == True)
        
        return query.offset(skip).limit(limit).all()

    def get_by_difficulty(self, difficulty: str, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[QuizQuestion]:
        """Lấy questions theo difficulty"""
        query = self.db.query(QuizQuestion).filter(QuizQuestion.difficulty_level == difficulty)
        
        if active_only:
            query = query.filter(QuizQuestion.is_active == True)
        
        return query.offset(skip).limit(limit).all()

    def search_questions(self, search_term: str, skip: int = 0, limit: int = 100) -> List[QuizQuestion]:
        """Tìm kiếm questions"""
        search_pattern = f"%{search_term}%"
        return self.db.query(QuizQuestion).filter(
            QuizQuestion.is_active == True,
            QuizQuestion.question_text.ilike(search_pattern)
        ).offset(skip).limit(limit).all()

    def get_random_questions(self, subject_id: int, topic_id: int = None, count: int = 10) -> List[QuizQuestion]:
        """Lấy random questions"""
        query = self.db.query(QuizQuestion).filter(
            QuizQuestion.subject_id == subject_id,
            QuizQuestion.is_active == True
        )
        
        if topic_id:
            query = query.filter(QuizQuestion.topic_id == topic_id)
        
        return query.order_by(QuizQuestion.question_id).limit(count).all()

class QuizAnswerRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, answer: QuizAnswer) -> QuizAnswer:
        """Tạo quiz answer mới"""
        self.db.add(answer)
        self.db.commit()
        self.db.refresh(answer)
        return answer

    def get_by_id(self, answer_id: str) -> Optional[QuizAnswer]:
        """Lấy answer theo ID"""
        try:
            a_uuid = uuid.UUID(answer_id)
            return self.db.query(QuizAnswer).filter(QuizAnswer.answer_id == a_uuid).first()
        except ValueError:
            return None

    def get_session_answers(self, session_id: str) -> List[QuizAnswer]:
        """Lấy answers của session"""
        try:
            session_uuid = uuid.UUID(session_id)
            return self.db.query(QuizAnswer).filter(
                QuizAnswer.session_id == session_uuid
            ).order_by(QuizAnswer.created_at.asc()).all()
        except ValueError:
            return []

    def get_correct_answers_count(self, session_id: str) -> int:
        """Đếm số câu trả lời đúng trong session"""
        try:
            session_uuid = uuid.UUID(session_id)
            return self.db.query(QuizAnswer).filter(
                QuizAnswer.session_id == session_uuid,
                QuizAnswer.is_correct == True
            ).count()
        except ValueError:
            return 0

    def get_user_answers(self, user_id: str, skip: int = 0, limit: int = 100) -> List[QuizAnswer]:
        """Lấy answers của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(QuizAnswer).join(QuizSession).filter(
                QuizSession.user_id == user_uuid
            ).order_by(QuizAnswer.created_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []
