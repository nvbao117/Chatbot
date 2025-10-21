from sqlalchemy import Column , String , Boolean , DateTime , Text, Date 
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship 
import uuid 
from backend.app.db import Base


class User(Base): 
    __tablename__ = "users" 
     
    user_id = Column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4) 
    username = Column(String(50),unique = True , nullable = False, index = True)  
    email = Column(String(100), unique= True , nullable = False , index = True ) 
    password_hash = Column(String(255),nullable = False)  
    full_name = Column(String(100),nullable = False)  
    avatar_url = Column(Text) 
    date_of_birth = Column(Date) 
    learning_level = Column(String(20),default = "Beginner")
    preferred_language = Column(String(10),default = "vi")  
    timezone = Column(String(50),default = "Asia/Ho_Chi_Minh")  
    is_active = Column(Boolean, default=True, index=True)
    is_premium = Column(Boolean, default=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()) 

    # relationships 
    conversations = relationship("Conversation",back_populates="user",cascade = "all, delete-orphan")  
    messages = relationship("Message",back_populates="user",cascade = "all, delete-orphan")
    quiz_sessions = relationship("QuizSession",back_populates="user",cascade = "all, delete-orphan") 
    learning_progress = relationship("LearningProgress", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    uploaded_files = relationship("UploadedFile", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    created_questions = relationship("QuizQuestion", back_populates="creator") 
    quiz_answers = relationship("QuizAnswer", back_populates="user", cascade="all, delete-orphan")
