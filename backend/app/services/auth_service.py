# backend/app/services/auth_service.py
from datetime import timedelta
from sqlalchemy.orm import Session

from backend.app.core import security
from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest, RegisterRequest, Token
from backend.app.schemas.user import UserResponse


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    
    def register(self,payload:RegisterRequest) -> UserResponse:
        if self.db.query(User).filter(User.username == payload.username).first():
            raise ValueError("Username already taken")
        if self.db.query(User).filter(User.email == payload.email).first():
            raise ValueError("Email already registered")
        
        
        hashed_password = security.get_password_hash(payload.password)
        user = User(
            username=payload.username,
            email=payload.email,
            password_hash=hashed_password,
            full_name=payload.full_name,
            date_of_birth=payload.date_of_birth,
            learning_level=payload.learning_level,
            preferred_language=payload.preferred_language,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return UserResponse.model_validate(user)


    def authenticate(self, payload: LoginRequest) -> Token:
        user = (
            self.db.query(User)
            .filter(User.username == payload.username)
            .first()
        )
        if not user or not security.verify_password(payload.password, user.password_hash):
            raise ValueError("Invalid username or password")
        if not user.is_active:
            raise ValueError("User is inactive")

        expires = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        access_token = security.create_access_token(
            data={"sub": str(user.user_id)},
            expires_minutes=expires,
        )
        return Token(access_token=access_token, expires_in=expires * 60)