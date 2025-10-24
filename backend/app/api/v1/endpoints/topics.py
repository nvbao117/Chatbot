# backend/app/api/v1/endpoints/topics.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.api.deps import get_db
from backend.app.models.topic import Topic
from backend.app.schemas.topic import TopicCreate, TopicUpdate, TopicResponse

router = APIRouter()

@router.get("/", response_model=List[TopicResponse])
def list_topics(skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Topic)
        .filter(Topic.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [TopicResponse.model_validate(x) for x in rows]

@router.post("/", response_model=TopicResponse, status_code=status.HTTP_201_CREATED)
def create_topic(payload: TopicCreate, db: Session = Depends(get_db)):
    topic = Topic(**payload.model_dump())
    db.add(topic)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    db.refresh(topic)
    return TopicResponse.model_validate(topic)

@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if not topic or not topic.is_active:
        raise HTTPException(status_code=404, detail="Topic not found")
    return TopicResponse.model_validate(topic)

@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(topic_id: int, payload: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if not topic or not topic.is_active:
        raise HTTPException(status_code=404, detail="Topic not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(topic, k, v)
    db.commit()
    db.refresh(topic)
    return TopicResponse.model_validate(topic)

@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if not topic or not topic.is_active:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic.is_active = False
    db.commit()
    return None