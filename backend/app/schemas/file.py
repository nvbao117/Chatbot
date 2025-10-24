# backend/app/schemas/file.py
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class FileUploadBase(BaseModel):
    original_filename: str = Field(..., min_length=1, max_length=255)
    file_type: str = Field(..., min_length=1, max_length=100)
    file_size: int = Field(..., gt=0)
    file_path: str
    conversation_id: Optional[UUID] = None


class FileUploadCreate(FileUploadBase):
    pass


class FileUploadUpdate(BaseModel):
    original_filename: Optional[str] = Field(None, min_length=1, max_length=255)
    file_type: Optional[str] = Field(None, min_length=1, max_length=100)
    processing_status: Optional[str] = None
    extracted_text: Optional[str] = None
    file_metadata: Optional[Dict[str, Any]] = None


class FileUploadResponse(FileUploadBase):
    file_id: UUID
    user_id: UUID
    processing_status: str
    extracted_text: Optional[str] = None
    file_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FileProcessingStatus(BaseModel):
    file_id: UUID
    status: str  # 'pending' / 'processing' / 'completed' / 'failed'
    progress_percentage: int = 0
    error_message: Optional[str] = None
    processed_at: Optional[datetime] = None