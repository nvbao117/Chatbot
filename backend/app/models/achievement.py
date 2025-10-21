from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.db import Base


class Achievement(Base):
    __tablename__ = "achievements"
    
    achievement_id = Column(Integer, primary_key=True, autoincrement=True)
    achievement_name = Column(String(100), nullable=False)
    achievement_description = Column(Text)
    icon = Column(String(10))
    category = Column(String(20), default='learning')  # 'learning', 'quiz', 'streak', 'social'
    points_required = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")