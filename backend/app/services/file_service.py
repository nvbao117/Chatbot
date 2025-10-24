# backend/app/services/chatbot_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from backend.app.models.user import User
from backend.app.models.conversation import Conversation
from backend.app.models.message import Message
from backend.app.schemas.chatbot import ChatRequest, ChatResponse, ChatMessage


class ChatbotService:
    def __init__(self, db: Session):
        self.db = db

    def process_chat(self, request: ChatRequest, user_id: UUID) -> ChatResponse:
        # Get or create conversation
        if request.conversation_id:
            conversation = self.db.query(Conversation).filter(
                Conversation.conversation_id == request.conversation_id
            ).first()
        else:
            # Create new conversation
            conversation = Conversation(
                user_id=user_id,
                title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
                subject_id=request.subject_id,
                topic_id=request.topic_id
            )
            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)

        # Create user message
        user_message = Message(
            conversation_id=conversation.conversation_id,
            user_id=user_id,
            content=request.message,
            role="user"
        )
        self.db.add(user_message)
        self.db.commit()
        self.db.refresh(user_message)

        # Generate AI response (mock for now)
        ai_response = self._generate_ai_response(request.message)
        
        # Create AI message
        ai_message = Message(
            conversation_id=conversation.conversation_id,
            user_id=user_id,
            content=ai_response,
            role="assistant",
            tokens_used=len(ai_response.split()) * 1.3  # Rough estimate
        )
        self.db.add(ai_message)
        self.db.commit()
        self.db.refresh(ai_message)

        # Get all messages for response
        messages = self.db.query(Message).filter(
            Message.conversation_id == conversation.conversation_id
        ).order_by(Message.created_at).all()

        return ChatResponse(
            conversation_id=conversation.conversation_id,
            messages=[
                ChatMessage(
                    message_id=msg.message_id,
                    sender=msg.role,
                    content=msg.content,
                    created_at=msg.created_at,
                    tokens_used=msg.tokens_used,
                    processing_time_ms=msg.processing_time_ms
                ) for msg in messages
            ],
            total_tokens_used=sum(msg.tokens_used or 0 for msg in messages)
        )

    def _generate_ai_response(self, user_message: str) -> str:
        # Mock AI response - replace with actual AI integration
        return f"Tôi hiểu bạn đang hỏi về: {user_message}. Đây là câu trả lời từ AI chatbot."