from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel

class BaseResponse(BaseModel):
    success: bool = True
    message: str = "Success"

class PaginatedResponse(BaseResponse):
    data: list[Any]
    total: int
    skip: int
    limit: int
    
class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class HealthCheckResponse(BaseResponse):
    status: str = "healthy"
    timestamp: datetime
    database: str = "connected"