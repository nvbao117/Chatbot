# backend/app/schemas/chatbot.py
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    user_id: UUID
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[UUID] = None
    subject_id: Optional[int] = None
    topic_id: Optional[int] = None
    

class ChatMessage(BaseModel):
    message_id: UUID
    sender: str  # 'user' / 'assistant' / 'system'
    content: str
    created_at: datetime
    tokens_used: Optional[int] = None
    processing_time_ms: Optional[int] = None


class ChatResponse(BaseModel):
    conversation_id: UUID
    messages: List[ChatMessage]
    total_tokens_used: int = 0


class ChatbotConfig(BaseModel):
    model: str = "claude-3-sonnet"
    temperature: float = 0.7
    max_tokens: int = 2000
    system_prompt: Optional[str] = None


class ChatbotSettings(BaseModel):
    user_id: UUID
    preferred_language: str = "vi"
    learning_level: str = "Beginner"
    chatbot_config: ChatbotConfig
    is_active: bool = True
