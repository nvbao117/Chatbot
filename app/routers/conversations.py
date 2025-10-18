from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import SessionLocal
from app.schemas.conversation import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse
from app.services.conversation_service import ConversationService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ConversationResponse)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tạo cuộc trò chuyện mới"""
    conversation_service = ConversationService(db)
    return await conversation_service.create_conversation(current_user.user_id, conversation_data)

@router.get("/", response_model=List[ConversationResponse])
async def get_user_conversations(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách cuộc trò chuyện của user"""
    conversation_service = ConversationService(db)
    return await conversation_service.get_user_conversations(current_user.user_id, skip, limit)

@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy thông tin cuộc trò chuyện"""
    conversation_service = ConversationService(db)
    conversation = await conversation_service.get_conversation(conversation_id, current_user.user_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Gửi tin nhắn trong cuộc trò chuyện"""
    conversation_service = ConversationService(db)
    return await conversation_service.send_message(conversation_id, current_user.user_id, message_data)

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy danh sách tin nhắn trong cuộc trò chuyện"""
    conversation_service = ConversationService(db)
    return await conversation_service.get_conversation_messages(conversation_id, current_user.user_id, skip, limit)

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Xóa cuộc trò chuyện"""
    conversation_service = ConversationService(db)
    await conversation_service.delete_conversation(conversation_id, current_user.user_id)
    return {"message": "Conversation deleted successfully"}
