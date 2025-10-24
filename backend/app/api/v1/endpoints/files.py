# backend/app/api/v1/endpoints/files.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.uploaded_file import UploadedFile
from backend.app.schemas.file import FileResponse

router = APIRouter()

@router.get("/", response_model=List[FileResponse])
def list_files(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: UUID = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(UploadedFile).filter(UploadedFile.is_active == True)
    
    if user_id:
        query = query.filter(UploadedFile.user_id == user_id)
    
    rows = query.offset(skip).limit(limit).all()
    return [FileResponse.model_validate(x) for x in rows]

@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user_id: UUID = Query(...),
    db: Session = Depends(get_db),
):
    # Save file logic here
    file_record = UploadedFile(
        user_id=user_id,
        filename=file.filename,
        file_size=file.size,
        content_type=file.content_type,
        file_path=f"uploads/{file.filename}"  # Implement actual file saving
    )
    db.add(file_record)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(file_record)
    return FileResponse.model_validate(file_record)

@router.get("/{file_id}", response_model=FileResponse)
def get_file(file_id: UUID, db: Session = Depends(get_db)):
    file_record = db.query(UploadedFile).filter(UploadedFile.file_id == file_id).first()
    if not file_record or not file_record.is_active:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse.model_validate(file_record)

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(file_id: UUID, db: Session = Depends(get_db)):
    file_record = db.query(UploadedFile).filter(UploadedFile.file_id == file_id).first()
    if not file_record or not file_record.is_active:
        raise HTTPException(status_code=404, detail="File not found")
    file_record.is_active = False
    db.commit()
    return None