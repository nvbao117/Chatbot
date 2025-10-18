from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class BaseResponse(BaseModel):
    """Base response model"""
    success: bool = True
    message: str = "Success"
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class PaginationParams(BaseModel):
    """Pagination parameters"""
    skip: int = 0
    limit: int = 100

class PaginatedResponse(BaseModel):
    """Paginated response model"""
    items: list
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str = "healthy"
    timestamp: datetime
    version: str
    database: str = "connected"
