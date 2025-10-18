from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    learning_level: Optional[str] = Field(default="Beginner", max_length=20)
    preferred_language: Optional[str] = Field(default="vi", max_length=10)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    date_of_birth: Optional[date] = None
    learning_level: Optional[str] = Field(None, max_length=20)
    preferred_language: Optional[str] = Field(None, max_length=10)
    password: Optional[str] = Field(None, min_length=6, max_length=100)

class UserResponse(UserBase):
    user_id: UUID
    avatar_url: Optional[str] = None
    timezone: str = "Asia/Ho_Chi_Minh"
    is_active: bool = True
    is_premium: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
