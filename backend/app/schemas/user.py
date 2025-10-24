from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    learning_level: str = "Beginner"
    preferred_language: str = "vi"
    timezone: str = "Asia/Ho_Chi_Minh"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    
class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    learning_level: Optional[str] = None
    preferred_language: Optional[str] = None
    timezone: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6, max_length=100)
    

class UserResponse(UserBase):
    user_id: UUID
    avatar_url: Optional[str] = None
    is_active: bool
    is_premium: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True