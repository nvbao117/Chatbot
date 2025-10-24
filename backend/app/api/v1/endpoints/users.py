# backend/app/api/v1/endpoints/users.py
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db
from backend.app.schemas.user import UserCreate, UserResponse, UserUpdate
from backend.app.services.user_service import UserService

router = APIRouter()


@router.get("/",response_model=list[UserResponse]) 
def list_users(skip: int = Query(0,ge=0),limit:int=Query(50,ge=1,le=100),db:Session=Depends(get_db)): 
    service = UserService(db) 
    return service.list_users(skip=skip, limit=limit) 


@router.post("/",response_model=UserResponse,status_code= status.HTTP_201_CREATED)
def create_user(payload:UserCreate,db:Session=Depends(get_db)):
    service = UserService(db)
    try:
        return service.create_user(payload)
    except ValueError as exc  : 
        raise HTTPException(status_code=400,detail=str(exc))                   


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    service = UserService(db)
    user = service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, payload: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)
    user = service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return service.update_user(user, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    service = UserService(db)
    user = service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    service.deactivate_user(user)
    return None