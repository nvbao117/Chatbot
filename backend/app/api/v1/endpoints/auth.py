# backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db
from backend.app.core.security import get_current_active_user
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest, RegisterRequest, Token
from backend.app.schemas.user import UserResponse
from backend.app.services.auth_service import AuthService


router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED) 
def register(payload: RegisterRequest, db:Session=Depends(get_db)) -> UserResponse : 
    service = AuthService(db) 
    try:
        return service.register(payload) 
    except ValueError as exc : 
        raise HTTPException(status_code=400, detail=str(exc)) 
    

@router.post("/login", response_model=Token) 
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> Token:
    service = AuthService(db) 
    try:
        return service.authenticate(payload)
    except ValueError as exc: 
        raise HTTPException(status_code=400, detail=str(exc))
    
    
@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_active_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)