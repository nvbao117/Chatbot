from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ConversationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    subject_id: Optional[int] = None
    topic_id: Optional[int] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    conversation_id: UUID
    user_id: UUID
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    message_type: Optional[str] = Field(default="user", max_length=20)
    is_ai_response: Optional[bool] = False

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    message_id: UUID
    conversation_id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
