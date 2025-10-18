from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.conversation import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User
import uuid

class ConversationService:
    def __init__(self, db: Session):
        self.db = db

    async def create_conversation(self, user_id: str, conversation_data: ConversationCreate) -> ConversationResponse:
        """Tạo cuộc trò chuyện mới"""
        user_uuid = uuid.UUID(user_id)
        
        db_conversation = Conversation(
            user_id=user_uuid,
            title=conversation_data.title,
            subject_id=conversation_data.subject_id,
            topic_id=conversation_data.topic_id,
            is_active=True
        )

        self.db.add(db_conversation)
        self.db.commit()
        self.db.refresh(db_conversation)

        return ConversationResponse.from_orm(db_conversation)

    async def get_user_conversations(self, user_id: str, skip: int = 0, limit: int = 100) -> List[ConversationResponse]:
        """Lấy danh sách cuộc trò chuyện của user"""
        user_uuid = uuid.UUID(user_id)
        
        conversations = self.db.query(Conversation).filter(
            Conversation.user_id == user_uuid,
            Conversation.is_active == True
        ).offset(skip).limit(limit).all()

        return [ConversationResponse.from_orm(conv) for conv in conversations]

    async def get_conversation(self, conversation_id: str, user_id: str) -> Optional[ConversationResponse]:
        """Lấy thông tin cuộc trò chuyện"""
        try:
            conv_uuid = uuid.UUID(conversation_id)
            user_uuid = uuid.UUID(user_id)
            
            conversation = self.db.query(Conversation).filter(
                Conversation.conversation_id == conv_uuid,
                Conversation.user_id == user_uuid,
                Conversation.is_active == True
            ).first()

            if conversation:
                return ConversationResponse.from_orm(conversation)
            return None
        except ValueError:
            return None

    async def send_message(self, conversation_id: str, user_id: str, message_data: MessageCreate) -> MessageResponse:
        """Gửi tin nhắn trong cuộc trò chuyện"""
        conv_uuid = uuid.UUID(conversation_id)
        user_uuid = uuid.UUID(user_id)

        # Kiểm tra conversation tồn tại và thuộc về user
        conversation = self.db.query(Conversation).filter(
            Conversation.conversation_id == conv_uuid,
            Conversation.user_id == user_uuid,
            Conversation.is_active == True
        ).first()

        if not conversation:
            raise ValueError("Conversation not found or access denied")

        db_message = Message(
            conversation_id=conv_uuid,
            user_id=user_uuid,
            content=message_data.content,
            message_type=message_data.message_type or "user",
            is_ai_response=message_data.is_ai_response or False
        )

        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)

        return MessageResponse.from_orm(db_message)

    async def get_conversation_messages(self, conversation_id: str, user_id: str, skip: int = 0, limit: int = 100) -> List[MessageResponse]:
        """Lấy danh sách tin nhắn trong cuộc trò chuyện"""
        conv_uuid = uuid.UUID(conversation_id)
        user_uuid = uuid.UUID(user_id)

        # Kiểm tra quyền truy cập
        conversation = self.db.query(Conversation).filter(
            Conversation.conversation_id == conv_uuid,
            Conversation.user_id == user_uuid,
            Conversation.is_active == True
        ).first()

        if not conversation:
            raise ValueError("Conversation not found or access denied")

        messages = self.db.query(Message).filter(
            Message.conversation_id == conv_uuid
        ).order_by(Message.created_at.asc()).offset(skip).limit(limit).all()

        return [MessageResponse.from_orm(msg) for msg in messages]

    async def delete_conversation(self, conversation_id: str, user_id: str) -> bool:
        """Xóa cuộc trò chuyện"""
        conv_uuid = uuid.UUID(conversation_id)
        user_uuid = uuid.UUID(user_id)

        conversation = self.db.query(Conversation).filter(
            Conversation.conversation_id == conv_uuid,
            Conversation.user_id == user_uuid
        ).first()

        if not conversation:
            raise ValueError("Conversation not found or access denied")

        conversation.is_active = False
        self.db.commit()
        return True
