from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ValidationError
import re

class ValidationResult:
    def __init__(self, is_valid: bool, errors: List[str] = None):
        self.is_valid = is_valid
        self.errors = errors or []

def validate_password_strength(password: str) -> ValidationResult:
    """Validate độ mạnh của password"""
    errors = []
    
    if len(password) < 6:
        errors.append("Password must be at least 6 characters long")
    
    if len(password) > 100:
        errors.append("Password must be less than 100 characters")
    
    if not re.search(r'[A-Za-z]', password):
        errors.append("Password must contain at least one letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    return ValidationResult(len(errors) == 0, errors)

def validate_learning_level(level: str) -> ValidationResult:
    """Validate learning level"""
    valid_levels = ["Beginner", "Intermediate", "Advanced", "Expert"]
    
    if level not in valid_levels:
        return ValidationResult(False, [f"Learning level must be one of: {', '.join(valid_levels)}"])
    
    return ValidationResult(True)

def validate_language_code(language: str) -> ValidationResult:
    """Validate language code"""
    valid_languages = ["vi", "en", "ja", "ko", "zh"]
    
    if language not in valid_languages:
        return ValidationResult(False, [f"Language must be one of: {', '.join(valid_languages)}"])
    
    return ValidationResult(True)

def validate_timezone(timezone: str) -> ValidationResult:
    """Validate timezone"""
    valid_timezones = [
        "Asia/Ho_Chi_Minh",
        "Asia/Bangkok", 
        "Asia/Tokyo",
        "Asia/Seoul",
        "Asia/Shanghai",
        "UTC"
    ]
    
    if timezone not in valid_timezones:
        return ValidationResult(False, [f"Timezone must be one of: {', '.join(valid_timezones)}"])
    
    return ValidationResult(True)

def validate_quiz_difficulty(difficulty: str) -> ValidationResult:
    """Validate quiz difficulty level"""
    valid_difficulties = ["Easy", "Medium", "Hard", "Expert"]
    
    if difficulty not in valid_difficulties:
        return ValidationResult(False, [f"Difficulty must be one of: {', '.join(valid_difficulties)}"])
    
    return ValidationResult(True)

def validate_message_type(message_type: str) -> ValidationResult:
    """Validate message type"""
    valid_types = ["user", "ai", "system", "notification"]
    
    if message_type not in valid_types:
        return ValidationResult(False, [f"Message type must be one of: {', '.join(valid_types)}"])
    
    return ValidationResult(True)

def validate_quiz_status(status: str) -> ValidationResult:
    """Validate quiz session status"""
    valid_statuses = ["in_progress", "completed", "cancelled", "paused"]
    
    if status not in valid_statuses:
        return ValidationResult(False, [f"Status must be one of: {', '.join(valid_statuses)}"])
    
    return ValidationResult(True)

def validate_pagination_params(skip: int, limit: int) -> ValidationResult:
    """Validate pagination parameters"""
    errors = []
    
    if skip < 0:
        errors.append("Skip must be non-negative")
    
    if limit < 1:
        errors.append("Limit must be at least 1")
    
    if limit > 1000:
        errors.append("Limit must be at most 1000")
    
    return ValidationResult(len(errors) == 0, errors)

def validate_uuid_format(uuid_string: str) -> ValidationResult:
    """Validate UUID format"""
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    
    if not re.match(uuid_pattern, uuid_string, re.IGNORECASE):
        return ValidationResult(False, ["Invalid UUID format"])
    
    return ValidationResult(True)
