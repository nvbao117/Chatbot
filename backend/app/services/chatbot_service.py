# backend/app/services/chatbot_service.py
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.models.conversation import Conversation
from backend.app.models.message import Message
from backend.app.models.user import User
from backend.app.schemas.chatbot import ChatMessage, ChatRequest, ChatResponse
from anthropic import Anthropic

_anthropic_client = (
    Anthropic(api_key=settings.CLAUDE_API_KEY)
    if Anthropic and settings.CLAUDE_API_KEY
    else None
)


class ChatbotService:
    def __init__(self, db: Session):
        self.db = db

    def process_chat(self, request: ChatRequest) -> ChatResponse:
        user = (
            self.db.query(User)
            .filter(User.user_id == request.user_id, User.is_active == True)  # noqa: E712
            .first()
        )
        if not user:
            raise ValueError("User not found or inactive")

        conversation = None
        if request.conversation_id:
            conversation = (
                self.db.query(Conversation)
                .filter(Conversation.conversation_id == request.conversation_id)
                .first()
            )
            if not conversation or not conversation.is_active:
                raise ValueError("Conversation not found or inactive")
            if conversation.user_id != request.user_id:
                raise ValueError("Conversation does not belong to user")
        else:
            if request.subject_id is None:
                raise ValueError("subject_id is required when starting a new conversation")
            title = request.message[:50] + "..." if len(request.message) > 50 else request.message
            conversation = Conversation(
                user_id=request.user_id,
                title=title,
                subject_id=request.subject_id,
            )
            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)

        user_message = Message(
            conversation_id=conversation.conversation_id,
            user_id=request.user_id,
            content=request.message,
            role="user",
        )
        self.db.add(user_message)
        self.db.commit()
        self.db.refresh(user_message)
        ai_text, tokens_used = self._generate_ai_response(request.message)
            
        ai_message = Message(
            conversation_id=conversation.conversation_id,
            user_id=request.user_id,
            content=ai_text,
            role="assistant",
            tokens_used=int(tokens_used),
        )
        self.db.add(ai_message)
        self.db.commit()
        self.db.refresh(ai_message)

        messages = (
            self.db.query(Message)
            .filter(Message.conversation_id == conversation.conversation_id)
            .order_by(Message.created_at)
            .all()
        )

        return ChatResponse(
            conversation_id=conversation.conversation_id,
            messages=[
                ChatMessage(
                    message_id=msg.message_id,
                    sender=msg.role,
                    content=msg.content,
                    created_at=msg.created_at,
                    tokens_used=msg.tokens_used,
                    processing_time_ms=msg.processing_time_ms,
                )
                for msg in messages
            ],
            total_tokens_used=sum(int(msg.tokens_used or 0) for msg in messages),
        )

    def _generate_ai_response(self, user_message: str, system_prompt: str | None = None) -> tuple[str, int]:
        if _anthropic_client:
            try:
                response = _anthropic_client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=1024,
                    messages=[{"role": "user", "content": user_message}],
                )
            except Exception as e:
                print(f"Error generating AI response: {str(e)}")
                response = None
            else:
                text_parts = [
                    getattr(block, "text", "")
                    for block in getattr(response, "content", [])
                    if getattr(block, "type", "") == "text"
                ]
                response_text = "".join(text_parts).strip() or "Assistant khong tra loi duoc."
                usage = getattr(response, "usage", None)
                input_tokens = getattr(usage, "input_tokens", 0) or 0
                output_tokens = getattr(usage, "output_tokens", 0) or 0
                return response_text, int(input_tokens + output_tokens)

        mock = f"Ban hoi: {user_message}. Day la phan hoi mo phong."
        return mock, len(mock.split())
