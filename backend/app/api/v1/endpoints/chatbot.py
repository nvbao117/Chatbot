# backend/app/api/v1/endpoints/chatbot.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db
from backend.app.schemas.chatbot import ChatRequestBaseModel, ChatResponseBaseModel
from backend.app.services.chatbot_service import ChatbotService
from backend.app.core.security import get_current_user
from backend.app.models.user import User
router = APIRouter()


@router.post("/chat", response_model=ChatResponseBaseModel)
async def chat_endpoint(
    request: ChatRequestBaseModel,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    service = ChatbotService(db, user)
    try:
        response = await service.handle_message(
            message=request.message,
            conversationid=request.conversationid
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))