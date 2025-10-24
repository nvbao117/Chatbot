# backend/app/api/v1/router.py
from fastapi import APIRouter

from backend.app.api.v1.endpoints import users as users_endpoints
from backend.app.api.v1.endpoints import auth as auth_endpoints
from backend.app.api.v1.endpoints import topics as topics_endpoints
from backend.app.api.v1.endpoints import subjects as subjects_endpoints
# from backend.app.api.v1.endpoints import quizzes as quizzes_endpoints
from backend.app.api.v1.endpoints import quiz_sesions as quiz_sessions_endpoints
from backend.app.api.v1.endpoints import chatbot as chatbot_endpoints
# from backend.app.api.v1.endpoints import files as files_endpoints
# from backend.app.api.v1.endpoints import achievements as achievements_endpoints
# from backend.app.api.v1.endpoints import progress as progress_endpoints
# from backend.app.api.v1.endpoints import analytics as analytics_endpoints

router = APIRouter()
router.include_router(auth_endpoints.router, prefix="/auth", tags=["Auth"])
router.include_router(users_endpoints.router, prefix="/users", tags=["Users"])
router.include_router(topics_endpoints.router, prefix="/topics", tags=["Topics"])
router.include_router(subjects_endpoints.router, prefix="/subjects", tags=["Subjects"])
# router.include_router(quizzes_endpoints.router, prefix="/quizzes", tags=["Quizzes"])
router.include_router(quiz_sessions_endpoints.router, prefix="/quiz-sessions", tags=["Quiz Sessions"])
router.include_router(chatbot_endpoints.router, prefix="/chatbot", tags=["Chatbot"])
# router.include_router(files_endpoints.router, prefix="/files", tags=["Files"])
# router.include_router(achievements_endpoints.router, prefix="/achievements", tags=["Achievements"])
# router.include_router(progress_endpoints.router, prefix="/progress", tags=["Progress"])
# router.include_router(analytics_endpoints.router, prefix="/analytics", tags=["Analytics"])