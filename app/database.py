from sqlalchemy import create_engine , text 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker 
from app.config import settings 
import psycopg2 
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging 

logging.basicConfig(level = logging.INFO) 
logger = logging.getLogger(__name__)  

def create_database_if_not_exists(): 
    "Tạo database nếu chưa tồn tại" 
    try : 
        conn = psycopg2.connect(
            host = settings.DB_HOST,
            port = settings.DB_PORT, 
            user = settings.DB_USER,
            password = settings.DB_PASSWORD,
            database = "postgres" 	
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # kiểm tra database có tồn tại không 
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{settings.DB_NAME}'") 
        exists = cursor.fetchone()

        if not exists: 
            cursor.execute(f"CREATE DATABASE {settings.DB_NAME}") 
            logger.info(f"Đã tạo database {settings.DB_NAME} thành công!") 
        else: 
            logger.info(f"Database {settings.DB_NAME} đã tồn tại!")   
        cursor.close() 
        conn.close()  
    except Exception as e : 
        logger.error(f"Lỗi khi tạo database: {e}") 
        raise 

# Khởi tạo database connection
DATABASE_URL = settings.DATABASE_URL  
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping = True, 
    pool_recycle=300,
    echo= settings.DEBUG 
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() 

def get_db(): 
    "Dependency để lấy database session" 
    db = SessionLocal() 
    try : 
        yield db 
    finally: 
        db.close() 

def create_table():
    try: 
        from app.models import (
            users, subject,topic , conversation , message , quiz_question, quiz_option, 
            quiz_session, quiz_ansers , learning_progress, achievements, user_achievements, 
            uploaded_files, activity_logs, system_settings
        )
        print(Base.metadata.tables.keys())

        Base.metadata.create_all(bind=engine) 
        logger.info("Đã tạo tất cả tables thành công!") 
    except Exception as e : 
        logger.error(f"Lỗi khi tạo tables: {e}") 
        raise 

if __name__ == "__main__":
    # Tạo database trước, sau đó tạo tables
    create_database_if_not_exists()
    create_table()      