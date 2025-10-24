# backend/app/schemas/conversation.py
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ConversationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    subject_id: UUID
    topic_id: Optional[UUID] = None


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    subject_id: Optional[UUID] = None
    topic_id: Optional[UUID] = None
    is_active: Optional[bool] = None


class ConversationResponse(ConversationBase):
    conversation_id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    message_type: str = "text"
    role: str = "user"


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    message_type: Optional[str] = None
    role: Optional[str] = None


class MessageResponse(MessageBase):
    message_id: UUID
    conversation_id: UUID
    user_id: UUID
    tokens_used: int = 0
    processing_time_ms: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = []