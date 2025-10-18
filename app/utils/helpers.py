from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import uuid
import re

def generate_uuid() -> str:
    """Tạo UUID string mới"""
    return str(uuid.uuid4())

def is_valid_uuid(uuid_string: str) -> bool:
    """Kiểm tra UUID có hợp lệ không"""
    try:
        uuid.UUID(uuid_string)
        return True
    except ValueError:
        return False

def format_datetime(dt: datetime) -> str:
    """Format datetime thành string"""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def calculate_age(birth_date: datetime) -> int:
    """Tính tuổi từ ngày sinh"""
    today = datetime.now()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_username(username: str) -> bool:
    """Validate username format"""
    pattern = r'^[a-zA-Z0-9_]{3,50}$'
    return re.match(pattern, username) is not None

def sanitize_string(text: str, max_length: int = 1000) -> str:
    """Làm sạch string input"""
    if not text:
        return ""
    
    # Loại bỏ ký tự đặc biệt nguy hiểm
    text = re.sub(r'[<>"\']', '', text)
    
    # Giới hạn độ dài
    if len(text) > max_length:
        text = text[:max_length]
    
    return text.strip()

def paginate_query(query, skip: int = 0, limit: int = 100):
    """Phân trang query"""
    return query.offset(skip).limit(limit)

def calculate_quiz_score(correct_answers: int, total_questions: int) -> float:
    """Tính điểm quiz"""
    if total_questions == 0:
        return 0.0
    return round((correct_answers / total_questions) * 100, 2)

def format_duration(seconds: int) -> str:
    """Format thời gian từ giây thành string"""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    
    if hours > 0:
        return f"{hours}h {minutes}m {seconds}s"
    elif minutes > 0:
        return f"{minutes}m {seconds}s"
    else:
        return f"{seconds}s"

def get_learning_level_color(level: str) -> str:
    """Lấy màu sắc cho level học tập"""
    colors = {
        "Beginner": "#28a745",
        "Intermediate": "#ffc107", 
        "Advanced": "#fd7e14",
        "Expert": "#dc3545"
    }
    return colors.get(level, "#6c757d")
