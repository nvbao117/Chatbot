from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from backend.app.db import Base


class ActivityLog(Base):    
    __tablename__ = "activity_logs"
    
    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    activity_type = Column(String(20), nullable=False, index=True)  # 'login', 'logout', 'chat', 'quiz', 'file_upload', 'progress_update'
    activity_description = Column(Text)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id", ondelete="SET NULL"), nullable=True)
    activity_metadata = Column(JSONB)
    ip_address = Column(INET)
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User", back_populates="activity_logs")
    subject = relationship("Subject")