# Chatbot Study API - Hướng dẫn Setup

## 🚀 Cấu trúc dự án đã được cải thiện

Dự án đã được tổ chức lại theo chuẩn FastAPI và best practices:

```
app/
├── __init__.py                 # Package initialization
├── main.py                     # FastAPI application entry point
├── core/                       # Core configuration
│   ├── __init__.py
│   ├── config.py              # Environment settings
│   └── security.py            # JWT & password hashing
├── db/                        # Database layer
│   ├── __init__.py
│   ├── database.py            # Database connection
│   └── init_db.py             # Database initialization
├── models/                    # SQLAlchemy models
│   ├── __init__.py
│   └── [model files]
├── schemas/                   # Pydantic schemas
│   ├── __init__.py
│   ├── user.py
│   ├── conversation.py
│   ├── quiz.py
│   └── common.py
├── repositories/              # Data access layer (Repository Pattern)
│   ├── __init__.py
│   ├── user_repository.py
│   ├── conversation_repository.py
│   ├── quiz_repository.py
│   ├── progress_repository.py
│   └── achievement_repository.py
├── services/                  # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py
│   ├── user_service.py
│   ├── conversation_service.py
│   └── quiz_service.py
├── routers/                   # API endpoints
│   ├── __init__.py
│   ├── auth.py
│   ├── users.py
│   ├── conversations.py
│   └── quiz.py
└── utils/                     # Utility functions
    ├── __init__.py
    ├── helpers.py
    └── validators.py
```

## 📋 Các cải thiện đã thực hiện

### ✅ **Đã sửa:**
1. **File main.py** - Tạo FastAPI app hoàn chỉnh với CORS, routers
2. **Import paths** - Sửa tất cả import để đúng cấu trúc
3. **Package structure** - Tạo __init__.py cho tất cả packages
4. **API Routers** - Tạo đầy đủ endpoints cho auth, users, conversations, quiz
5. **Service Layer** - Tạo business logic layer tách biệt
6. **Repository Layer** - Tạo data access layer với Repository Pattern
7. **Schema Models** - Tạo Pydantic schemas cho request/response
8. **Utils** - Tạo helper functions và validators
9. **Environment** - Tạo file env.example

### 🔧 **Cần làm thêm:**
1. **Cài đặt dependencies** - `pip install -r requirements.txt`
2. **Tạo file .env** - Copy từ env.example và điền thông tin
3. **Khởi tạo database** - Chạy init_db.py
4. **Test API** - Chạy server và test endpoints

## 🏗️ **Kiến trúc Repository Pattern**

### **Tại sao cần Repository Pattern?**
- **Tách biệt data access** khỏi business logic
- **Dễ dàng test** - có thể mock repository
- **Dễ dàng thay đổi database** - chỉ cần thay repository
- **Code reuse** - nhiều service có thể dùng chung repository
- **Single Responsibility** - mỗi repository chỉ lo 1 entity

### **Cấu trúc Repository:**
```
repositories/
├── user_repository.py          # User data access
├── conversation_repository.py  # Conversation & Message data access
├── quiz_repository.py          # Quiz data access
├── progress_repository.py      # Learning progress data access
└── achievement_repository.py   # Achievement data access
```

### **Ví dụ sử dụng:**
```python
# Service sử dụng Repository
class UserService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
    
    async def get_user(self, user_id: str):
        return self.user_repo.get_by_id(user_id)
```

## 🚀 Hướng dẫn chạy dự án

### 1. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

### 2. Tạo file .env:
```bash
cp env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

### 3. Khởi tạo database:
```bash
python -m app.db.init_db
```

### 4. Chạy server:
```bash
python -m app.main
# hoặc
uvicorn app.main:app --reload
```

### 5. Truy cập API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Đăng ký tài khoản
- `POST /login` - Đăng nhập
- `POST /refresh` - Làm mới token
- `POST /logout` - Đăng xuất

### Users (`/api/v1/users`)
- `GET /me` - Thông tin user hiện tại
- `GET /` - Danh sách users (admin)
- `GET /{user_id}` - Thông tin user theo ID
- `PUT /me` - Cập nhật thông tin
- `DELETE /me` - Xóa tài khoản

### Conversations (`/api/v1/conversations`)
- `POST /` - Tạo cuộc trò chuyện
- `GET /` - Danh sách cuộc trò chuyện
- `GET /{conversation_id}` - Chi tiết cuộc trò chuyện
- `POST /{conversation_id}/messages` - Gửi tin nhắn
- `GET /{conversation_id}/messages` - Lấy tin nhắn
- `DELETE /{conversation_id}` - Xóa cuộc trò chuyện

### Quiz (`/api/v1/quiz`)
- `POST /sessions` - Tạo phiên quiz
- `GET /sessions` - Danh sách phiên quiz
- `GET /sessions/{session_id}` - Chi tiết phiên quiz
- `POST /sessions/{session_id}/answers` - Nộp câu trả lời
- `GET /sessions/{session_id}/questions` - Lấy câu hỏi
- `POST /sessions/{session_id}/complete` - Hoàn thành quiz

## 🔒 Security Features

- JWT Authentication
- Password hashing với bcrypt
- CORS middleware
- Input validation với Pydantic
- SQL injection protection với SQLAlchemy

## 📊 Database Features

- PostgreSQL với SQLAlchemy ORM
- UUID primary keys
- Automatic timestamps
- Database triggers
- Stored functions
- Views cho statistics

## 🎯 Next Steps

1. **Thêm middleware** - Logging, rate limiting
2. **Thêm caching** - Redis cho performance
3. **Thêm tests** - Unit tests, integration tests
4. **Thêm CI/CD** - GitHub Actions
5. **Thêm monitoring** - Health checks, metrics
6. **Thêm documentation** - API documentation chi tiết

Dự án của bạn giờ đã có cấu trúc chuyên nghiệp và sẵn sàng để phát triển! 🎉
