from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.user import UserCreate, UserLogin, Token
from app.models.user import User
from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.config import settings
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    async def register_user(self, user_data: UserCreate) -> dict:
        """Đăng ký user mới"""
        # Kiểm tra email đã tồn tại
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("Email already registered")

        # Kiểm tra username đã tồn tại
        existing_username = self.db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise ValueError("Username already taken")

        # Tạo user mới
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            date_of_birth=user_data.date_of_birth,
            learning_level=user_data.learning_level or "Beginner",
            preferred_language=user_data.preferred_language or "vi"
        )

        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            
            return {
                "message": "User registered successfully",
                "user_id": str(db_user.user_id),
                "username": db_user.username
            }
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Registration failed due to data conflict")

    async def authenticate_user(self, username: str, password: str) -> Token:
        """Xác thực user và tạo token"""
        user = self.db.query(User).filter(User.username == username).first()
        
        if not user or not verify_password(password, user.password_hash):
            raise ValueError("Invalid username or password")
        
        if not user.is_active:
            raise ValueError("User account is disabled")

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.user_id)}, 
            expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    async def refresh_token(self, token: str) -> Token:
        """Làm mới access token"""
        # Implement token refresh logic here
        # For now, just return a new token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": "user_id"}, 
            expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
