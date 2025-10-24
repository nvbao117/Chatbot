# backend/app/services/user_service.py
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserResponse, UserUpdate
from backend.app.core import security

class UserService:
    def __init__(self, db: Session):
        self.db = db


    def list_users(self,skip:int=0,limit:int = 100) -> List[UserResponse] : 
        users = (
            self.db.query(User).filter(User.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [UserResponse.model_validate(user) for user in users]
    
    
    def get_user(self,user_id:UUID) -> Optional[User] :
        return self.db.query(User).filter(User.user_id == user_id).first() 


    def create_user(self,payload:UserCreate) -> UserResponse: 
        if self.db.query(User).filter(User.username == payload.username).first():
            raise ValueError("Username already taken")
        if self.db.query(User).filter(User.email == payload.email).first():
            raise ValueError("Email already registered")
        
        user = User(
            username =payload.username,
            email = payload.email,
            password_hash=security.get_password_hash(payload.password),
            full_name=payload.full_name,
            date_of_birth = payload.date_of_birth,
            learning_level = payload.learning_level,
            preferred_language=payload.preferred_language,
            timezone = payload.timezone,
        )

        self.db.add(user) 
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise
        
        self.db.refresh(user)
        return UserResponse.model_validate(user) 
        
        
    def update_user(self,user:User,payload:UserUpdate) ->UserResponse  : 
        data = payload.model_dump(exclude_unset=True)
        if "password" in data and data["password"] : 
            data["password_hash"] = security.get_password_hash(data.pop("password")) 
        for field, value in data.items():
            setattr(user,field,value) 
        self.db.commit()
        self.db.refresh(user)
        return UserResponse.model_validate(user)
    
    
    def deactivate_user(self,user:User) -> None : 
        user.is_active = False
        self.db.commit()
