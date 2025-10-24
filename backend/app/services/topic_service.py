# backend/app/services/topic_service.py
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.app.models.topic import Topic
from backend.app.schemas.topic import TopicCreate, TopicUpdate, TopicResponse


class TopicService:
    def __init__(self, db: Session):
        self.db = db
        
    
    def list_topics(self,skip:int = 0 , limit:int = 100 , subject_id:Optional[int] = None) -> List[TopicResponse] :
        query = self.db.query(Topic).filter(Topic.is_active==True) 
        if subject_id : 
            query = query.filter(Topic.subject_id == subject_id)  
    
        topics = query.offset(skip).limit(limit).all()
        return [TopicResponse.model_validate(topic) for topic in topics] 


    def get_topic(self, topic_id: int) -> Optional[Topic]:
        return self.db.query(Topic).filter(Topic.topic_id == topic_id).first()
    
    
    def create_topic(self,payload:TopicCreate) -> TopicResponse:
        topic = Topic(**payload.model_dump()) 
        self.db.add(topic) 
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Topic creation failed")
        self.db.refresh(topic)
        return TopicResponse.model_validate(topic)
    
    
    def update_topic(self,topic:Topic,payload:TopicUpdate) -> TopicResponse: 
        data = payload.model_dump(exclude_unset=True) 
        for field,value in data.items(): 
            setattr(topic,field,value) 
        self.db.commit()
        self.db.refresh(topic)
        return TopicResponse.model_validate(topic)
    

    def deactivate_topic(self, topic: Topic) -> None:
        topic.is_active = False
        self.db.commit()