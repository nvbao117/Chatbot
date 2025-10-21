from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from backend.app.db import Base


class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    file_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.conversation_id", ondelete="SET NULL"), nullable=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False, index=True)
    file_size = Column(BigInteger, nullable=False)
    file_path = Column(Text, nullable=False)
    processing_status = Column(String(20), default='pending', index=True)  # 'pending', 'processing', 'completed', 'failed'
    extracted_text = Column(Text)
    file_metadata = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="uploaded_files")
    conversation = relationship("Conversation", back_populates="uploaded_files")