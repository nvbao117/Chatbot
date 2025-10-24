# backend/app/schemas/auth.py
from datetime import datetime
from typing import Optional
from uuid import UUID 

from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel): 
    username: str
    password: str 

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    full_name: str = Field(..., min_length=1, max_length=100)
    date_of_birth: Optional[datetime] = None
    preferred_language: Optional[str] = "vi" 
    learning_level: Optional[str] = "Beginner" 
    
class Token(BaseModel): 
    access_token: str 
    token_type: str = "bearer"
    expires_in: int

class TokenPayload(BaseModel):
    sub: Optional[UUID] = None
    exp: Optional[int] = None