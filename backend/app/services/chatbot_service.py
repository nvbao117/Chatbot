# backend/app/services/chatbot_service.py
from uuid import UUID

from sqlalchemy.orm import Session
from typing import Optional, Dict

from backend.app.core.config import settings
from backend.app.models.conversation import Conversation
from backend.app.models.message import Message
from backend.app.models.user import User
from backend.app.models.subject import Subject


from backend.app.schemas.chatbot import ChatMessageBaseModel, ChatResponseBaseModel
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage, HumanMessage


ANTHROPIC_API_KEY = settings.ANTHROPIC_API_KEY

class ChatbotService:
    def __init__(self, db: Session, user:User):
        self.db = db
        self.user = user
    
    async def handle_message(self, message: str, conversationid: UUID | None = None):
        # Ensure conversation exists
        conversation = None
        if not conversationid:
            # Pick any available subject to satisfy FK
            subject = self.db.query(Subject).first()
            subject_id = subject.subject_id if subject else 1
            conversation = Conversation(user_id=self.user.user_id, subject_id=subject_id, title="New Conversation")
            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)
            conversationid = conversation.conversation_id
        else:
            conversation = self.db.query(Conversation).filter(Conversation.conversation_id == conversationid).first()
            if not conversation:
                raise ValueError("Conversation not found")

        llm = ChatAnthropic(
            model = "claude-3-haiku-20240307",
            api_key=ANTHROPIC_API_KEY
        )
        
        system_prompt = "Bạn là trợ lý AI học tập, hãy trả lời một cách dễ hiểu, thân thiện."
        answer = ""
        try:
            result = await llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=message),
            ])
            # LangChain returns BaseMessage; content may be str or list of parts
            if hasattr(result, "content"):
                answer = result.content if isinstance(result.content, str) else str(result.content)
            else:
                answer = str(result)
        except Exception as exc:
            # Fallback to avoid 500s; log and continue saving
            answer = "Xin lỗi, hiện tại tôi không thể kết nối tới mô hình AI. Tôi sẽ thử lại sau."

        # Persist messages
        user_message = Message(
            conversation_id=conversationid,
            user_id=self.user.user_id,
            role="user",
            content=message,
        )
        assistant_msg = Message(
            conversation_id=conversationid,
            user_id=self.user.user_id,
            role="assistant",
            content=answer,
        )
        print("Đã lưu vào db")
        self.db.add(user_message)
        self.db.add(assistant_msg)
        self.db.commit()
        self.db.refresh(user_message)
        self.db.refresh(assistant_msg)
        print(user_message.message_id)
        print(user_message.content)
        print(user_message.conversation_id)
        print("Đã lưu vào db")
        messages = (
            self.db.query(Message)
            .filter(Message.conversation_id == conversationid)
            .order_by(Message.created_at)
            .all()
        )
        return ChatResponseBaseModel(
            conversationid=conversationid,
            messages=[
                ChatMessageBaseModel(
                    messageid=m.message_id, sender=m.role, content=m.content, createdat=m.created_at
                )
                for m in messages
            ],
            totaltokensused=0  # nếu muốn có thể tính tổng tokens từ LLM usage
        )