# backend/app/services/conversation_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.conversation import Conversation
from backend.app.models.message import Message
from backend.app.schemas.conversation import ConversationCreate, ConversationUpdate, ConversationResponse, MessageCreate, MessageResponse


class ConversationService:
    def __init__(self, db: Session):
        self.db = db

    def list_conversations(self, skip: int = 0, limit: int = 100, user_id: Optional[UUID] = None) -> List[ConversationResponse]:
        query = self.db.query(Conversation).filter(Conversation.is_active == True)
        if user_id:
            query = query.filter(Conversation.user_id == user_id)
        
        conversations = query.offset(skip).limit(limit).all()
        return [ConversationResponse.model_validate(conv) for conv in conversations]

    def get_conversation(self, conversation_id: UUID) -> Optional[Conversation]:
        return self.db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()

    def create_conversation(self, payload: ConversationCreate, user_id: UUID) -> ConversationResponse:
        conv_data = payload.model_dump()
        conv_data['user_id'] = user_id
        conversation = Conversation(**conv_data)
        self.db.add(conversation)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Conversation creation failed")
        self.db.refresh(conversation)
        return ConversationResponse.model_validate(conversation)

    def list_messages(self, conversation_id: UUID, skip: int = 0, limit: int = 100) -> List[MessageResponse]:
        messages = (
            self.db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [MessageResponse.model_validate(msg) for msg in messages]

    def create_message(self, conversation_id: UUID, payload: MessageCreate, user_id: UUID) -> MessageResponse:
        msg_data = payload.model_dump()
        msg_data['conversation_id'] = conversation_id
        msg_data['user_id'] = user_id
        message = Message(**msg_data)
        self.db.add(message)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Message creation failed")
        self.db.refresh(message)
        return MessageResponse.model_validate(message)