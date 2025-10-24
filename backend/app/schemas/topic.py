# backend/app/schemas/topic.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TopicBase(BaseModel):
    subject_id: int
    topic_name: str = Field(..., min_length=1, max_length=200)
    topic_description: Optional[str] = None
    order_index: int = 0


class TopicCreate(TopicBase):
    pass


class TopicUpdate(BaseModel):
    topic_name: Optional[str] = Field(None, min_length=1, max_length=200)
    topic_description: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class TopicResponse(TopicBase):
    topic_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True