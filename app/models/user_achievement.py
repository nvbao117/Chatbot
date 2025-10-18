from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    user_achievement_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements.achievement_id", ondelete="CASCADE"), nullable=False, index=True)
    earned_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    points_earned = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
    
    # Unique constraint
    __table_args__ = (
        {'extend_existing': True}
    )