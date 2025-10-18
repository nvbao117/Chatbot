from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.user import UserUpdate, UserResponse
from app.models.user import User
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository
import uuid

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Lấy user theo ID"""
        return self.user_repo.get_by_id(user_id)

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Lấy danh sách users"""
        return self.user_repo.get_all(skip=skip, limit=limit, active_only=True)

    async def update_user(self, user_id: str, user_update: UserUpdate) -> User:
        """Cập nhật thông tin user"""
        # Cập nhật các trường được cung cấp
        update_data = user_update.dict(exclude_unset=True)
        
        if "password" in update_data:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))

        user = self.user_repo.update(user_id, update_data)
        if not user:
            raise ValueError("User not found")
        return user

    async def delete_user(self, user_id: str) -> bool:
        """Xóa user (soft delete)"""
        return self.user_repo.delete(user_id)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Lấy user theo email"""
        return self.user_repo.get_by_email(email)

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Lấy user theo username"""
        return self.user_repo.get_by_username(username)

    async def search_users(self, search_term: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Tìm kiếm users"""
        return self.user_repo.search_users(search_term, skip, limit)

    async def get_users_by_level(self, level: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Lấy users theo learning level"""
        return self.user_repo.get_by_learning_level(level, skip, limit)

    async def get_user_count(self) -> int:
        """Đếm số users"""
        return self.user_repo.count_users(active_only=True)
