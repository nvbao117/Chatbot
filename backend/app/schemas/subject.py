# backend/app/schemas/subject.py
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class SubjectBase(BaseModel):
    subject_name: str = Field(..., min_length=1, max_length=200)
    subject_code: str = Field(..., min_length=1, max_length=50)
    icon: str
    description: Optional[str] = None
    difficulty_level: str = "Medium"
    estimated_hours: int = 0
        
    
class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    subject_name: Optional[str] = Field(None, min_length=1, max_length=200)
    subject_code: Optional[str] = Field(None, min_length=1, max_length=50)
    icon: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    estimated_hours: Optional[int] = None
    is_active: Optional[bool] = None


class SubjectResponse(SubjectBase):
    subject_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  