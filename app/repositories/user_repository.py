from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.models.user import User
import uuid

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user: User) -> User:
        """Tạo user mới"""
        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("User with this email or username already exists")

    def get_by_id(self, user_id: str) -> Optional[User]:
        """Lấy user theo ID"""
        try:
            user_uuid = uuid.UUID(user_id)
            return self.db.query(User).filter(User.user_id == user_uuid).first()
        except ValueError:
            return None

    def get_by_email(self, email: str) -> Optional[User]:
        """Lấy user theo email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str) -> Optional[User]:
        """Lấy user theo username"""
        return self.db.query(User).filter(User.username == username).first()

    def get_all(self, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[User]:
        """Lấy danh sách users"""
        query = self.db.query(User)
        if active_only:
            query = query.filter(User.is_active == True)
        return query.offset(skip).limit(limit).all()

    def update(self, user_id: str, update_data: dict) -> Optional[User]:
        """Cập nhật user"""
        user = self.get_by_id(user_id)
        if not user:
            return None

        for field, value in update_data.items():
            if hasattr(user, field):
                setattr(user, field, value)

        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Update failed due to data conflict")

    def delete(self, user_id: str) -> bool:
        """Xóa user (soft delete)"""
        user = self.get_by_id(user_id)
        if not user:
            return False

        user.is_active = False
        self.db.commit()
        return True

    def hard_delete(self, user_id: str) -> bool:
        """Xóa user vĩnh viễn"""
        user = self.get_by_id(user_id)
        if not user:
            return False

        self.db.delete(user)
        self.db.commit()
        return True

    def get_by_learning_level(self, level: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Lấy users theo learning level"""
        return self.db.query(User).filter(
            User.learning_level == level,
            User.is_active == True
        ).offset(skip).limit(limit).all()

    def search_users(self, search_term: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Tìm kiếm users theo tên hoặc username"""
        search_pattern = f"%{search_term}%"
        return self.db.query(User).filter(
            User.is_active == True,
            (User.full_name.ilike(search_pattern) | User.username.ilike(search_pattern))
        ).offset(skip).limit(limit).all()

    def count_users(self, active_only: bool = True) -> int:
        """Đếm số lượng users"""
        query = self.db.query(User)
        if active_only:
            query = query.filter(User.is_active == True)
        return query.count()
