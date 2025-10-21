from __future__ import annotations

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.db import Base, engine
from backend.app import models


def create_database_if_not_exists():
    try:
        conn = psycopg2.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database="postgres" 
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (settings.DB_NAME,))
        exists = cursor.fetchone()

        if not exists:
            cursor.execute(f"CREATE DATABASE {settings.DB_NAME}")
            print(f"Created database '{settings.DB_NAME}'")
        else:
            print(f"Database '{settings.DB_NAME}' already exists")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        raise

# def create_triggers():
#     """Tạo các trigger cho database."""
    
#     # Function chung để cập nhật updated_at
#     trigger_function = """
#     CREATE OR REPLACE FUNCTION update_updated_at_column()
#     RETURNS TRIGGER AS $$
#     BEGIN
#         NEW.updated_at = CURRENT_TIMESTAMP;
#         RETURN NEW;
#     END;
#     $$ language 'plpgsql';
#     """
    
#     triggers = [
#         {
#             "name": "update_users_updated_at",
#             "table": "users",
#             "sql": "CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
#         },
#         {
#             "name": "update_subjects_updated_at", 
#             "table": "subjects",
#             "sql": "CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
#         },
#         {
#             "name": "update_conversations_updated_at",
#             "table": "conversations", 
#             "sql": "CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
#         },
#         {
#             "name": "update_quiz_questions_updated_at",
#             "table": "quiz_questions",
#             "sql": "CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
#         },
#         {
#             "name": "update_learning_progress_updated_at",
#             "table": "learning_progress",
#             "sql": "CREATE TRIGGER update_learning_progress_updated_at BEFORE UPDATE ON learning_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
#         },
#         {
#             "name": "update_system_settings_updated_at",
#             "table": "system_settings",
#             "sql": "CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
#         }
#     ]
    
#     try:
#         with engine.connect() as conn:
#             # Tạo function trước
#             conn.execute(text(trigger_function))
#             print("Created trigger function: update_updated_at_column()")
            
#             for trigger in triggers:
#                 try:
#                     conn.execute(text(trigger["sql"]))
#                     print(f"Created trigger: {trigger['name']} for table {trigger['table']}")
#                 except Exception as e:
#                     print(f"Trigger {trigger['name']} might already exist: {e}")
            
#             conn.commit()
#             print("All triggers created successfully!")
            
#     except Exception as e:
#         print(f"Error creating triggers: {e}")
#         raise

# def create_functions():
#     """Tạo các stored functions hữu ích."""
    
#     functions = [
#         {
#             "name": "create_quiz_session",
#             "sql": """
#             CREATE OR REPLACE FUNCTION create_quiz_session(
#                 p_user_id UUID,
#                 p_subject_id INTEGER,
#                 p_topic_id INTEGER DEFAULT NULL,
#                 p_question_count INTEGER DEFAULT 10
#             )
#             RETURNS UUID AS $$
#             DECLARE
#                 v_session_id UUID;
#                 v_questions_count INTEGER;
#             BEGIN
#                 -- Tạo session mới
#                 INSERT INTO quiz_sessions (user_id, subject_id, topic_id, total_questions)
#                 VALUES (p_user_id, p_subject_id, p_topic_id, p_question_count)
#                 RETURNING session_id INTO v_session_id;
                
#                 -- Đếm số câu hỏi có sẵn
#                 SELECT COUNT(*) INTO v_questions_count
#                 FROM quiz_questions 
#                 WHERE subject_id = p_subject_id 
#                 AND (p_topic_id IS NULL OR topic_id = p_topic_id)
#                 AND is_active = TRUE;
                
#                 -- Cập nhật số câu hỏi thực tế
#                 UPDATE quiz_sessions 
#                 SET total_questions = LEAST(p_question_count, v_questions_count)
#                 WHERE session_id = v_session_id;
                
#                 RETURN v_session_id;
#             END;
#             $$ LANGUAGE plpgsql;
#             """
#         },
#         {
#             "name": "update_learning_progress",
#             "sql": """
#             CREATE OR REPLACE FUNCTION update_learning_progress(
#                 p_user_id UUID,
#                 p_subject_id INTEGER,
#                 p_topic_id INTEGER DEFAULT NULL,
#                 p_time_minutes INTEGER DEFAULT 0,
#                 p_quiz_score DECIMAL DEFAULT 0
#             )
#             RETURNS VOID AS $$
#             BEGIN
#                 INSERT INTO learning_progress 
#                 (user_id, subject_id, topic_id, total_time_minutes, average_score, last_activity_at)
#                 VALUES (p_user_id, p_subject_id, p_topic_id, p_time_minutes, p_quiz_score, CURRENT_TIMESTAMP)
#                 ON CONFLICT (user_id, subject_id, p_topic_id) 
#                 DO UPDATE SET
#                     total_time_minutes = learning_progress.total_time_minutes + p_time_minutes,
#                     average_score = (learning_progress.average_score + p_quiz_score) / 2,
#                     last_activity_at = CURRENT_TIMESTAMP,
#                     updated_at = CURRENT_TIMESTAMP;
#             END;
#             $$ LANGUAGE plpgsql;
#             """
#         },
#         {
#             "name": "search_quiz_questions",
#             "sql": """
#             CREATE OR REPLACE FUNCTION search_quiz_questions(
#                 p_search_term TEXT,
#                 p_subject_id INTEGER DEFAULT NULL,
#                 p_difficulty VARCHAR DEFAULT NULL,
#                 p_limit INTEGER DEFAULT 10
#             )
#             RETURNS TABLE (
#                 question_id UUID,
#                 question_text TEXT,
#                 difficulty_level VARCHAR,
#                 points INTEGER
#             ) AS $$
#             BEGIN
#                 RETURN QUERY
#                 SELECT qq.question_id, qq.question_text, qq.difficulty_level, qq.points
#                 FROM quiz_questions qq
#                 WHERE qq.is_active = TRUE
#                 AND (p_subject_id IS NULL OR qq.subject_id = p_subject_id)
#                 AND (p_difficulty IS NULL OR qq.difficulty_level = p_difficulty)
#                 AND (
#                     p_search_term IS NULL OR 
#                     to_tsvector('english', qq.question_text) @@ plainto_tsquery('english', p_search_term)
#                 )
#                 ORDER BY qq.created_at DESC
#                 LIMIT p_limit;
#             END;
#             $$ LANGUAGE plpgsql;
#             """
#         }
#     ]
    
#     try:
#         with engine.connect() as conn:
#             for func in functions:
#                 try:
#                     conn.execute(text(func["sql"]))
#                     print(f"Created function: {func['name']}")
#                 except Exception as e:
#                     print(f"Function {func['name']} might already exist: {e}")
            
#             conn.commit()
#             print("All functions created successfully!")
            
#     except Exception as e:
#         print(f"Error creating functions: {e}")
#         raise

# def create_views():
#     """Tạo các views hữu ích."""
    
#     views = [
#         {
#             "name": "user_statistics",
#             "sql": """
#             CREATE OR REPLACE VIEW user_statistics AS
#             SELECT 
#                 u.user_id,
#                 u.username,
#                 u.full_name,
#                 COUNT(DISTINCT c.conversation_id) as total_conversations,
#                 COUNT(DISTINCT qs.session_id) as total_quiz_sessions,
#                 COALESCE(AVG(qs.accuracy_percentage), 0) as avg_accuracy,
#                 COALESCE(SUM(lp.total_time_minutes), 0) as total_study_time,
#                 COUNT(DISTINCT ua.achievement_id) as total_achievements
#             FROM users u
#             LEFT JOIN conversations c ON u.user_id = c.user_id
#             LEFT JOIN quiz_sessions qs ON u.user_id = qs.user_id AND qs.status = 'completed'
#             LEFT JOIN learning_progress lp ON u.user_id = lp.user_id
#             LEFT JOIN user_achievements ua ON u.user_id = ua.user_id
#             WHERE u.is_active = TRUE
#             GROUP BY u.user_id, u.username, u.full_name;
#             """
#         },
#         {
#             "name": "detailed_learning_progress",
#             "sql": """
#             CREATE OR REPLACE VIEW detailed_learning_progress AS
#             SELECT 
#                 lp.user_id,
#                 u.username,
#                 s.subject_name,
#                 t.topic_name,
#                 lp.progress_percentage,
#                 lp.total_time_minutes,
#                 lp.lessons_completed,
#                 lp.quizzes_completed,
#                 lp.average_score,
#                 lp.last_activity_at
#             FROM learning_progress lp
#             JOIN users u ON lp.user_id = u.user_id
#             JOIN subjects s ON lp.subject_id = s.subject_id
#             LEFT JOIN topics t ON lp.topic_id = t.topic_id
#             WHERE u.is_active = TRUE AND s.is_active = TRUE;
#             """
#         }
#     ]
    
#     try:
#         with engine.connect() as conn:
#             for view in views:
#                 try:
#                     conn.execute(text(view["sql"]))
#                     print(f"Created view: {view['name']}")
#                 except Exception as e:
#                     print(f"View {view['name']} might already exist: {e}")
            
#             conn.commit()
#             print("All views created successfully!")
            
#     except Exception as e:
#         print(f"Error creating views: {e}")
#         raise


def init_db() -> None: 
    create_database_if_not_exists() 
    
if __name__ == "__main__":
    init_db()
