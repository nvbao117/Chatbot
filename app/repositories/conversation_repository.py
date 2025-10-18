from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.conversation import Conversation
from app.models.message import Message
import uuid

class ConversationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, conversation: Conversation) -> Conversation:
        """Tạo conversation mới"""
        self.db.add(conversation)
        self.db.commit()
        self.db.refresh(conversation)
        return conversation

    def get_by_id(self, conversation_id: str, user_id: str = None) -> Optional[Conversation]:
        """Lấy conversation theo ID"""
        try:
            conv_uuid = uuid.UUID(conversation_id)
            query = self.db.query(Conversation).filter(Conversation.conversation_id == conv_uuid)
            
            if user_id:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(Conversation.user_id == user_uuid)
            
            return query.first()
        except ValueError:
            return None

    def get_user_conversations(self, user_id: str, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[Conversation]:
        """Lấy danh sách conversations của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            query = self.db.query(Conversation).filter(Conversation.user_id == user_uuid)
            
            if active_only:
                query = query.filter(Conversation.is_active == True)
            
            return query.order_by(Conversation.updated_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def update(self, conversation_id: str, update_data: dict, user_id: str = None) -> Optional[Conversation]:
        """Cập nhật conversation"""
        conversation = self.get_by_id(conversation_id, user_id)
        if not conversation:
            return None

        for field, value in update_data.items():
            if hasattr(conversation, field):
                setattr(conversation, field, value)

        self.db.commit()
        self.db.refresh(conversation)
        return conversation

    def delete(self, conversation_id: str, user_id: str = None) -> bool:
        """Xóa conversation (soft delete)"""
        conversation = self.get_by_id(conversation_id, user_id)
        if not conversation:
            return False

        conversation.is_active = False
        self.db.commit()
        return True

    def get_by_subject(self, subject_id: int, user_id: str = None, skip: int = 0, limit: int = 100) -> List[Conversation]:
        """Lấy conversations theo subject"""
        query = self.db.query(Conversation).filter(Conversation.subject_id == subject_id)
        
        if user_id:
            try:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(Conversation.user_id == user_uuid)
            except ValueError:
                return []
        
        return query.filter(Conversation.is_active == True).offset(skip).limit(limit).all()

    def get_by_topic(self, topic_id: int, user_id: str = None, skip: int = 0, limit: int = 100) -> List[Conversation]:
        """Lấy conversations theo topic"""
        query = self.db.query(Conversation).filter(Conversation.topic_id == topic_id)
        
        if user_id:
            try:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(Conversation.user_id == user_uuid)
            except ValueError:
                return []
        
        return query.filter(Conversation.is_active == True).offset(skip).limit(limit).all()

    def search_conversations(self, search_term: str, user_id: str = None, skip: int = 0, limit: int = 100) -> List[Conversation]:
        """Tìm kiếm conversations theo title"""
        search_pattern = f"%{search_term}%"
        query = self.db.query(Conversation).filter(Conversation.title.ilike(search_pattern))
        
        if user_id:
            try:
                user_uuid = uuid.UUID(user_id)
                query = query.filter(Conversation.user_id == user_uuid)
            except ValueError:
                return []
        
        return query.filter(Conversation.is_active == True).offset(skip).limit(limit).all()

    def count_user_conversations(self, user_id: str, active_only: bool = True) -> int:
        """Đếm số conversations của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            query = self.db.query(Conversation).filter(Conversation.user_id == user_uuid)
            
            if active_only:
                query = query.filter(Conversation.is_active == True)
            
            return query.count()
        except ValueError:
            return 0

class MessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, message: Message) -> Message:
        """Tạo message mới"""
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_by_id(self, message_id: str) -> Optional[Message]:
        """Lấy message theo ID"""
        try:
            msg_uuid = uuid.UUID(message_id)
            return self.db.query(Message).filter(Message.message_id == msg_uuid).first()
        except ValueError:
            return None

    def get_conversation_messages(self, conversation_id: str, skip: int = 0, limit: int = 100) -> List[Message]:
        """Lấy messages của conversation"""
        try:
            conv_uuid = uuid.UUID(conversation_id)
            return self.db.query(Message).filter(
                Message.conversation_id == conv_uuid
            ).order_by(Message.created_at.asc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def get_user_messages(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Message]:
        """Lấy messages của user"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(Message).filter(
                Message.user_id == user_uuid
            ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
        except ValueError:
            return []

    def delete(self, message_id: str) -> bool:
        """Xóa message"""
        message = self.get_by_id(message_id)
        if not message:
            return False

        self.db.delete(message)
        self.db.commit()
        return True

    def count_conversation_messages(self, conversation_id: str) -> int:
        """Đếm số messages trong conversation"""
        try:
            conv_uuid = uuid.UUID(conversation_id)
            return self.db.query(Message).filter(Message.conversation_id == conv_uuid).count()
        except ValueError:
            return 0
