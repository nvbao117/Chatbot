# backend/app/api/v1/endpoints/chatbot.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db
from backend.app.schemas.chatbot import ChatRequest, ChatResponse
from backend.app.services.chatbot_service import ChatbotService

router = APIRouter()


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    service = ChatbotService(db)
    try:
        return service.process_chat(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
